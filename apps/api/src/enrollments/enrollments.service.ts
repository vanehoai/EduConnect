import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus, SemesterStatus, Prisma, ClassSectionStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        student: {
          select: { studentCode: true, fullName: true },
        },
        classSection: {
          select: { sectionCode: true, course: { select: { name: true, credits: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: {
          select: { studentCode: true, fullName: true },
        },
        classSection: {
          select: { sectionCode: true, course: { select: { name: true, credits: true } } },
        },
      },
    });
    if (!enrollment) throw new NotFoundException('Không tìm thấy đăng ký học');
    return enrollment;
  }

  async findMyEnrollments(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new BadRequestException('Không tìm thấy sinh viên');

    return this.prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        classSection: {
          include: {
            course: true,
            schedules: true,
            lecturer: { select: { fullName: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async enrollAdmin(
    studentId: string,
    classSectionId: string,
    actorUserId: string,
    metadata: RequestMetadata,
  ) {
    return this.enroll(studentId, classSectionId, actorUserId, metadata);
  }

  async enrollStudent(userId: string, classSectionId: string, metadata: RequestMetadata) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new BadRequestException('Không tìm thấy sinh viên');
    return this.enroll(student.id, classSectionId, userId, metadata);
  }

  private async enroll(
    studentId: string,
    classSectionId: string,
    actorUserId: string,
    metadata: RequestMetadata,
  ) {
    const classSection = await this.prisma.classSection.findUnique({
      where: { id: classSectionId },
      include: { semester: true, course: { include: { prerequisites: true } }, schedules: true },
    });

    if (!classSection) throw new NotFoundException('Không tìm thấy lớp học phần');
    if (classSection.status !== 'OPEN' && classSection.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Lớp học phần không ở trạng thái mở đăng ký');
    }

    const semester = classSection.semester;
    const now = new Date();
    if (semester.status !== SemesterStatus.REGISTRATION_OPEN) {
      throw new BadRequestException('Học kỳ chưa mở đăng ký');
    }
    if (now < semester.registrationStartDate || now > semester.registrationEndDate) {
      throw new BadRequestException('Ngoài thời gian đăng ký học kỳ này');
    }

    // 1. Không đăng ký 2 lớp cùng Course trong cùng Semester
    const existingCourseEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        status: EnrollmentStatus.ENROLLED,
        classSection: {
          semesterId: semester.id,
          courseId: classSection.courseId,
        },
      },
    });
    if (existingCourseEnrollment) {
      throw new BadRequestException('Đã đăng ký một lớp khác của môn học này trong học kỳ');
    }

    // 2. Tổng tín chỉ không vượt maxCredits
    const currentEnrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        status: EnrollmentStatus.ENROLLED,
        classSection: { semesterId: semester.id },
      },
      include: {
        classSection: { include: { course: true, schedules: true } },
      },
    });

    const currentCredits = currentEnrollments.reduce(
      (sum, en) => sum + en.classSection.course.credits,
      0,
    );
    if (currentCredits + classSection.course.credits > semester.maxCredits) {
      throw new BadRequestException(`Vượt quá số tín chỉ tối đa (${semester.maxCredits})`);
    }

    // 3. Không trùng lịch học
    for (const en of currentEnrollments) {
      for (const currentSchedule of en.classSection.schedules) {
        for (const newSchedule of classSection.schedules) {
          if (currentSchedule.dayOfWeek === newSchedule.dayOfWeek) {
            const cValidFrom = currentSchedule.validFrom?.getTime() || 0;
            const cValidTo = currentSchedule.validTo?.getTime() || Infinity;
            const nValidFrom = newSchedule.validFrom?.getTime() || 0;
            const nValidTo = newSchedule.validTo?.getTime() || Infinity;

            if (Math.max(cValidFrom, nValidFrom) <= Math.min(cValidTo, nValidTo)) {
              const cStart = currentSchedule.startTime.getTime();
              const cEnd = currentSchedule.endTime.getTime();
              const nStart = newSchedule.startTime.getTime();
              const nEnd = newSchedule.endTime.getTime();

              if (Math.max(cStart, nStart) < Math.min(cEnd, nEnd)) {
                throw new BadRequestException(
                  `Trùng lịch học với lớp ${en.classSection.sectionCode} của môn ${en.classSection.course.name}`,
                );
              }
            }
          }
        }
      }
    }

    // 4. Đạt prerequisite
    for (const prereq of classSection.course.prerequisites) {
      const condition: Prisma.EnrollmentWhereInput = {
        studentId,
        status: EnrollmentStatus.COMPLETED,
        passed: true,
        finalGradePublishedAt: { not: null },
        classSection: { courseId: prereq.prerequisiteCourseId },
      };

      if (prereq.minimumGrade) {
        condition.finalScore = { gte: prereq.minimumGrade };
      }

      const passedPrereq = await this.prisma.enrollment.findFirst({
        where: condition,
      });

      if (!passedPrereq) {
        throw new BadRequestException('Chưa đạt môn tiên quyết');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Race condition check using SELECT ... FOR UPDATE
      const sections = await tx.$queryRaw<
        { enrolledCount: number; maxCapacity: number; status: string }[]
      >`SELECT "enrolledCount", "maxCapacity", "status" FROM "ClassSection" WHERE "id" = ${classSectionId} FOR UPDATE`;
      if (!sections || sections.length === 0) {
        throw new NotFoundException('Không tìm thấy lớp học phần');
      }
      const section = sections[0]!;

      const alreadyEnrolled = await tx.enrollment.findUnique({
        where: { studentId_classSectionId: { studentId, classSectionId } },
      });
      if (alreadyEnrolled?.status === 'ENROLLED') {
        throw new BadRequestException('Bạn đã đăng ký lớp này rồi');
      }

      if (section.enrolledCount >= section.maxCapacity) {
        throw new BadRequestException('Lớp đã hết chỗ');
      }

      const newCount = section.enrolledCount + 1;
      const newStatus = newCount >= section.maxCapacity ? 'FULL' : section.status;

      await tx.classSection.update({
        where: { id: classSectionId },
        data: { enrolledCount: newCount, status: newStatus as ClassSectionStatus },
      });

      const enrollment = await tx.enrollment.upsert({
        where: {
          studentId_classSectionId: { studentId, classSectionId },
        },
        update: {
          status: EnrollmentStatus.ENROLLED,
          enrolledAt: new Date(),
          droppedAt: null,
        },
        create: {
          studentId,
          classSectionId,
          status: EnrollmentStatus.ENROLLED,
          enrolledAt: new Date(),
        },
      });

      await this.audit.record(
        {
          actorUserId,
          action: 'ENROLL',
          entityType: 'Enrollment',
          entityId: enrollment.id,
          newValues: { studentId, classSectionId },
          metadata,
        },
        tx,
      );

      // Get student userId for notification
      const stu = await tx.student.findUnique({ where: { id: studentId } });
      if (stu) {
        await tx.notification.create({
          data: {
            userId: stu.userId,
            type: 'ENROLLMENT_SUCCESS',
            title: 'Đăng ký học phần thành công',
            content: `Bạn đã đăng ký thành công lớp ${classSection.sectionCode}.`,
          },
        });
      }

      return enrollment;
    });
  }

  async cancelAdmin(id: string, actorUserId: string, metadata: RequestMetadata) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id } });
    if (!enrollment) throw new NotFoundException('Không tìm thấy đăng ký');
    return this.cancel(enrollment.studentId, enrollment.classSectionId, actorUserId, metadata);
  }

  async cancelStudent(userId: string, classSectionId: string, metadata: RequestMetadata) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new BadRequestException('Không tìm thấy sinh viên');
    return this.cancel(student.id, classSectionId, userId, metadata);
  }

  private async cancel(
    studentId: string,
    classSectionId: string,
    actorUserId: string,
    metadata: RequestMetadata,
  ) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_classSectionId: { studentId, classSectionId } },
      include: { classSection: { include: { semester: true } } },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ENROLLED) {
      throw new BadRequestException('Không tìm thấy đăng ký hoặc đã hủy');
    }

    const semester = enrollment.classSection.semester;
    const now = new Date();
    if (semester.status !== SemesterStatus.REGISTRATION_OPEN) {
      throw new BadRequestException('Học kỳ không trong thời gian cho phép hủy');
    }
    if (now < semester.registrationStartDate || now > semester.registrationEndDate) {
      throw new BadRequestException('Ngoài thời gian hủy đăng ký');
    }

    return this.prisma.$transaction(async (tx) => {
      const sections = await tx.$queryRaw<
        { enrolledCount: number; status: string }[]
      >`SELECT "enrolledCount", "status" FROM "ClassSection" WHERE "id" = ${classSectionId} FOR UPDATE`;
      const section = sections[0]!;
      const newCount = Math.max(0, section.enrolledCount - 1);
      const newStatus = section.status === 'FULL' ? 'OPEN' : section.status;

      await tx.classSection.update({
        where: { id: classSectionId },
        data: { enrolledCount: newCount, status: newStatus as ClassSectionStatus },
      });

      const updated = await tx.enrollment.update({
        where: { studentId_classSectionId: { studentId, classSectionId } },
        data: {
          status: EnrollmentStatus.DROPPED,
          droppedAt: new Date(),
        },
      });

      await this.audit.record(
        {
          actorUserId,
          action: 'CANCEL_ENROLL',
          entityType: 'Enrollment',
          entityId: updated.id,
          oldValues: { status: EnrollmentStatus.ENROLLED },
          newValues: { status: EnrollmentStatus.DROPPED },
          metadata,
        },
        tx,
      );

      return updated;
    });
  }
}

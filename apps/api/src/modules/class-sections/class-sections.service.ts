import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassSectionDto, UpdateClassSectionDto } from './dto/class-section.dto';
import { ClassSectionStatus, Prisma } from '@prisma/client';

@Injectable()
export class ClassSectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassSectionDto: CreateClassSectionDto, actorUserId: string) {
    const { courseId, semesterId, lecturerId, sectionCode } = createClassSectionDto;

    // Validate relations
    const [course, semester, lecturer] = await Promise.all([
      this.prisma.course.findFirst({ where: { id: courseId, deletedAt: null } }),
      this.prisma.semester.findUnique({ where: { id: semesterId } }),
      this.prisma.lecturer.findFirst({
        where: { id: lecturerId, deletedAt: null, status: 'ACTIVE' },
      }),
    ]);

    if (!course) throw new NotFoundException('Course not found or inactive');
    if (!semester) throw new NotFoundException('Semester not found');
    if (semester.status === 'COMPLETED' || semester.status === 'CLOSED') {
      throw new BadRequestException(
        'Cannot open a class section in a completed or closed semester',
      );
    }
    if (!lecturer) throw new NotFoundException('Lecturer not found or inactive');

    // Check unique sectionCode in same semester
    const existing = await this.prisma.classSection.findUnique({
      where: {
        courseId_semesterId_sectionCode: {
          courseId,
          semesterId,
          sectionCode,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Class section code already exists for this course in this semester',
      );
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const classSection = await tx.classSection.create({
        data: {
          ...createClassSectionDto,
          status: 'DRAFT',
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'ClassSection',
          entityId: classSection.id,
          actorUserId,
          newValues: classSection as unknown as Prisma.InputJsonValue,
        },
      });

      return classSection;
    });
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    courseId?: string;
    semesterId?: string;
    departmentId?: string;
    lecturerId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page,
      limit,
      search,
      courseId,
      semesterId,
      departmentId,
      lecturerId,
      status,
      sortBy,
      sortOrder,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ClassSectionWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [
        { sectionCode: { contains: search, mode: 'insensitive' } },
        { course: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (courseId) where.courseId = courseId;
    if (semesterId) where.semesterId = semesterId;
    if (lecturerId) where.lecturerId = lecturerId;
    if (departmentId) where.course = { departmentId };
    if (status) where.status = status as ClassSectionStatus;

    const validSortFields = ['createdAt', 'sectionCode', 'enrolledCount', 'maxCapacity'];
    const orderBy: Record<string, string> = {};
    if (sortBy && validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [total, data] = await Promise.all([
      this.prisma.classSection.count({ where }),
      this.prisma.classSection.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          course: { select: { id: true, name: true, courseCode: true } },
          semester: { select: { id: true, name: true } },
          lecturer: { select: { id: true, fullName: true, lecturerCode: true } },
        },
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedData = data.map((d: any) => ({
      ...d,
      availableSlots: Math.max(0, d.maxCapacity - d.enrolledCount),
    }));

    return {
      success: true,
      message: 'Class sections retrieved successfully',
      data: mappedData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const classSection = await this.prisma.classSection.findUnique({
      where: { id, deletedAt: null },
      include: {
        course: true,
        semester: true,
        lecturer: true,
      },
    });

    if (!classSection) {
      throw new NotFoundException('Class section not found');
    }

    return {
      success: true,
      message: 'Class section retrieved successfully',
      data: {
        ...classSection,
        availableSlots: Math.max(0, classSection.maxCapacity - classSection.enrolledCount),
      },
    };
  }

  async update(id: string, updateDto: UpdateClassSectionDto, actorUserId: string) {
    const classSection = await this.prisma.classSection.findUnique({
      where: { id, deletedAt: null },
      include: { semester: true },
    });

    if (!classSection) {
      throw new NotFoundException('Class section not found');
    }

    if (classSection.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update a completed class section');
    }
    if (classSection.semester.status === 'COMPLETED' || classSection.semester.status === 'CLOSED') {
      throw new BadRequestException(
        'Cannot modify class section in a completed or closed semester',
      );
    }

    if (updateDto.maxCapacity !== undefined && updateDto.maxCapacity < classSection.enrolledCount) {
      throw new BadRequestException('Max capacity cannot be less than current enrolled count');
    }

    if (updateDto.lecturerId && updateDto.lecturerId !== classSection.lecturerId) {
      const lecturer = await this.prisma.lecturer.findFirst({
        where: { id: updateDto.lecturerId, deletedAt: null, status: 'ACTIVE' },
      });
      if (!lecturer) throw new NotFoundException('New lecturer not found or inactive');
    }

    if (updateDto.sectionCode) {
      const existing = await this.prisma.classSection.findUnique({
        where: {
          courseId_semesterId_sectionCode: {
            courseId: updateDto.courseId || classSection.courseId,
            semesterId: updateDto.semesterId || classSection.semesterId,
            sectionCode: updateDto.sectionCode,
          },
        },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Class section code already exists');
      }
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let finalStatus = updateDto.status || classSection.status;
      const newMaxCapacity =
        updateDto.maxCapacity !== undefined ? updateDto.maxCapacity : classSection.maxCapacity;

      if (classSection.enrolledCount >= newMaxCapacity && finalStatus === 'OPEN') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        finalStatus = 'FULL' as any; // Note: FULL is not in enum, wait Schema has DRAFT, OPEN, CLOSED, IN_PROGRESS, COMPLETED, CANCELLED
      }

      // If we don't have FULL, just use CLOSED
      if (classSection.enrolledCount >= newMaxCapacity && finalStatus === 'OPEN') {
        finalStatus = 'CLOSED';
      } else if (
        classSection.enrolledCount < newMaxCapacity &&
        classSection.status === 'CLOSED' &&
        !updateDto.status
      ) {
        finalStatus = 'OPEN';
      }

      const updated = await tx.classSection.update({
        where: { id },
        data: {
          ...updateDto,
          status: finalStatus,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'ClassSection',
          entityId: id,
          actorUserId,
          oldValues: classSection as unknown as Prisma.InputJsonValue,
          newValues: updated as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        message: 'Class section updated successfully',
        data: updated,
      };
    });
  }

  async remove(id: string, actorUserId: string) {
    const classSection = await this.prisma.classSection.findUnique({
      where: { id, deletedAt: null },
      include: {
        enrollments: { take: 1 },
        attendanceSessions: { take: 1 },
        gradeComponents: { take: 1 },
      },
    });

    if (!classSection) {
      throw new NotFoundException('Class section not found');
    }

    if (
      classSection.enrollments.length > 0 ||
      classSection.attendanceSessions.length > 0 ||
      classSection.gradeComponents.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete class section with existing enrollments, attendance, or grades',
      );
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.classSection.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          action: 'SOFT_DELETE',
          entityType: 'ClassSection',
          entityId: id,
          actorUserId,
          oldValues: classSection as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        message: 'Class section deleted successfully',
      };
    });
  }

  async findStudents(id: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classSectionId: id },
      include: {
        student: {
          select: {
            id: true,
            studentCode: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Students retrieved successfully',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: enrollments.map((e: any) => ({ ...e.student, enrollmentStatus: e.status })),
    };
  }

  async findSchedules(id: string) {
    const schedules = await this.prisma.schedule.findMany({
      where: { classSectionId: id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return {
      success: true,
      message: 'Schedules retrieved successfully',
      data: schedules,
    };
  }
}

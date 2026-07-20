import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { BulkUpdateAttendanceDto } from './dto/update-attendance-records.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(dto: CreateAttendanceSessionDto, userId: string) {
    const { classSectionId, sessionDate, startTime, endTime, topic, notes } = dto;

    // Validate ClassSection and Schedule limits
    const section = await this.prisma.classSection.findUnique({
      where: { id: classSectionId },
      include: { schedules: true },
    });
    if (!section) throw new NotFoundException('Class section not found');

    // Get lecturerId of the current user
    const lecturer = await this.prisma.lecturer.findUnique({
      where: { userId },
    });
    if (!lecturer) throw new BadRequestException('User is not a lecturer');

    // Overlap check with existing sessions
    const sessionDateObj = new Date(sessionDate);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    const overlap = await this.prisma.attendanceSession.findFirst({
      where: {
        classSectionId,
        sessionDate: sessionDateObj,
        startTime: { lt: endTimeObj },
        endTime: { gt: startTimeObj },
      },
    });

    if (overlap) {
      throw new BadRequestException(
        'Time overlaps with an existing attendance session for this class section.',
      );
    }

    // Check if sessionDate falls within valid schedule range (if applicable)
    // schedules have validFrom and validTo
    if (section.schedules && section.schedules.length > 0) {
      const isValidDate = section.schedules.some((schedule) => {
        if (!schedule.validFrom || !schedule.validTo) return true; // no date restriction
        return sessionDateObj >= schedule.validFrom && sessionDateObj <= schedule.validTo;
      });
      if (!isValidDate) {
        throw new BadRequestException('Session date is outside the valid schedule dates.');
      }
    }

    // Get all enrolled students
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        classSectionId,
        status: 'ENROLLED',
      },
    });

    // Create session and records in transaction
    return this.prisma.$transaction(async (prisma) => {
      const session = await prisma.attendanceSession.create({
        data: {
          classSectionId,
          createdById: lecturer.id,
          sessionDate: sessionDateObj,
          startTime: startTimeObj,
          endTime: endTimeObj,
          topic,
          notes,
          records: {
            create: enrollments.map((e) => ({
              studentId: e.studentId,
              status: AttendanceStatus.PRESENT,
            })),
          },
        },
        include: {
          records: true,
        },
      });

      return session;
    });
  }

  async bulkUpdateRecords(sessionId: string, dto: BulkUpdateAttendanceDto, userId: string) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Attendance session not found');

    const markedAt = new Date();

    return this.prisma.$transaction(async (prisma) => {
      const updatePromises = dto.records.map((record) =>
        prisma.attendanceRecord.update({
          where: {
            attendanceSessionId_studentId: {
              attendanceSessionId: sessionId,
              studentId: record.studentId,
            },
          },
          data: {
            status: record.status,
            note: record.note,
            markedByUserId: userId,
            markedAt,
          },
        }),
      );
      await Promise.all(updatePromises);
      return { message: 'Attendance records updated successfully' };
    });
  }

  async getSessionRecords(sessionId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { attendanceSessionId: sessionId },
      include: { student: { include: { user: true } } },
    });
  }

  async getAttendanceSummary(classSectionId: string) {
    const sessions = await this.prisma.attendanceSession.findMany({
      where: { classSectionId },
      orderBy: { sessionDate: 'asc' },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: { classSectionId, status: 'ENROLLED' },
      include: { student: { include: { user: true } } },
    });

    const allRecords = await this.prisma.attendanceRecord.findMany({
      where: {
        attendanceSession: { classSectionId },
        studentId: { in: enrollments.map((e) => e.studentId) },
      },
    });

    const recordsByStudentId = allRecords.reduce(
      (acc, record) => {
        if (!acc[record.studentId]) {
          acc[record.studentId] = [];
        }
        acc[record.studentId]!.push(record);
        return acc;
      },
      {} as Record<string, typeof allRecords>,
    );

    const summary = enrollments.map((e) => {
      const records = recordsByStudentId[e.studentId] || [];

      const totalSessions = sessions.length;
      const presentCount = records.filter((r) => r.status === 'PRESENT').length;
      const absentCount = records.filter((r) => r.status === 'ABSENT').length;
      const lateCount = records.filter((r) => r.status === 'LATE').length;
      const excusedCount = records.filter((r) => r.status === 'EXCUSED').length;
      const attendancePercentage = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;

      return {
        studentId: e.studentId,
        studentCode: e.student.studentCode,
        firstName: e.student.user.fullName,
        totalSessions,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendancePercentage,
      };
    });
    return summary;
  }

  async exportAttendanceCsv(classSectionId: string) {
    const summary = await this.getAttendanceSummary(classSectionId);
    let csv =
      'Student ID,Student Code,Full Name,Total Sessions,Present,Absent,Late,Excused,Percentage\n';

    summary.forEach((record) => {
      // Escape potential formula injection
      const name = record.firstName.replace(/^[=@+-]/, "'$&");
      csv += `${record.studentId},${record.studentCode},"${name}",${record.totalSessions},${record.presentCount},${record.absentCount},${record.lateCount},${record.excusedCount},${record.attendancePercentage.toFixed(2)}%\n`;
    });
    return csv;
  }
}

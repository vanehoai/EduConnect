import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildEnrollmentWhere(filter: AnalyticsFilterDto) {
    return {
      ...(filter.semesterId ? { classSection: { semesterId: filter.semesterId } } : {}),
      ...(filter.departmentId
        ? { classSection: { course: { departmentId: filter.departmentId } } }
        : {}),
      ...(filter.courseId ? { classSection: { courseId: filter.courseId } } : {}),
      ...(filter.classSectionId ? { classSectionId: filter.classSectionId } : {}),
    };
  }

  async getAcademicOverview(filter: AnalyticsFilterDto) {
    const where = this.buildEnrollmentWhere(filter);

    const [totalEnrollments, completed, failed, dropped] = await Promise.all([
      this.prisma.enrollment.count({ where }),
      this.prisma.enrollment.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.enrollment.count({ where: { ...where, status: 'FAILED' } }),
      this.prisma.enrollment.count({ where: { ...where, status: 'DROPPED' } }),
    ]);

    const completionRate = totalEnrollments > 0 ? (completed / totalEnrollments) * 100 : 0;
    const failRate = totalEnrollments > 0 ? (failed / totalEnrollments) * 100 : 0;
    const dropRate = totalEnrollments > 0 ? (dropped / totalEnrollments) * 100 : 0;

    return {
      totalEnrollments,
      averageCredits: 0,
      completionRate: parseFloat(completionRate.toFixed(2)),
      failRate: parseFloat(failRate.toFixed(2)),
      dropRate: parseFloat(dropRate.toFixed(2)),
      averageGpa: 0,
      gpaByDepartment: [],
      gpaBySemester: [],
      highFailureCourses: [] as Array<{
        courseId: string;
        courseCode: string;
        courseName: string;
        failRate: number;
        enrollmentCount: number;
      }>,
    };
  }

  async getAttendanceOverview(filter: AnalyticsFilterDto) {
    const where = {
      ...(filter.classSectionId
        ? { attendanceSession: { classSectionId: filter.classSectionId } }
        : {}),
      ...(filter.semesterId
        ? { attendanceSession: { classSection: { semesterId: filter.semesterId } } }
        : {}),
    };

    const statusCounts = await this.prisma.attendanceRecord.groupBy({
      by: ['status'],
      _count: { _all: true },
      where,
    });

    const countMap: Record<string, number> = {};
    for (const row of statusCounts) {
      countMap[row.status] = row._count._all;
    }

    const presentCount = countMap['PRESENT'] ?? 0;
    const absentCount = countMap['ABSENT'] ?? 0;
    const lateCount = countMap['LATE'] ?? 0;
    const excusedCount = countMap['EXCUSED'] ?? 0;
    // denominator excludes EXCUSED
    const totalSessions = presentCount + absentCount + lateCount;
    const attendanceRate =
      totalSessions > 0
        ? parseFloat((((presentCount + lateCount) / totalSessions) * 100).toFixed(2))
        : 0;

    return {
      attendanceRate,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      totalSessions,
      highAbsenceClasses: [] as Array<{
        classSectionId: string;
        classSectionCode: string;
        courseName: string;
        absenceRate: number;
      }>,
      consecutiveAbsenceStudents: [],
      attendanceTrend: [],
    };
  }

  async getGradeOverview(filter: AnalyticsFilterDto) {
    const where = {
      status: 'COMPLETED' as const,
      ...(filter.semesterId ? { classSection: { semesterId: filter.semesterId } } : {}),
    };

    const gradeAgg = await this.prisma.enrollment.aggregate({
      _avg: { finalScore: true },
      where,
    });

    const [passCount, totalCount] = await Promise.all([
      this.prisma.enrollment.count({ where: { ...where, passed: true } }),
      this.prisma.enrollment.count({ where }),
    ]);

    const passRate = totalCount > 0 ? (passCount / totalCount) * 100 : 0;

    return {
      averageScore: parseFloat((gradeAgg._avg?.finalScore ?? 0).toString()),
      averageGpa: 0, // GPA not tracked at enrollment level
      passRate: parseFloat(passRate.toFixed(2)),
      failRate: parseFloat((100 - passRate).toFixed(2)),
      gradeDistribution: [],
      topCourses: [],
      highFailureCourses: [],
      studentsBelowGpaThreshold: 0,
      semesterGpaTrend: [],
    };
  }

  async getExamOverview(filter: AnalyticsFilterDto) {
    const attemptWhere = {
      ...(filter.semesterId ? { exam: { classSection: { semesterId: filter.semesterId } } } : {}),
    };

    const [assignedStudents, submittedAttempts, autoSubmitted] = await Promise.all([
      this.prisma.examAssignment.count({
        where: {
          ...(filter.semesterId
            ? { exam: { classSection: { semesterId: filter.semesterId } } }
            : {}),
        },
      }),
      this.prisma.examAttempt.count({
        where: { ...attemptWhere, status: { in: ['SUBMITTED', 'GRADED'] } },
      }),
      this.prisma.examAttempt.count({
        where: { ...attemptWhere, status: 'AUTO_SUBMITTED' },
      }),
    ]);

    const startedAttempts = await this.prisma.examAttempt.count({
      where: { ...attemptWhere, status: { not: 'IN_PROGRESS' } },
    });

    const completionRate = assignedStudents > 0 ? (submittedAttempts / assignedStudents) * 100 : 0;

    const scoreAgg = await this.prisma.examAttempt.aggregate({
      _avg: { score: true },
      _max: { score: true },
      _min: { score: true },
      where: { ...attemptWhere, status: { in: ['SUBMITTED', 'GRADED', 'AUTO_SUBMITTED'] } },
    });

    return {
      assignedStudents,
      startedAttempts,
      submittedAttempts,
      autoSubmittedAttempts: autoSubmitted,
      completionRate: parseFloat(completionRate.toFixed(2)),
      averageScore: parseFloat((scoreAgg._avg.score ?? 0).toString()),
      highestScore: parseFloat((scoreAgg._max.score ?? 0).toString()),
      lowestScore: parseFloat((scoreAgg._min.score ?? 0).toString()),
      passRate: 0,
      averageDuration: 0,
      unansweredRate: 0,
    };
  }

  async getExamStatistics(examId: string, user: AuthenticatedUser) {
    const isLecturer = user.roles.includes('LECTURER');

    if (isLecturer) {
      const lecturer = await this.prisma.lecturer.findUnique({ where: { userId: user.id } });
      if (lecturer) {
        const exam = await this.prisma.exam.findUnique({
          where: { id: examId },
          include: { classSection: { select: { lecturerId: true } } },
        });
        if (!exam || exam.classSection?.lecturerId !== lecturer.id) {
          throw new ForbiddenException('Không có quyền xem thống kê kỳ thi này');
        }
      }
    }

    return this.getExamOverview({});
  }
}

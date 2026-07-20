import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma } from '@prisma/client';
import { buildCsvContent } from '../../common/utils/csv.util';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';

export type ExportType =
  'students' | 'enrollments' | 'attendance' | 'grades' | 'exams' | 'finance' | 'risks';

@Injectable()
export class AnalyticsExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async exportCsv(
    type: ExportType,
    filter: AnalyticsFilterDto,
    actorUserId: string,
  ): Promise<string> {
    let csv: string;

    switch (type) {
      case 'students':
        csv = await this.exportStudents(filter);
        break;
      case 'enrollments':
        csv = await this.exportEnrollments(filter);
        break;
      case 'attendance':
        csv = await this.exportAttendance(filter);
        break;
      case 'grades':
        csv = await this.exportGrades(filter);
        break;
      case 'risks':
        csv = await this.exportRisks(filter);
        break;
      default:
        csv = buildCsvContent(['type', 'message'], [[type, 'Export not implemented']]);
    }

    await this.audit.record({
      actorUserId,
      action: 'EXPORT_REPORT',
      entityType: 'Report',
      entityId: type,
      newValues: {
        type,
        filter: filter as unknown as Prisma.InputJsonObject,
      } as Prisma.InputJsonObject,
      metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
    });

    return csv;
  }

  private async exportStudents(filter: AnalyticsFilterDto): Promise<string> {
    const students = await this.prisma.student.findMany({
      where: {
        ...(filter.departmentId ? { departmentId: filter.departmentId } : {}),
      },
      select: {
        studentCode: true,
        fullName: true,
        email: true,
        academicStatus: true,
        department: { select: { name: true } },
        cohort: true,
      },
      take: 10000,
    });

    return buildCsvContent(
      ['Mã SV', 'Họ tên', 'Email', 'Trạng thái', 'Khoa', 'Khóa'],
      students.map((s) => [
        s.studentCode,
        s.fullName,
        s.email,
        s.academicStatus,
        s.department?.name ?? '',
        s.cohort ?? '',
      ]),
    );
  }

  private async exportEnrollments(filter: AnalyticsFilterDto): Promise<string> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        ...(filter.semesterId ? { classSection: { semesterId: filter.semesterId } } : {}),
        ...(filter.courseId ? { classSection: { courseId: filter.courseId } } : {}),
      },
      select: {
        status: true,
        createdAt: true,
        student: { select: { studentCode: true, fullName: true } },
        classSection: {
          select: {
            sectionCode: true,
            course: { select: { courseCode: true, name: true, credits: true } },
          },
        },
      },
      take: 10000,
    });

    return buildCsvContent(
      ['Mã SV', 'Tên SV', 'Mã lớp', 'Mã môn', 'Tên môn', 'Tín chỉ', 'Trạng thái'],
      enrollments.map((e) => [
        e.student.studentCode,
        e.student.fullName,
        e.classSection.sectionCode,
        e.classSection.course.courseCode,
        e.classSection.course.name,
        e.classSection.course.credits,
        e.status,
      ]),
    );
  }

  private async exportAttendance(filter: AnalyticsFilterDto): Promise<string> {
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        ...(filter.classSectionId
          ? { attendanceSession: { classSectionId: filter.classSectionId } }
          : {}),
        ...(filter.semesterId
          ? { attendanceSession: { classSection: { semesterId: filter.semesterId } } }
          : {}),
      },
      select: {
        student: { select: { studentCode: true, fullName: true } },
        attendanceSession: {
          select: {
            sessionDate: true,
            classSection: { select: { sectionCode: true } },
          },
        },
        status: true,
        note: true,
      },
      take: 10000,
    });

    return buildCsvContent(
      ['Mã SV', 'Tên SV', 'Lớp', 'Ngày học', 'Trạng thái', 'Ghi chú'],
      records.map((r) => [
        r.student.studentCode,
        r.student.fullName,
        r.attendanceSession.classSection.sectionCode,
        r.attendanceSession.sessionDate.toISOString().split('T')[0] ?? '',
        r.status,
        r.note ?? '',
      ]),
    );
  }

  private async exportGrades(filter: AnalyticsFilterDto): Promise<string> {
    const grades = await this.prisma.enrollment.findMany({
      where: {
        status: 'COMPLETED',
        ...(filter.semesterId ? { classSection: { semesterId: filter.semesterId } } : {}),
      },
      select: {
        finalScore: true,
        letterGrade: true,
        student: { select: { studentCode: true, fullName: true } },
        classSection: {
          select: {
            sectionCode: true,
            course: { select: { courseCode: true, name: true } },
          },
        },
      },
      take: 10000,
    });

    return buildCsvContent(
      ['Mã SV', 'Tên SV', 'Lớp', 'Mã môn', 'Tên môn', 'Điểm', 'GPA', 'Hạng'],
      grades.map((g) => [
        g.student.studentCode,
        g.student.fullName,
        g.classSection.sectionCode,
        g.classSection.course.courseCode,
        g.classSection.course.name,
        g.finalScore?.toString() ?? '',
        '', // GPA points not available directly
        g.letterGrade ?? '',
      ]),
    );
  }

  private async exportRisks(filter: AnalyticsFilterDto): Promise<string> {
    const risks = await this.prisma.academicRiskAlert.findMany({
      where: {
        ...(filter.semesterId ? { semesterId: filter.semesterId } : {}),
      },
      select: {
        type: true,
        severity: true,
        status: true,
        title: true,
        ruleCode: true,
        evaluationPeriod: true,
        detectedAt: true,
        student: { select: { studentCode: true, fullName: true } },
        semester: { select: { code: true } },
      },
      take: 10000,
    });

    return buildCsvContent(
      ['Mã SV', 'Tên SV', 'Học kỳ', 'Loại', 'Mức độ', 'Trạng thái', 'Tiêu đề', 'Ngày phát hiện'],
      risks.map((r) => [
        r.student.studentCode,
        r.student.fullName,
        r.semester.code,
        r.type,
        r.severity,
        r.status,
        r.title,
        r.detectedAt.toISOString().split('T')[0],
      ]),
    );
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminSummary(filter: DashboardFilterDto) {
    const semesterWhere = filter.semesterId ? { semesterId: filter.semesterId } : {};
    const departmentWhere = filter.departmentId ? { departmentId: filter.departmentId } : {};

    const [
      totalStudents,
      activeStudents,
      totalLecturers,
      totalDepartments,
      totalCourses,
      activeClassSections,
      totalEnrollments,
      activeExams,
      studentsAtRisk,
      unresolvedRiskAlerts,
    ] = await Promise.all([
      this.prisma.student.count({ where: { ...departmentWhere } }),
      this.prisma.student.count({ where: { academicStatus: 'STUDYING', ...departmentWhere } }),
      this.prisma.lecturer.count({ where: { ...departmentWhere } }),
      this.prisma.department.count(),
      this.prisma.course.count({ where: { ...departmentWhere } }),
      this.prisma.classSection.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] }, ...semesterWhere },
      }),
      this.prisma.enrollment.count({ where: { status: 'ENROLLED', ...semesterWhere } }),
      this.prisma.exam.count({ where: { status: 'OPEN' } }),
      this.prisma.academicRiskAlert.count({
        where: { status: { in: ['OPEN', 'ACKNOWLEDGED'] } },
      }),
      this.prisma.academicRiskAlert.count({
        where: { status: 'OPEN' },
      }),
    ]);

    // Finance aggregations
    const invoiceAgg = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true, balanceAmount: true },
      where: {
        status: { notIn: [InvoiceStatus.CANCELLED, InvoiceStatus.VOID] },
        ...(filter.semesterId ? { semesterId: filter.semesterId } : {}),
      },
    });
    const paymentAgg = await this.prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.VERIFIED,
        ...(filter.semesterId ? { invoice: { semesterId: filter.semesterId } } : {}),
      },
    });

    const totalInvoiced = new Prisma.Decimal(invoiceAgg._sum.totalAmount?.toString() ?? '0');
    const totalOutstanding = new Prisma.Decimal(invoiceAgg._sum.balanceAmount?.toString() ?? '0');
    const totalCollected = new Prisma.Decimal(paymentAgg._sum.amount?.toString() ?? '0');

    // Attendance rate
    const attendanceAgg = await this.prisma.attendanceRecord.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { status: { not: 'EXCUSED' } },
    });
    const totalAttendance = attendanceAgg.reduce((s, r) => s + r._count.id, 0);
    const presentCount = attendanceAgg.find((r) => r.status === 'PRESENT')?._count.id ?? 0;
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    // Enrollments by semester (trend) - Not easily available via Prisma groupBy on relation
    const enrollmentsBySemester: Array<{ label: string; value: number }> = [];

    return {
      totalStudents,
      activeStudents,
      totalLecturers,
      totalDepartments,
      totalCourses,
      activeClassSections,
      totalEnrollments,
      attendanceRate: parseFloat(attendanceRate.toFixed(2)),
      averageGpa: 0, // computed separately if needed
      passRate: 0,
      activeExams,
      examCompletionRate: 0,
      totalInvoiced: totalInvoiced.toString(),
      totalCollected: totalCollected.toString(),
      totalOutstanding: totalOutstanding.toString(),
      overdueAmount: '0',
      studentsAtRisk,
      unresolvedRiskAlerts,
      studentsByMonth: [],
      enrollmentsBySemester,
      attendanceTrend: [],
      averageGradeTrend: [],
      paymentCollectionTrend: [],
    };
  }

  async getTrainingSummary(filter: DashboardFilterDto) {
    const semesterWhere = filter.semesterId ? { semesterId: filter.semesterId } : {};
    const departmentWhere = filter.departmentId
      ? { student: { departmentId: filter.departmentId } }
      : {};

    const [
      activeStudents,
      activeClassSections,
      totalEnrollments,
      cancelledEnrollments,
      unresolvedRiskAlerts,
    ] = await Promise.all([
      this.prisma.student.count({
        where: {
          academicStatus: 'STUDYING',
          ...(filter.departmentId ? { departmentId: filter.departmentId } : {}),
        },
      }),
      this.prisma.classSection.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] }, ...semesterWhere },
      }),
      this.prisma.enrollment.count({
        where: { status: 'ENROLLED', ...semesterWhere, ...departmentWhere },
      }),
      this.prisma.enrollment.count({
        where: { status: 'DROPPED', ...semesterWhere, ...departmentWhere },
      }),
      this.prisma.academicRiskAlert.count({ where: { status: 'OPEN' } }),
    ]);

    // Near-full sections
    const nearFullSections = await this.prisma.classSection.count({
      where: {
        ...semesterWhere,
        enrolledCount: { gte: 0 }, // fallback to all sections for now
      },
    });
    // Simplified: sections where enrolledCount >= 90% of maxCapacity
    const sections = await this.prisma.classSection.findMany({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] }, ...semesterWhere },
      select: { enrolledCount: true, maxCapacity: true },
    });
    const nearFull = sections.filter(
      (s) => s.maxCapacity > 0 && s.enrolledCount / s.maxCapacity >= 0.9,
    ).length;
    const overCapacity = sections.filter((s) => s.enrolledCount > s.maxCapacity).length;
    void nearFullSections; // suppress unused

    // High-absence classes
    const highAbsenceClasses = await this.prisma.classSection
      .findMany({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] }, ...semesterWhere },
        select: {
          id: true,
          sectionCode: true,
          course: { select: { name: true } },
          attendanceSessions: {
            select: { records: { select: { status: true } } },
          },
        },
      })
      .then((sections) =>
        sections
          .map((s) => {
            const allRecords = s.attendanceSessions.flatMap((sess) => sess.records);
            const total = allRecords.length;
            const absent = allRecords.filter((r) => r.status === 'ABSENT').length;
            const absenceRate = total > 0 ? absent / total : 0;
            return {
              id: s.id,
              code: s.sectionCode,
              name: s.course.name,
              absenceRate: parseFloat((absenceRate * 100).toFixed(2)),
            };
          })
          .filter((s) => s.absenceRate > 20)
          .sort((a, b) => b.absenceRate - a.absenceRate)
          .slice(0, 10),
      );

    return {
      activeStudents,
      activeClassSections,
      totalEnrollments,
      cancelledEnrollments,
      nearFullSections: nearFull,
      overCapacitySections: overCapacity,
      attendanceRate: 0,
      passRate: 0,
      lowGpaStudents: 0,
      highAbsenceStudents: 0,
      unresolvedRiskAlerts,
      highAbsenceClasses,
      highFailureCourses: [],
      gpaDeclineStudents: [],
    };
  }

  async getFinanceSummary(filter: DashboardFilterDto) {
    const semesterWhere = filter.semesterId ? { semesterId: filter.semesterId } : {};

    // Only non-cancelled invoices count toward invoiced total
    const invoiceAgg = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true, balanceAmount: true },
      where: {
        status: { notIn: [InvoiceStatus.CANCELLED, InvoiceStatus.VOID] },
        ...semesterWhere,
      },
    });

    const overdueAgg = await this.prisma.invoice.aggregate({
      _sum: { balanceAmount: true },
      where: {
        status: InvoiceStatus.OVERDUE,
        ...semesterWhere,
      },
    });

    // Only VERIFIED payments count as actual collected
    const verifiedAgg = await this.prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.VERIFIED,
        ...(filter.semesterId ? { invoice: { semesterId: filter.semesterId } } : {}),
      },
    });

    const pendingPayments = await this.prisma.paymentTransaction.count({
      where: { status: 'PENDING' },
    });
    const cancelledPayments = await this.prisma.paymentTransaction.count({
      where: { status: 'CANCELLED' },
    });

    const scholarshipsAgg = await this.prisma.financialAdjustment.aggregate({
      _sum: { amount: true },
      where: { type: 'CREDIT', ...semesterWhere },
    });

    const studentsWithDebt = await this.prisma.invoice.groupBy({
      by: ['studentId'],
      where: {
        status: { in: [InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.UNPAID] },
        ...semesterWhere,
      },
    });

    const totalInvoiced = new Prisma.Decimal(invoiceAgg._sum.totalAmount?.toString() ?? '0');
    const totalVerifiedPayments = new Prisma.Decimal(verifiedAgg._sum.amount?.toString() ?? '0');
    const totalOutstanding = new Prisma.Decimal(invoiceAgg._sum.balanceAmount?.toString() ?? '0');
    const overdueAmount = new Prisma.Decimal(overdueAgg._sum.balanceAmount?.toString() ?? '0');

    let collectionRate = 0;
    if (!totalInvoiced.equals(0)) {
      collectionRate = parseFloat(totalVerifiedPayments.div(totalInvoiced).mul(100).toFixed(2));
    }

    // Payments by month
    const paymentsRaw = await this.prisma.paymentTransaction.findMany({
      where: {
        status: PaymentStatus.VERIFIED,
        ...(filter.semesterId ? { invoice: { semesterId: filter.semesterId } } : {}),
      },
      select: { amount: true, completedAt: true },
    });
    const paymentsByMonthMap = new Map<string, number>();
    for (const p of paymentsRaw) {
      if (!p.completedAt) continue;
      const label = `${p.completedAt.getFullYear()}-${String(p.completedAt.getMonth() + 1).padStart(2, '0')}`;
      const cur = paymentsByMonthMap.get(label) ?? 0;
      paymentsByMonthMap.set(
        label,
        cur + parseFloat(new Prisma.Decimal(p.amount.toString()).toString()),
      );
    }
    const paymentsByMonth = Array.from(paymentsByMonthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label, value }));

    // Invoice status distribution
    const invoicesByStatusRaw = await this.prisma.invoice.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return {
      totalInvoiced: totalInvoiced.toString(),
      totalVerifiedPayments: totalVerifiedPayments.toString(),
      totalOutstanding: totalOutstanding.toString(),
      overdueAmount: overdueAmount.toString(),
      collectionRate,
      pendingPayments,
      cancelledPayments,
      scholarshipsAmount: scholarshipsAgg._sum.amount?.toString() ?? '0',
      adjustmentsAmount: '0',
      studentsWithDebt: studentsWithDebt.length,
      paymentsByMonth,
      paymentsByMethod: [],
      debtByDepartment: [],
      debtBySemester: [],
      invoicesByStatus: invoicesByStatusRaw.map((s) => ({
        label: s.status,
        value: s._count.id,
      })),
    };
  }

  async getLecturerSummary(user: AuthenticatedUser) {
    const lecturer = await this.prisma.lecturer.findUnique({
      where: { userId: user.id },
    });
    if (!lecturer) {
      throw new NotFoundException('Không tìm thấy thông tin giảng viên');
    }

    const classSections = await this.prisma.classSection.findMany({
      where: {
        lecturerId: lecturer.id,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      include: {
        course: { select: { name: true } },
        enrollments: { where: { status: 'ENROLLED' }, select: { id: true } },
        attendanceSessions: {
          select: { records: { select: { status: true } } },
        },
      },
    });

    const studentsAtRisk = await this.prisma.academicRiskAlert.count({
      where: {
        status: { in: ['OPEN', 'ACKNOWLEDGED'] },
        student: {
          enrollments: {
            some: {
              classSection: { lecturerId: lecturer.id },
              status: 'ENROLLED',
            },
          },
        },
      },
    });

    const totalStudents = classSections.reduce((s, cs) => s + cs.enrollments.length, 0);
    const incompleteAttendanceSessions = 0; // simplified

    const activeClassSections = classSections.map((cs) => {
      const allRecords = cs.attendanceSessions.flatMap((sess) => sess.records);
      const total = allRecords.length;
      const present = allRecords.filter((r) => r.status === 'PRESENT').length;
      return {
        id: cs.id,
        code: cs.sectionCode,
        courseName: cs.course.name,
        enrolledCount: cs.enrollments.length,
        attendanceRate: total > 0 ? parseFloat(((present / total) * 100).toFixed(2)) : 0,
        passRate: 0,
      };
    });

    return {
      activeClassSections,
      totalStudents,
      upcomingSchedules: [],
      incompleteAttendanceSessions,
      activeExams: 0,
      pendingSubmissions: 0,
      studentsAtRisk,
    };
  }

  async getStudentSummary(user: AuthenticatedUser) {
    const student = await this.prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        enrollments: {
          where: { status: 'ENROLLED' },
          include: {
            classSection: {
              include: {
                course: { select: { credits: true } },
                schedules: true,
              },
            },
          },
        },
        invoices: {
          where: {
            status: { notIn: [InvoiceStatus.CANCELLED, InvoiceStatus.VOID] },
          },
          select: { balanceAmount: true, status: true, dueDate: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy thông tin sinh viên');
    }

    // Current semester
    const currentSemester = await this.prisma.semester.findFirst({
      where: { status: { in: ['IN_PROGRESS', 'REGISTRATION_OPEN'] } },
      orderBy: { startDate: 'desc' },
      select: { id: true, code: true, name: true },
    });

    const enrolledCredits = student.enrollments.reduce(
      (s, e) => s + (e.classSection.course.credits ?? 0),
      0,
    );

    // Finance
    let totalOutstanding = new Prisma.Decimal(0);
    let overdueAmount = new Prisma.Decimal(0);
    for (const inv of student.invoices) {
      totalOutstanding = totalOutstanding.add(new Prisma.Decimal(inv.balanceAmount.toString()));
      if (inv.status === InvoiceStatus.OVERDUE) {
        overdueAmount = overdueAmount.add(new Prisma.Decimal(inv.balanceAmount.toString()));
      }
    }

    // Active risk alerts
    const activeRiskAlerts = await this.prisma.academicRiskAlert.count({
      where: { studentId: student.id, status: { in: ['OPEN', 'ACKNOWLEDGED'] } },
    });

    // Recent notifications
    const recentNotifications = await this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, type: true, content: true, createdAt: true },
    });

    // Upcoming exams
    const upcomingExams = await this.prisma.examAssignment.findMany({
      where: {
        studentId: student.id,
        exam: { status: 'OPEN', startsAt: { gt: new Date() } },
      },
      include: { exam: { select: { id: true, name: true, startsAt: true } } },
      take: 5,
      orderBy: { exam: { startsAt: 'asc' } },
    });

    return {
      currentSemester,
      enrolledCredits,
      attendanceRate: 0,
      currentGpa: 0,
      cumulativeGpa: 0,
      completedCredits: 0,
      failedCourses: 0,
      upcomingClasses: [],
      upcomingExams: upcomingExams.map((a) => ({
        id: a.exam.id,
        title: a.exam.name,
        startTime: a.exam.startsAt?.toISOString() ?? '',
      })),
      pendingExamAttempts: 0,
      totalOutstanding: totalOutstanding.toString(),
      overdueAmount: overdueAmount.toString(),
      activeRiskAlerts,
      recentNotifications: recentNotifications.map((n) => ({
        id: n.id,
        type: n.type,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  }
}

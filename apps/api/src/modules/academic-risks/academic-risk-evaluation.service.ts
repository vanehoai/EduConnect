import { Injectable, Logger } from '@nestjs/common';
import { RiskSeverity, RiskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

interface RuleConfig {
  id: string;
  code: string;
  type: string;
  defaultSeverity: RiskSeverity;
  thresholdConfig: Record<string, number>;
  evaluationPeriodType: string;
  isActive: boolean;
}

interface EvaluationResult {
  triggered: boolean;
  actualValue?: number;
  title: string;
  description: string;
}

@Injectable()
export class AcademicRiskEvaluationService {
  private readonly logger = new Logger(AcademicRiskEvaluationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Generate evaluationPeriod string from rule's evaluationPeriodType.
   * - semester → '2026-SEM2'
   * - month    → '2026-07'
   * - week     → '2026-W29'
   */
  generateEvaluationPeriod(periodType: string, date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    if (periodType === 'month') {
      return `${year}-${month}`;
    }
    if (periodType === 'week') {
      const startOfYear = new Date(year, 0, 1);
      const weekNumber = Math.ceil(
        ((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
      );
      return `${year}-W${String(weekNumber).padStart(2, '0')}`;
    }
    // Default: semester
    const sem = date.getMonth() < 7 ? 'SEM1' : 'SEM2';
    return `${year}-${sem}`;
  }

  async evaluateStudent(
    studentId: string,
    semesterId?: string,
  ): Promise<{
    scanned: number;
    created: number;
    updated: number;
    failed: number;
  }> {
    const rules = await this.prisma.academicRiskRule.findMany({
      where: { isActive: true },
    });

    const now = new Date();
    let created = 0;
    let updated = 0;
    let failed = 0;

    // Load student data
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          where: semesterId
            ? { classSection: { semesterId }, status: { not: 'DROPPED' } }
            : { status: { not: 'DROPPED' } },
          include: {
            classSection: { include: { course: true } },
          },
        },
        invoices: {
          where: semesterId ? { semesterId } : {},
          select: { status: true, dueDate: true, balanceAmount: true },
        },
        examAssignments: {
          select: { examId: true },
        },
        examAttempts: {
          select: { examId: true, status: true },
        },
        attendanceRecords: {
          select: { status: true },
        },
      },
    });

    if (!student) {
      this.logger.warn(`Student not found: ${studentId}`);
      return { scanned: 0, created: 0, updated: 0, failed: 1 };
    }

    // Determine semester for alert storage
    const targetSemesterId =
      semesterId ??
      (
        await this.prisma.semester.findFirst({
          where: { status: { in: ['IN_PROGRESS', 'REGISTRATION_OPEN'] } },
          orderBy: { startDate: 'desc' },
        })
      )?.id;

    if (!targetSemesterId) {
      this.logger.warn('No active semester found for risk evaluation');
      return { scanned: 0, created: 0, updated: 0, failed: 0 };
    }

    for (const rule of rules) {
      try {
        const evalPeriod = this.generateEvaluationPeriod(rule.evaluationPeriodType, now);
        const result = await this.evaluateRule(
          rule as RuleConfig,
          student as Parameters<typeof this.evaluateRule>[1],
          targetSemesterId,
        );

        if (!result.triggered) continue;

        // Upsert alert idempotently via unique constraint
        const existing = await this.prisma.academicRiskAlert.findUnique({
          where: {
            studentId_semesterId_ruleCode_evaluationPeriod: {
              studentId,
              semesterId: targetSemesterId,
              ruleCode: rule.code,
              evaluationPeriod: evalPeriod,
            },
          },
        });

        const ruleSnapshot = {
          rule: { code: rule.code, type: rule.type },
          threshold: rule.thresholdConfig,
          actualValue: result.actualValue,
          evaluatedAt: now.toISOString(),
        };

        if (!existing) {
          await this.prisma.academicRiskAlert.create({
            data: {
              studentId,
              semesterId: targetSemesterId,
              type: rule.type as never,
              severity: rule.defaultSeverity,
              status: RiskStatus.OPEN,
              title: result.title,
              description: result.description,
              ruleCode: rule.code,
              ruleSnapshot,
              evaluationPeriod: evalPeriod,
            },
          });

          // Send notification only on first creation
          await this.prisma.notification
            .create({
              data: {
                userId: student.userId,
                type: 'SYSTEM',
                title: `Cảnh báo học vụ: ${result.title}`,
                content: result.description,
              },
            })
            .catch(() => {}); // non-critical

          await this.audit.record({
            actorUserId: 'system',
            action: 'CREATE_RISK_ALERT',
            entityType: 'AcademicRiskAlert',
            entityId: studentId,
            newValues: { rule: rule.code, period: evalPeriod },
            metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
          });
          created++;
        } else if (
          existing.status === RiskStatus.OPEN ||
          existing.status === RiskStatus.ACKNOWLEDGED
        ) {
          // Update snapshot if severity changed but do NOT re-send notification
          await this.prisma.academicRiskAlert.update({
            where: { id: existing.id },
            data: {
              severity: rule.defaultSeverity,
              ruleSnapshot,
              description: result.description,
            },
          });
          updated++;
        }
        // If RESOLVED or DISMISSED → leave unchanged
      } catch (err) {
        this.logger.error(`Rule ${rule.code} failed for student ${studentId}: ${String(err)}`);
        failed++;
      }
    }

    return { scanned: rules.length, created, updated, failed };
  }

  async evaluateAll(semesterId: string): Promise<{
    scanned: number;
    created: number;
    updated: number;
    failed: number;
    studentCount: number;
  }> {
    const students = await this.prisma.enrollment.findMany({
      where: { classSection: { semesterId }, status: 'ENROLLED' },
      select: { studentId: true },
      distinct: ['studentId'],
    });

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalFailed = 0;
    let totalScanned = 0;

    for (const { studentId } of students) {
      try {
        const result = await this.evaluateStudent(studentId, semesterId);
        totalCreated += result.created;
        totalUpdated += result.updated;
        totalFailed += result.failed;
        totalScanned += result.scanned;
      } catch (err) {
        this.logger.error(`EvaluateAll failed for student ${studentId}: ${String(err)}`);
        totalFailed++;
      }
    }

    return {
      scanned: totalScanned,
      created: totalCreated,
      updated: totalUpdated,
      failed: totalFailed,
      studentCount: students.length,
    };
  }

  private async evaluateRule(
    rule: RuleConfig,
    student: {
      enrollments: Array<{
        status: string;
        finalScore: unknown;
        classSection: { course: { credits: number } };
      }>;
      invoices: Array<{ status: string; dueDate: Date | null; balanceAmount: unknown }>;
      examAssignments: Array<{ examId: string }>;
      examAttempts: Array<{ examId: string; status: string }>;
      attendanceRecords: Array<{ status: string }>;
    },
    _semesterId: string,
  ): Promise<EvaluationResult> {
    const config = rule.thresholdConfig;

    switch (rule.code) {
      case 'LOW_GPA': {
        const completedGrades = student.enrollments
          .filter((e) => e.status === 'COMPLETED' && e.finalScore != null)
          .map((e) => parseFloat(String(e.finalScore)));

        if (completedGrades.length === 0) return { triggered: false, title: '', description: '' };
        const avgGpa = completedGrades.reduce((a, b) => a + b, 0) / completedGrades.length;
        const triggered = avgGpa < (config.minGpa ?? 2.0);
        return {
          triggered,
          actualValue: avgGpa,
          title: `GPA học kỳ thấp (${avgGpa.toFixed(2)})`,
          description: `GPA trung bình ${avgGpa.toFixed(2)} thấp hơn ngưỡng ${config.minGpa}`,
        };
      }

      case 'HIGH_ABSENCE': {
        const allRecords = student.attendanceRecords;
        if (allRecords.length === 0) return { triggered: false, title: '', description: '' };
        const absentCount = allRecords.filter((r) => r.status === 'ABSENT').length;
        const total = allRecords.filter((r) => r.status !== 'EXCUSED').length;
        const rate = total > 0 ? absentCount / total : 0;
        const triggered = rate > (config.maxAbsenceRate ?? 0.2);
        return {
          triggered,
          actualValue: rate,
          title: `Tỷ lệ vắng cao (${(rate * 100).toFixed(1)}%)`,
          description: `Vắng ${absentCount}/${total} buổi (${(rate * 100).toFixed(1)}%), ngưỡng ${(config.maxAbsenceRate ?? 0.2) * 100}%`,
        };
      }

      case 'FAILED_COURSES': {
        const failedCount = student.enrollments.filter((e) => e.status === 'FAILED').length;
        const triggered = failedCount > (config.maxFailedCourses ?? 2);
        return {
          triggered,
          actualValue: failedCount,
          title: `Trượt nhiều môn (${failedCount} môn)`,
          description: `Đã trượt ${failedCount} môn, ngưỡng ${config.maxFailedCourses ?? 2} môn`,
        };
      }

      case 'LOW_CREDIT_COMPLETION': {
        const totalCredits = student.enrollments.reduce(
          (s, e) => s + e.classSection.course.credits,
          0,
        );
        const completedCredits = student.enrollments
          .filter((e) => e.status === 'COMPLETED')
          .reduce((s, e) => s + e.classSection.course.credits, 0);
        if (totalCredits === 0) return { triggered: false, title: '', description: '' };
        const rate = completedCredits / totalCredits;
        const triggered = rate < (config.minCompletionRate ?? 0.5);
        return {
          triggered,
          actualValue: rate,
          title: `Hoàn thành ít tín chỉ (${(rate * 100).toFixed(0)}%)`,
          description: `Hoàn thành ${completedCredits}/${totalCredits} tín chỉ (${(rate * 100).toFixed(0)}%)`,
        };
      }

      case 'EXAM_INCOMPLETE': {
        const attemptedExamIds = new Set(student.examAttempts.map((a) => a.examId));
        const missedExams = student.examAssignments.filter(
          (ea) => !attemptedExamIds.has(ea.examId),
        ).length;
        const triggered = missedExams > (config.maxMissedExams ?? 1);
        return {
          triggered,
          actualValue: missedExams,
          title: `Bỏ lỡ kỳ thi (${missedExams} kỳ)`,
          description: `Bỏ lỡ ${missedExams} kỳ thi, ngưỡng ${config.maxMissedExams ?? 1}`,
        };
      }

      case 'FINANCIAL_HOLD': {
        const overdueThreshold = config.overdueThresholdDays ?? 30;
        const now = new Date();
        const hasOverdue = student.invoices.some((inv) => {
          if (inv.status !== 'OVERDUE') return false;
          if (!inv.dueDate) return false;
          const daysPastDue = (now.getTime() - new Date(inv.dueDate).getTime()) / 86400000;
          return daysPastDue > overdueThreshold;
        });
        return {
          triggered: hasOverdue,
          title: 'Công nợ quá hạn',
          description: `Có hóa đơn quá hạn hơn ${overdueThreshold} ngày`,
        };
      }

      default:
        return { triggered: false, title: '', description: '' };
    }
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RiskStatus, RiskType, RiskSeverity, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { GetAcademicRisksDto } from './dto/get-academic-risks.dto';
import { ResolveAcademicRiskDto } from './dto/resolve-academic-risk.dto';
import { DismissAcademicRiskDto } from './dto/dismiss-academic-risk.dto';
import { EvaluateRisksDto } from './dto/evaluate-risks.dto';
import { AcademicRiskEvaluationService } from './academic-risk-evaluation.service';

@Injectable()
export class AcademicRisksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly evaluationService: AcademicRiskEvaluationService,
  ) {}

  async findAll(query: GetAcademicRisksDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: Prisma.AcademicRiskAlertWhereInput = {};

    if (query.type) where.type = query.type as RiskType;
    if (query.severity) where.severity = query.severity as RiskSeverity;
    if (query.status) where.status = query.status as RiskStatus;
    if (query.semesterId) where.semesterId = query.semesterId;

    if (query.studentCode || query.fullName || query.departmentId) {
      where.student = {
        ...(query.studentCode
          ? { studentCode: { contains: query.studentCode, mode: 'insensitive' } }
          : {}),
        ...(query.fullName ? { fullName: { contains: query.fullName, mode: 'insensitive' } } : {}),
        ...(query.departmentId ? { departmentId: query.departmentId } : {}),
      };
    }

    const orderBy: Record<string, string> = {
      [query.sortBy ?? 'detectedAt']: query.sortOrder ?? 'desc',
    };

    const [data, total] = await Promise.all([
      this.prisma.academicRiskAlert.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          student: {
            select: { studentCode: true, fullName: true, department: { select: { name: true } } },
          },
          semester: { select: { code: true, name: true } },
        },
      }),
      this.prisma.academicRiskAlert.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const alert = await this.prisma.academicRiskAlert.findUnique({
      where: { id },
      include: {
        student: {
          select: { studentCode: true, fullName: true, userId: true },
        },
        semester: { select: { code: true, name: true } },
      },
    });
    if (!alert) throw new NotFoundException('Không tìm thấy cảnh báo học vụ');
    return alert;
  }

  async evaluate(dto: EvaluateRisksDto, actorUserId: string) {
    const { semesterId, studentId } = dto;

    if (studentId) {
      const result = await this.evaluationService.evaluateStudent(studentId, semesterId);
      await this.audit.record({
        actorUserId,
        action: 'EVALUATE_ACADEMIC_RISKS',
        entityType: 'AcademicRiskAlert',
        entityId: studentId,
        newValues: { semesterId, ...result } as Prisma.InputJsonObject,
        metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
      });
      return result;
    }

    const result = await this.evaluationService.evaluateAll(semesterId);
    await this.audit.record({
      actorUserId,
      action: 'EVALUATE_ACADEMIC_RISKS_ALL',
      entityType: 'AcademicRiskAlert',
      entityId: semesterId,
      newValues: result as Prisma.InputJsonObject,
      metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
    });
    return result;
  }

  async acknowledge(id: string, actorUserId: string) {
    const alert = await this.findOne(id);

    if (alert.status !== RiskStatus.OPEN) {
      throw new BadRequestException('Chỉ có thể xác nhận cảnh báo ở trạng thái OPEN');
    }

    const updated = await this.prisma.academicRiskAlert.update({
      where: { id },
      data: {
        status: RiskStatus.ACKNOWLEDGED,
        acknowledgedAt: new Date(),
        acknowledgedByUserId: actorUserId,
      },
    });

    await this.audit.record({
      actorUserId,
      action: 'ACKNOWLEDGE_RISK_ALERT',
      entityType: 'AcademicRiskAlert',
      entityId: id,
      newValues: { status: RiskStatus.ACKNOWLEDGED },
      metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
    });

    return updated;
  }

  async resolve(id: string, dto: ResolveAcademicRiskDto, actorUserId: string) {
    if (!dto.resolutionNote || dto.resolutionNote.trim().length === 0) {
      throw new BadRequestException('Ghi chú giải quyết là bắt buộc');
    }

    const alert = await this.findOne(id);

    if (alert.status === RiskStatus.RESOLVED || alert.status === RiskStatus.DISMISSED) {
      throw new BadRequestException('Cảnh báo đã được giải quyết hoặc bỏ qua');
    }

    const updated = await this.prisma.academicRiskAlert.update({
      where: { id },
      data: {
        status: RiskStatus.RESOLVED,
        resolvedAt: new Date(),
        resolvedByUserId: actorUserId,
        resolutionNote: dto.resolutionNote,
      },
    });

    // Notify student
    await this.prisma.notification
      .create({
        data: {
          userId: alert.student.userId,
          type: 'SYSTEM',
          title: 'Cảnh báo học vụ đã được giải quyết',
          content: `Cảnh báo "${alert.title}" đã được giải quyết. Ghi chú: ${dto.resolutionNote}`,
        },
      })
      .catch(() => {});

    await this.audit.record({
      actorUserId,
      action: 'RESOLVE_RISK_ALERT',
      entityType: 'AcademicRiskAlert',
      entityId: id,
      newValues: { status: RiskStatus.RESOLVED, resolutionNote: dto.resolutionNote },
      metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
    });

    return updated;
  }

  async dismiss(id: string, dto: DismissAcademicRiskDto, actorUserId: string) {
    if (!dto.dismissReason || dto.dismissReason.trim().length === 0) {
      throw new BadRequestException('Lý do bỏ qua là bắt buộc');
    }

    const alert = await this.findOne(id);

    if (alert.status === RiskStatus.RESOLVED || alert.status === RiskStatus.DISMISSED) {
      throw new BadRequestException('Cảnh báo đã được giải quyết hoặc bỏ qua');
    }

    const updated = await this.prisma.academicRiskAlert.update({
      where: { id },
      data: {
        status: RiskStatus.DISMISSED,
        dismissedAt: new Date(),
        dismissedByUserId: actorUserId,
        dismissReason: dto.dismissReason,
      },
    });

    await this.audit.record({
      actorUserId,
      action: 'DISMISS_RISK_ALERT',
      entityType: 'AcademicRiskAlert',
      entityId: id,
      newValues: { status: RiskStatus.DISMISSED, dismissReason: dto.dismissReason },
      metadata: { ipAddress: '0.0.0.0', userAgent: 'system' },
    });

    return updated;
  }

  async getStudentRisks(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Không tìm thấy sinh viên');

    return this.prisma.academicRiskAlert.findMany({
      where: { studentId: student.id },
      orderBy: { detectedAt: 'desc' },
      include: { semester: { select: { code: true, name: true } } },
    });
  }
}

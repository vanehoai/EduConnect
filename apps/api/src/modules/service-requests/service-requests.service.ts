import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ServiceRequestStatus, ServiceRequestPriority } from '@prisma/client';
import {
  CreateServiceRequestCategoryDto,
  UpdateServiceRequestCategoryDto,
  CreateServiceRequestDto,
  AssignServiceRequestDto,
  ResolveServiceRequestDto,
  CancelServiceRequestDto,
  CreateServiceRequestCommentDto,
} from './dto/service-request.dto';
import { AuthUser } from '@school/shared-types';
import { buildCsvContent } from '../../common/utils/csv.util';

@Injectable()
export class ServiceRequestsService {
  private readonly logger = new Logger(ServiceRequestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // =================== CATEGORY MANAGEMENT ===================

  async getCategories(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return this.prisma.serviceRequestCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getCategory(id: string) {
    const category = await this.prisma.serviceRequestCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(dto: CreateServiceRequestCategoryDto, currentUser: AuthUser) {
    const existing = await this.prisma.serviceRequestCategory.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new BadRequestException('Category code already exists');

    const category = await this.prisma.serviceRequestCategory.create({
      data: dto,
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'CREATE',
        entityType: 'ServiceRequestCategory',
        entityId: category.id,
        newValues: category as Prisma.InputJsonValue,
      },
    });
    return category;
  }

  async updateCategory(id: string, dto: UpdateServiceRequestCategoryDto, currentUser: AuthUser) {
    const old = await this.getCategory(id);
    const category = await this.prisma.serviceRequestCategory.update({
      where: { id },
      data: dto,
    });
    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'UPDATE',
        entityType: 'ServiceRequestCategory',
        entityId: id,
        oldValues: old as Prisma.InputJsonValue,
        newValues: category as Prisma.InputJsonValue,
      },
    });
    return category;
  }

  async deleteCategory(id: string, currentUser: AuthUser) {
    const old = await this.getCategory(id);
    const count = await this.prisma.serviceRequest.count({ where: { categoryId: id } });
    if (count > 0) {
      const updated = await this.prisma.serviceRequestCategory.update({
        where: { id },
        data: { isActive: false },
      });
      await this.prisma.auditLog.create({
        data: {
          actorUserId: currentUser.id,
          action: 'DEACTIVATE',
          entityType: 'ServiceRequestCategory',
          entityId: id,
          oldValues: old as Prisma.InputJsonValue,
          newValues: updated as Prisma.InputJsonValue,
        },
      });
      return updated;
    }

    await this.prisma.serviceRequestCategory.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'DELETE',
        entityType: 'ServiceRequestCategory',
        entityId: id,
        oldValues: old as Prisma.InputJsonValue,
      },
    });
    return { success: true };
  }

  // =================== REQUEST NUMBER GENERATION ===================

  private async generateRequestNumber(tx: Prisma.TransactionClient): Promise<string> {
    const year = new Date().getFullYear();
    const lockKey = 999999;
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

    const lastRequest = await tx.serviceRequest.findFirst({
      where: {
        requestNumber: {
          startsWith: `REQ-${year}-`,
        },
      },
      orderBy: {
        requestNumber: 'desc',
      },
    });

    let nextSeq = 1;
    if (lastRequest) {
      const parts = lastRequest.requestNumber.split('-');
      if (parts.length === 3) {
        nextSeq = parseInt(parts[2] || '0', 10) + 1;
      }
    }

    return `REQ-${year}-${nextSeq.toString().padStart(6, '0')}`;
  }

  // =================== SERVICE REQUEST LIFECYCLE ===================

  async createServiceRequest(
    studentId: string,
    dto: CreateServiceRequestDto,
    currentUser: AuthUser,
  ) {
    if (currentUser.id !== studentId && !currentUser.roles.includes('ADMIN')) {
      throw new ForbiddenException('You can only create requests for yourself');
    }

    const category = await this.prisma.serviceRequestCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new BadRequestException('Invalid category');
    if (!category.isActive) throw new BadRequestException('Category is inactive');

    const dueAt = category.slaHours ? new Date(Date.now() + category.slaHours * 3600000) : null;
    const priority = dto.priority || category.defaultPriority;

    return this.prisma.$transaction(
      async (tx) => {
        const requestNumber = await this.generateRequestNumber(tx);
        const request = await tx.serviceRequest.create({
          data: {
            requestNumber,
            studentId,
            categoryId: dto.categoryId,
            subject: dto.subject,
            description: dto.description,
            priority,
            status: 'OPEN',
            dueAt,
            attachments:
              dto.attachments && dto.attachments.length > 0
                ? {
                    create: dto.attachments.map((att) => ({
                      uploadedByUserId: currentUser.id,
                      originalName: att.fileName,
                      storageKey: att.fileUrl,
                      sizeBytes: att.fileSize || 0,
                      mimeType: att.mimeType || 'application/octet-stream',
                    })),
                  }
                : undefined,
          },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: currentUser.id,
            action: 'CREATE',
            entityType: 'ServiceRequest',
            entityId: request.id,
            newValues: request as Prisma.InputJsonValue,
          },
        });
        return request;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
  }

  async getServiceRequests(
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: ServiceRequestStatus;
      priority?: ServiceRequestPriority;
      categoryId?: string;
      assigneeId?: string;
      studentId?: string;
      search?: string;
    },
    currentUser: AuthUser,
  ) {
    const where: Prisma.ServiceRequestWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.assigneeId) where.assignedToUserId = filters.assigneeId || undefined;

    if (
      currentUser.roles.includes('STUDENT') &&
      !currentUser.roles.includes('ADMIN') &&
      !currentUser.roles.includes('TRAINING_STAFF')
    ) {
      where.studentId = currentUser.id;
    } else if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { requestNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.serviceRequest.count({ where });
    const data = await this.prisma.serviceRequest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
        student: { select: { id: true, fullName: true, studentCode: true } },
      },
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceRequestById(id: string, currentUser: AuthUser) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        category: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
        student: { select: { id: true, fullName: true, studentCode: true } },
      },
    });

    if (!request) throw new NotFoundException('Service Request not found');

    if (
      currentUser.roles.includes('STUDENT') &&
      !currentUser.roles.includes('ADMIN') &&
      request.studentId !== currentUser.id
    ) {
      throw new ForbiddenException('You are not allowed to view this request');
    }

    return request;
  }

  async assignRequest(id: string, dto: AssignServiceRequestDto, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);

    if (request.status === 'CLOSED' || request.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot assign request in status ${request.status}`);
    }

    const assignee = await this.prisma.user.findUnique({ where: { id: dto.assignedToUserId } });
    if (!assignee) throw new BadRequestException('Assignee not found');

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        assignedToUserId: dto.assignedToUserId,
        assignedByUserId: currentUser.id,
        assignedAt: new Date(),
        status: request.status === 'OPEN' ? 'ASSIGNED' : request.status,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'ASSIGN',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { assignedToUserId: request.assignedToUserId },
        newValues: { assignedToUserId: updated.assignedToUserId },
      },
    });
    return updated;
  }

  async unassignRequest(id: string, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        assignedToUserId: null,
        assignedByUserId: null,
        assignedAt: null,
        status: request.status === 'ASSIGNED' ? 'OPEN' : request.status,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'UNASSIGN',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { assignedToUserId: request.assignedToUserId },
        newValues: { assignedToUserId: null },
      },
    });
    return updated;
  }

  async startProgress(id: string, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);
    if (!['OPEN', 'ASSIGNED', 'WAITING_FOR_STUDENT'].includes(request.status)) {
      throw new BadRequestException(`Cannot start progress from status ${request.status}`);
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        firstResponseAt: request.firstResponseAt || new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'STATUS_CHANGE',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { status: request.status },
        newValues: { status: 'IN_PROGRESS' },
      },
    });
    return updated;
  }

  async resolveRequest(id: string, dto: ResolveServiceRequestDto, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);
    if (['CLOSED', 'CANCELLED'].includes(request.status)) {
      throw new BadRequestException(`Cannot resolve request from status ${request.status}`);
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolutionSummary: dto.resolutionSummary,
        resolvedAt: new Date(),
        resolvedByUserId: currentUser.id,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'STATUS_CHANGE',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { status: request.status },
        newValues: { status: 'RESOLVED' },
      },
    });
    return updated;
  }

  async closeRequest(id: string, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);
    if (request.status !== 'RESOLVED') {
      throw new BadRequestException('Only RESOLVED requests can be CLOSED');
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'STATUS_CHANGE',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { status: request.status },
        newValues: { status: 'CLOSED' },
      },
    });
    return updated;
  }

  async cancelRequest(id: string, dto: CancelServiceRequestDto, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);
    if (['CLOSED', 'RESOLVED', 'CANCELLED'].includes(request.status)) {
      throw new BadRequestException(`Cannot cancel request in status ${request.status}`);
    }

    if (currentUser.roles.includes('STUDENT') && !currentUser.roles.includes('ADMIN')) {
      if (['IN_PROGRESS'].includes(request.status)) {
        throw new BadRequestException('Cannot cancel a request that is currently in progress.');
      }
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: dto.cancelReason,
        cancelledAt: new Date(),
        cancelledByUserId: currentUser.id,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'STATUS_CHANGE',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { status: request.status },
        newValues: { status: 'CANCELLED' },
      },
    });
    return updated;
  }

  async reopenRequest(id: string, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);
    if (!['RESOLVED', 'CLOSED'].includes(request.status)) {
      throw new BadRequestException(`Cannot reopen request from status ${request.status}`);
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: 'REOPENED',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: currentUser.id,
        action: 'STATUS_CHANGE',
        entityType: 'ServiceRequest',
        entityId: id,
        oldValues: { status: request.status },
        newValues: { status: 'REOPENED' },
      },
    });
    return updated;
  }

  async addComment(id: string, dto: CreateServiceRequestCommentDto, currentUser: AuthUser) {
    const request = await this.getServiceRequestById(id, currentUser);

    const isInternal = dto.visibility === 'INTERNAL';

    if (
      isInternal &&
      currentUser.roles.includes('STUDENT') &&
      !currentUser.roles.includes('ADMIN')
    ) {
      throw new ForbiddenException('Students cannot create internal comments');
    }

    const comment = await this.prisma.serviceRequestComment.create({
      data: {
        serviceRequestId: id,
        authorUserId: currentUser.id,
        content: dto.content,
        visibility: dto.visibility || 'PUBLIC',
        attachments:
          dto.attachments && dto.attachments.length > 0
            ? {
                create: dto.attachments.map((att) => ({
                  serviceRequestId: id,
                  uploadedByUserId: currentUser.id,
                  originalName: att.fileName,
                  storageKey: att.fileUrl,
                  sizeBytes: att.fileSize || 0,
                  mimeType: att.mimeType || 'application/octet-stream',
                })),
              }
            : undefined,
      },
    });

    if (currentUser.roles.includes('STUDENT') && request.status === 'WAITING_FOR_STUDENT') {
      await this.prisma.serviceRequest.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
      await this.prisma.auditLog.create({
        data: {
          actorUserId: currentUser.id,
          action: 'STATUS_CHANGE',
          entityType: 'ServiceRequest',
          entityId: id,
          oldValues: { status: 'WAITING_FOR_STUDENT' },
          newValues: { status: 'IN_PROGRESS' },
        },
      });
    }

    return comment;
  }

  async getComments(id: string, currentUser: AuthUser) {
    await this.getServiceRequestById(id, currentUser);
    const isStudent =
      currentUser.roles.includes('STUDENT') &&
      !currentUser.roles.includes('ADMIN') &&
      !currentUser.roles.includes('TRAINING_STAFF');

    const where: Prisma.ServiceRequestCommentWhereInput = {
      serviceRequestId: id,
      deletedAt: null,
    };

    if (isStudent) {
      where.visibility = 'PUBLIC';
    }

    return this.prisma.serviceRequestComment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  // =================== REPORTS ===================

  async getReportSummary() {
    const total = await this.prisma.serviceRequest.count();
    const open = await this.prisma.serviceRequest.count({ where: { status: 'OPEN' } });
    const inProgress = await this.prisma.serviceRequest.count({ where: { status: 'IN_PROGRESS' } });
    const resolved = await this.prisma.serviceRequest.count({ where: { status: 'RESOLVED' } });
    const closed = await this.prisma.serviceRequest.count({ where: { status: 'CLOSED' } });
    const cancelled = await this.prisma.serviceRequest.count({ where: { status: 'CANCELLED' } });

    const byPriority = {
      LOW: await this.prisma.serviceRequest.count({ where: { priority: 'LOW' } }),
      NORMAL: await this.prisma.serviceRequest.count({ where: { priority: 'NORMAL' } }),
      HIGH: await this.prisma.serviceRequest.count({ where: { priority: 'HIGH' } }),
      URGENT: await this.prisma.serviceRequest.count({ where: { priority: 'URGENT' } }),
    };

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      cancelled,
      byPriority,
    };
  }

  async getReportByCategory() {
    const items = await this.prisma.serviceRequest.groupBy({
      by: ['categoryId'],
      _count: { _all: true },
    });
    const categories = await this.prisma.serviceRequestCategory.findMany();
    return items.map((item) => {
      const cat = categories.find((c) => c.id === item.categoryId);
      return {
        categoryId: item.categoryId,
        categoryName: cat?.name || 'Unknown',
        count: item._count._all,
      };
    });
  }

  async getReportByStatus() {
    const items = await this.prisma.serviceRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    return items.map((item) => ({
      status: item.status,
      count: item._count._all,
    }));
  }

  async getReportByAssignee() {
    const items = await this.prisma.serviceRequest.groupBy({
      by: ['assignedToUserId'],
      _count: { _all: true },
    });

    const userIds = items.map((i) => i.assignedToUserId).filter((id) => id !== null) as string[];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true },
    });

    return items.map((item) => {
      const user = users.find((u) => u.id === item.assignedToUserId);
      return {
        assigneeId: item.assignedToUserId,
        assigneeName: user?.fullName || 'Unassigned',
        count: item._count._all,
      };
    });
  }

  async getReportSla() {
    const overdueRequests = await this.prisma.serviceRequest.findMany({
      where: {
        dueAt: { lt: new Date() },
        status: { notIn: ['RESOLVED', 'CLOSED', 'CANCELLED'] },
      },
      include: {
        category: true,
      },
    });
    return { overdueCount: overdueRequests.length, overdueRequests };
  }

  async exportToCsv() {
    const requests = await this.prisma.serviceRequest.findMany({
      include: {
        category: true,
        student: { select: { fullName: true, studentCode: true } },
        assignedTo: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Request Number',
      'Subject',
      'Category',
      'Status',
      'Priority',
      'Student',
      'Assignee',
      'Created At',
    ];
    const rows = requests.map((r) => [
      r.requestNumber,
      r.subject,
      r.category?.name || '',
      r.status,
      r.priority,
      r.student?.fullName || '',
      r.assignedTo?.fullName || '',
      r.createdAt.toISOString(),
    ]);
    return buildCsvContent(headers, rows);
  }
}

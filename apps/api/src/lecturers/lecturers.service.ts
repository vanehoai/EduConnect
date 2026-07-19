import { HttpStatus, Injectable } from '@nestjs/common';
import { LecturerStatus, Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateLecturerDto } from './dto/create-lecturer.dto';
import type { LecturerQueryDto } from './dto/lecturer-query.dto';
import type { UpdateLecturerDto } from './dto/update-lecturer.dto';

const lecturerSelect = {
  id: true,
  lecturerCode: true,
  userId: true,
  departmentId: true,
  fullName: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  gender: true,
  academicRank: true,
  specialization: true,
  status: true,
  department: { select: { id: true, code: true, name: true } },
  user: { select: { id: true, status: true } },
  headedDepartment: { select: { id: true, code: true, name: true } },
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  _count: { select: { classSections: true, attendanceSessions: true } },
} satisfies Prisma.LecturerSelect;

@Injectable()
export class LecturersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: LecturerQueryDto) {
    const where: Prisma.LecturerWhereInput = {
      ...(!query.includeDeleted ? { deletedAt: null } : {}),
      ...(query.departmentId ? { departmentId: query.departmentId } : {}),
      ...(query.academicRank
        ? { academicRank: { contains: query.academicRank, mode: 'insensitive' } }
        : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { lecturerCode: { contains: query.search, mode: 'insensitive' } },
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const orderBy = {
      [query.sortBy]: query.sortOrder,
    } as Prisma.LecturerOrderByWithRelationInput;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.lecturer.findMany({
        where,
        select: lecturerSelect,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.lecturer.count({ where }),
    ]);
    return { data, meta: paginationMeta(query.page, query.limit, total) };
  }

  async findOne(id: string, includeDeleted = false) {
    const lecturer = await this.prisma.lecturer.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
      select: lecturerSelect,
    });
    if (!lecturer) {
      throw new BusinessException(
        'LECTURER_NOT_FOUND',
        'Không tìm thấy giảng viên',
        HttpStatus.NOT_FOUND,
      );
    }
    return lecturer;
  }

  async findMe(userId: string) {
    const lecturer = await this.prisma.lecturer.findFirst({
      where: { userId, deletedAt: null },
      select: lecturerSelect,
    });
    if (!lecturer) {
      throw new BusinessException(
        'LECTURER_PROFILE_NOT_FOUND',
        'Tài khoản chưa có hồ sơ giảng viên',
        HttpStatus.NOT_FOUND,
      );
    }
    return lecturer;
  }

  async create(actorUserId: string, dto: CreateLecturerDto, metadata: RequestMetadata) {
    await this.ensureDepartment(dto.departmentId);
    await this.ensureAvailableLecturerUser(dto.userId, dto.email);
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const lecturer = await transaction.lecturer.create({
          data: {
            ...dto,
            status: dto.status ?? LecturerStatus.ACTIVE,
          },
          select: lecturerSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'LECTURER_CREATED',
            entityType: 'Lecturer',
            entityId: lecturer.id,
            newValues: this.auditValues(lecturer),
            metadata,
          },
          transaction,
        );
        return lecturer;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(actorUserId: string, id: string, dto: UpdateLecturerDto, metadata: RequestMetadata) {
    const existing = await this.findOne(id);
    if (dto.departmentId && dto.departmentId !== existing.departmentId) {
      if (existing.headedDepartment) {
        throw new BusinessException(
          'LECTURER_IS_DEPARTMENT_HEAD',
          'Phải thay trưởng khoa trước khi chuyển khoa cho giảng viên',
          HttpStatus.CONFLICT,
        );
      }
      await this.ensureDepartment(dto.departmentId);
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        if (dto.email && dto.email !== existing.email) {
          await transaction.user.update({
            where: { id: existing.userId },
            data: { email: dto.email },
          });
        }
        const lecturer = await transaction.lecturer.update({
          where: { id },
          data: dto,
          select: lecturerSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'LECTURER_UPDATED',
            entityType: 'Lecturer',
            entityId: id,
            oldValues: this.auditValues(existing),
            newValues: this.auditValues(lecturer),
            metadata,
          },
          transaction,
        );
        return lecturer;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async softDelete(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findOne(id);
    if (
      existing.headedDepartment ||
      existing._count.classSections > 0 ||
      existing._count.attendanceSessions > 0
    ) {
      throw new BusinessException(
        'LECTURER_IN_USE',
        'Không thể xóa giảng viên đang làm trưởng khoa hoặc có dữ liệu giảng dạy',
        HttpStatus.CONFLICT,
      );
    }
    const now = new Date();
    await this.prisma.$transaction(async (transaction) => {
      await transaction.lecturer.update({
        where: { id },
        data: { deletedAt: now, status: LecturerStatus.INACTIVE },
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'LECTURER_DELETED',
          entityType: 'Lecturer',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: { deletedAt: now.toISOString(), status: LecturerStatus.INACTIVE },
          metadata,
        },
        transaction,
      );
    });
  }

  async restore(actorUserId: string, id: string, metadata: RequestMetadata) {
    const existing = await this.prisma.lecturer.findFirst({
      where: { id, deletedAt: { not: null } },
      select: lecturerSelect,
    });
    if (!existing) {
      throw new BusinessException(
        'LECTURER_NOT_FOUND',
        'Không tìm thấy giảng viên đã xóa',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.ensureDepartment(existing.departmentId);
    return this.prisma.$transaction(async (transaction) => {
      const lecturer = await transaction.lecturer.update({
        where: { id },
        data: { deletedAt: null, status: LecturerStatus.ACTIVE },
        select: lecturerSelect,
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'LECTURER_RESTORED',
          entityType: 'Lecturer',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: this.auditValues(lecturer),
          metadata,
        },
        transaction,
      );
      return lecturer;
    });
  }

  private async ensureDepartment(departmentId: string): Promise<void> {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, deletedAt: null, status: 'ACTIVE' },
      select: { id: true },
    });
    if (!department) {
      throw new BusinessException(
        'DEPARTMENT_NOT_FOUND',
        'Khoa không tồn tại hoặc không hoạt động',
      );
    }
  }

  private async ensureAvailableLecturerUser(userId: string, email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        email: true,
        lecturer: { select: { id: true } },
        roles: { select: { role: { select: { code: true } } } },
      },
    });
    if (!user || !user.roles.some(({ role }) => role.code === 'LECTURER')) {
      throw new BusinessException(
        'LECTURER_USER_ROLE_REQUIRED',
        'Tài khoản liên kết phải có vai trò LECTURER',
      );
    }
    if (user.lecturer) {
      throw new BusinessException(
        'LECTURER_USER_ALREADY_LINKED',
        'Tài khoản đã liên kết với một giảng viên khác',
        HttpStatus.CONFLICT,
      );
    }
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      throw new BusinessException(
        'LECTURER_EMAIL_MISMATCH',
        'Email giảng viên phải trùng với email tài khoản liên kết',
      );
    }
  }

  private auditValues(lecturer: {
    lecturerCode: string;
    userId: string;
    departmentId: string;
    fullName: string;
    email: string;
    phone: string | null;
    academicRank: string | null;
    specialization: string | null;
    status: LecturerStatus;
    deletedAt: Date | null;
  }): Prisma.InputJsonValue {
    return {
      lecturerCode: lecturer.lecturerCode,
      userId: lecturer.userId,
      departmentId: lecturer.departmentId,
      fullName: lecturer.fullName,
      email: lecturer.email,
      phone: lecturer.phone,
      academicRank: lecturer.academicRank,
      specialization: lecturer.specialization,
      status: lecturer.status,
      deletedAt: lecturer.deletedAt?.toISOString() ?? null,
    };
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BusinessException(
        'LECTURER_DUPLICATE',
        'Mã giảng viên, email hoặc tài khoản liên kết đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }
    throw error;
  }
}

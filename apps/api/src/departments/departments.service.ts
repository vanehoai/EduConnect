import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, RecordStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDepartmentDto } from './dto/create-department.dto';
import type { DepartmentQueryDto } from './dto/department-query.dto';
import type { UpdateDepartmentDto } from './dto/update-department.dto';

const departmentSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  status: true,
  headLecturerId: true,
  headLecturer: {
    select: { id: true, lecturerCode: true, fullName: true, email: true },
  },
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  _count: { select: { lecturers: true, students: true, courses: true } },
} satisfies Prisma.DepartmentSelect;

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: DepartmentQueryDto) {
    const where: Prisma.DepartmentWhereInput = {
      ...(query.includeDeleted ? {} : { deletedAt: null }),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: 'insensitive' } },
              { name: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const orderBy = {
      [query.sortBy]: query.sortOrder,
    } as Prisma.DepartmentOrderByWithRelationInput;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where,
        select: departmentSelect,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.department.count({ where }),
    ]);
    return { data, meta: paginationMeta(query.page, query.limit, total) };
  }

  async findOne(id: string, includeDeleted = false) {
    const department = await this.prisma.department.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
      select: departmentSelect,
    });
    if (!department) {
      throw new BusinessException(
        'DEPARTMENT_NOT_FOUND',
        'Không tìm thấy khoa',
        HttpStatus.NOT_FOUND,
      );
    }
    return department;
  }

  async create(actorUserId: string, dto: CreateDepartmentDto, metadata: RequestMetadata) {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const department = await transaction.department.create({
          data: {
            code: dto.code,
            name: dto.name,
            description: dto.description,
            status: dto.status ?? RecordStatus.ACTIVE,
          },
          select: departmentSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'DEPARTMENT_CREATED',
            entityType: 'Department',
            entityId: department.id,
            newValues: this.auditValues(department),
            metadata,
          },
          transaction,
        );
        return department;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(
    actorUserId: string,
    id: string,
    dto: UpdateDepartmentDto,
    metadata: RequestMetadata,
  ) {
    const existing = await this.findOne(id);
    if (dto.headLecturerId) {
      const lecturer = await this.prisma.lecturer.findFirst({
        where: { id: dto.headLecturerId, deletedAt: null },
        select: { departmentId: true },
      });
      if (!lecturer || lecturer.departmentId !== id) {
        throw new BusinessException(
          'DEPARTMENT_HEAD_INVALID',
          'Trưởng khoa phải là giảng viên đang thuộc khoa này',
        );
      }
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const department = await transaction.department.update({
          where: { id },
          data: dto,
          select: departmentSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'DEPARTMENT_UPDATED',
            entityType: 'Department',
            entityId: id,
            oldValues: this.auditValues(existing),
            newValues: this.auditValues(department),
            metadata,
          },
          transaction,
        );
        return department;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async softDelete(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findOne(id);
    if (
      existing._count.lecturers > 0 ||
      existing._count.students > 0 ||
      existing._count.courses > 0
    ) {
      throw new BusinessException(
        'DEPARTMENT_IN_USE',
        'Không thể xóa khoa đang có giảng viên, sinh viên hoặc môn học',
        HttpStatus.CONFLICT,
      );
    }
    const now = new Date();
    await this.prisma.$transaction(async (transaction) => {
      await transaction.department.update({
        where: { id },
        data: { deletedAt: now, status: RecordStatus.INACTIVE, headLecturerId: null },
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'DEPARTMENT_DELETED',
          entityType: 'Department',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: { deletedAt: now.toISOString(), status: RecordStatus.INACTIVE },
          metadata,
        },
        transaction,
      );
    });
  }

  async restore(actorUserId: string, id: string, metadata: RequestMetadata) {
    const existing = await this.prisma.department.findFirst({
      where: { id, deletedAt: { not: null } },
      select: departmentSelect,
    });
    if (!existing) {
      throw new BusinessException(
        'DEPARTMENT_NOT_FOUND',
        'Không tìm thấy khoa đã xóa',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.$transaction(async (transaction) => {
      const department = await transaction.department.update({
        where: { id },
        data: { deletedAt: null, status: RecordStatus.ACTIVE },
        select: departmentSelect,
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'DEPARTMENT_RESTORED',
          entityType: 'Department',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: this.auditValues(department),
          metadata,
        },
        transaction,
      );
      return department;
    });
  }

  private auditValues(department: {
    code: string;
    name: string;
    description: string | null;
    status: RecordStatus;
    headLecturerId: string | null;
    deletedAt: Date | null;
  }): Prisma.InputJsonValue {
    return {
      code: department.code,
      name: department.name,
      description: department.description,
      status: department.status,
      headLecturerId: department.headLecturerId,
      deletedAt: department.deletedAt?.toISOString() ?? null,
    };
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BusinessException(
        'DEPARTMENT_DUPLICATE',
        'Mã khoa hoặc tên khoa đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }
    throw error;
  }
}

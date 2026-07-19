import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { AcademicYearQueryDto } from './dto/academic-year-query.dto';
import type { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import type { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

const academicYearSelect = {
  id: true,
  code: true,
  name: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { semesters: true, students: true } },
} satisfies Prisma.AcademicYearSelect;

type AcademicYearRecord = Prisma.AcademicYearGetPayload<{ select: typeof academicYearSelect }>;

@Injectable()
export class AcademicYearsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: AcademicYearQueryDto) {
    const where: Prisma.AcademicYearWhereInput = {
      ...(query.isCurrent !== undefined ? { isCurrent: query.isCurrent } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: 'insensitive' } },
              { name: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.academicYear.findMany({
        where,
        select: academicYearSelect,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        } as Prisma.AcademicYearOrderByWithRelationInput,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.academicYear.count({ where }),
    ]);
    return { data, meta: paginationMeta(query.page, query.limit, total) };
  }

  async findOne(id: string): Promise<AcademicYearRecord> {
    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id },
      select: academicYearSelect,
    });
    if (!academicYear) {
      throw new BusinessException(
        'ACADEMIC_YEAR_NOT_FOUND',
        'Không tìm thấy năm học',
        HttpStatus.NOT_FOUND,
      );
    }
    return academicYear;
  }

  async create(actorUserId: string, dto: CreateAcademicYearDto, metadata: RequestMetadata) {
    this.validateDates(dto.startDate, dto.endDate);
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (dto.isCurrent) {
            await transaction.academicYear.updateMany({
              where: { isCurrent: true },
              data: { isCurrent: false },
            });
          }
          const academicYear = await transaction.academicYear.create({
            data: { ...dto, isCurrent: dto.isCurrent ?? false },
            select: academicYearSelect,
          });
          await this.audit.record(
            {
              actorUserId,
              action: 'ACADEMIC_YEAR_CREATED',
              entityType: 'AcademicYear',
              entityId: academicYear.id,
              newValues: this.auditValues(academicYear),
              metadata,
            },
            transaction,
          );
          return academicYear;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(
    actorUserId: string,
    id: string,
    dto: UpdateAcademicYearDto,
    metadata: RequestMetadata,
  ) {
    const existing = await this.findOne(id);
    this.validateDates(dto.startDate ?? existing.startDate, dto.endDate ?? existing.endDate);
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (dto.isCurrent) {
            await transaction.academicYear.updateMany({
              where: { isCurrent: true, id: { not: id } },
              data: { isCurrent: false },
            });
          }
          const academicYear = await transaction.academicYear.update({
            where: { id },
            data: dto,
            select: academicYearSelect,
          });
          await this.audit.record(
            {
              actorUserId,
              action: 'ACADEMIC_YEAR_UPDATED',
              entityType: 'AcademicYear',
              entityId: id,
              oldValues: this.auditValues(existing),
              newValues: this.auditValues(academicYear),
              metadata,
            },
            transaction,
          );
          return academicYear;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async remove(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findOne(id);
    if (existing._count.semesters > 0 || existing._count.students > 0) {
      throw new BusinessException(
        'ACADEMIC_YEAR_IN_USE',
        'Không thể xóa năm học đã có học kỳ hoặc sinh viên',
        HttpStatus.CONFLICT,
      );
    }
    await this.prisma.$transaction(async (transaction) => {
      await transaction.academicYear.delete({ where: { id } });
      await this.audit.record(
        {
          actorUserId,
          action: 'ACADEMIC_YEAR_DELETED',
          entityType: 'AcademicYear',
          entityId: id,
          oldValues: this.auditValues(existing),
          metadata,
        },
        transaction,
      );
    });
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new BusinessException(
        'ACADEMIC_YEAR_DATES_INVALID',
        'Ngày bắt đầu năm học phải trước ngày kết thúc',
      );
    }
  }

  private auditValues(value: AcademicYearRecord): Prisma.InputJsonValue {
    return {
      code: value.code,
      name: value.name,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
      isCurrent: value.isCurrent,
    };
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = String(error.meta?.target ?? '');
      throw new BusinessException(
        target.includes('single_current')
          ? 'ACADEMIC_YEAR_CURRENT_CONFLICT'
          : 'ACADEMIC_YEAR_DUPLICATE',
        target.includes('single_current')
          ? 'Chỉ được phép có một năm học hiện tại'
          : 'Mã năm học đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }
    throw error;
  }
}

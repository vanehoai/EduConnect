import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, SemesterStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSemesterDto } from './dto/create-semester.dto';
import type { SemesterQueryDto } from './dto/semester-query.dto';
import type { UpdateSemesterDto } from './dto/update-semester.dto';

const semesterSelect = {
  id: true,
  academicYearId: true,
  code: true,
  name: true,
  term: true,
  startDate: true,
  endDate: true,
  registrationStartDate: true,
  registrationEndDate: true,
  maxCredits: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  academicYear: { select: { id: true, code: true, name: true } },
  _count: { select: { classSections: true, tuitionPolicies: true, invoices: true } },
} satisfies Prisma.SemesterSelect;

type SemesterRecord = Prisma.SemesterGetPayload<{ select: typeof semesterSelect }>;

const allowedTransitions: Record<SemesterStatus, SemesterStatus[]> = {
  PLANNED: [SemesterStatus.REGISTRATION_OPEN, SemesterStatus.IN_PROGRESS],
  REGISTRATION_OPEN: [SemesterStatus.PLANNED, SemesterStatus.IN_PROGRESS],
  IN_PROGRESS: [SemesterStatus.COMPLETED],
  COMPLETED: [SemesterStatus.CLOSED],
  CLOSED: [],
};

@Injectable()
export class SemestersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: SemesterQueryDto) {
    const where: Prisma.SemesterWhereInput = {
      academicYearId: query.academicYearId,
      term: query.term,
      status: query.status,
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
      this.prisma.semester.findMany({
        where,
        select: semesterSelect,
        orderBy: { [query.sortBy]: query.sortOrder } as Prisma.SemesterOrderByWithRelationInput,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.semester.count({ where }),
    ]);
    return { data, meta: paginationMeta(query.page, query.limit, total) };
  }

  async findOne(id: string): Promise<SemesterRecord> {
    const semester = await this.prisma.semester.findUnique({
      where: { id },
      select: semesterSelect,
    });
    if (!semester)
      throw new BusinessException(
        'SEMESTER_NOT_FOUND',
        'Không tìm thấy học kỳ',
        HttpStatus.NOT_FOUND,
      );
    return semester;
  }

  async create(actorUserId: string, dto: CreateSemesterDto, metadata: RequestMetadata) {
    const academicYear = await this.loadAcademicYear(dto.academicYearId);
    this.validateDates(dto, academicYear);
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (dto.status === SemesterStatus.REGISTRATION_OPEN)
            await this.assertNoRegistrationOpen(transaction);
          const semester = await transaction.semester.create({ data: dto, select: semesterSelect });
          await this.audit.record(
            {
              actorUserId,
              action: 'SEMESTER_CREATED',
              entityType: 'Semester',
              entityId: semester.id,
              newValues: this.auditValues(semester),
              metadata,
            },
            transaction,
          );
          return semester;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(actorUserId: string, id: string, dto: UpdateSemesterDto, metadata: RequestMetadata) {
    const existing = await this.findOne(id);
    const academicYear = await this.loadAcademicYear(dto.academicYearId ?? existing.academicYearId);
    const merged = {
      startDate: dto.startDate ?? existing.startDate,
      endDate: dto.endDate ?? existing.endDate,
      registrationStartDate: dto.registrationStartDate ?? existing.registrationStartDate,
      registrationEndDate: dto.registrationEndDate ?? existing.registrationEndDate,
    };
    this.validateDates(merged, academicYear);
    if (
      dto.status &&
      dto.status !== existing.status &&
      !allowedTransitions[existing.status].includes(dto.status)
    ) {
      throw new BusinessException(
        'SEMESTER_STATUS_TRANSITION_INVALID',
        `Không thể chuyển trạng thái từ ${existing.status} sang ${dto.status}`,
      );
    }
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (dto.status === SemesterStatus.REGISTRATION_OPEN)
            await this.assertNoRegistrationOpen(transaction, id);
          const semester = await transaction.semester.update({
            where: { id },
            data: dto,
            select: semesterSelect,
          });
          await this.audit.record(
            {
              actorUserId,
              action: 'SEMESTER_UPDATED',
              entityType: 'Semester',
              entityId: id,
              oldValues: this.auditValues(existing),
              newValues: this.auditValues(semester),
              metadata,
            },
            transaction,
          );
          return semester;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async remove(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findOne(id);
    if (
      existing._count.classSections ||
      existing._count.tuitionPolicies ||
      existing._count.invoices
    ) {
      throw new BusinessException(
        'SEMESTER_IN_USE',
        'Không thể xóa học kỳ đã có dữ liệu tham chiếu',
        HttpStatus.CONFLICT,
      );
    }
    await this.prisma.$transaction(async (transaction) => {
      await transaction.semester.delete({ where: { id } });
      await this.audit.record(
        {
          actorUserId,
          action: 'SEMESTER_DELETED',
          entityType: 'Semester',
          entityId: id,
          oldValues: this.auditValues(existing),
          metadata,
        },
        transaction,
      );
    });
  }

  private async loadAcademicYear(id: string) {
    const value = await this.prisma.academicYear.findUnique({
      where: { id },
      select: { id: true, startDate: true, endDate: true },
    });
    if (!value)
      throw new BusinessException(
        'ACADEMIC_YEAR_NOT_FOUND',
        'Không tìm thấy năm học',
        HttpStatus.NOT_FOUND,
      );
    return value;
  }

  private validateDates(
    value: {
      startDate: Date;
      endDate: Date;
      registrationStartDate: Date;
      registrationEndDate: Date;
    },
    academicYear: { startDate: Date; endDate: Date },
  ) {
    if (value.startDate >= value.endDate)
      throw new BusinessException(
        'SEMESTER_DATES_INVALID',
        'Ngày bắt đầu học kỳ phải trước ngày kết thúc',
      );
    if (
      value.registrationStartDate >= value.registrationEndDate ||
      value.registrationEndDate > value.startDate
    )
      throw new BusinessException(
        'SEMESTER_REGISTRATION_DATES_INVALID',
        'Thời gian đăng ký phải kết thúc không muộn hơn ngày bắt đầu học kỳ',
      );
    if (value.startDate < academicYear.startDate || value.endDate > academicYear.endDate)
      throw new BusinessException(
        'SEMESTER_OUTSIDE_ACADEMIC_YEAR',
        'Học kỳ phải nằm trong khoảng thời gian của năm học',
      );
  }

  private async assertNoRegistrationOpen(
    transaction: Prisma.TransactionClient,
    excludeId?: string,
  ) {
    const existing = await transaction.semester.findFirst({
      where: {
        status: SemesterStatus.REGISTRATION_OPEN,
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: { id: true },
    });
    if (existing)
      throw new BusinessException(
        'SEMESTER_REGISTRATION_OPEN_CONFLICT',
        'Chỉ được phép có một học kỳ đang mở đăng ký',
        HttpStatus.CONFLICT,
      );
  }

  private auditValues(value: SemesterRecord): Prisma.InputJsonValue {
    return {
      code: value.code,
      name: value.name,
      academicYearId: value.academicYearId,
      term: value.term,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
      registrationStartDate: value.registrationStartDate.toISOString(),
      registrationEndDate: value.registrationEndDate.toISOString(),
      maxCredits: value.maxCredits,
      status: value.status,
    };
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = String(error.meta?.target ?? '');
      const registrationConflict = target.includes('registration_open');
      throw new BusinessException(
        registrationConflict ? 'SEMESTER_REGISTRATION_OPEN_CONFLICT' : 'SEMESTER_DUPLICATE',
        registrationConflict
          ? 'Chỉ được phép có một học kỳ đang mở đăng ký'
          : 'Mã học kỳ hoặc học kỳ trong năm học đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }
    throw error;
  }
}

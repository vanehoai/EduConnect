import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, RecordStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { CourseQueryDto } from './dto/course-query.dto';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import type { AddPrerequisiteDto, UpdatePrerequisiteDto } from './dto/upsert-prerequisite.dto';

const courseSelect = {
  id: true,
  courseCode: true,
  name: true,
  credits: true,
  theoryPeriods: true,
  practicePeriods: true,
  tuitionFeePerCredit: true,
  departmentId: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  department: { select: { id: true, code: true, name: true } },
  prerequisites: {
    select: {
      prerequisiteCourseId: true,
      minimumGrade: true,
      prerequisiteCourse: {
        select: { id: true, courseCode: true, name: true, credits: true, status: true },
      },
    },
    orderBy: { prerequisiteCourse: { courseCode: 'asc' as const } },
  },
  _count: {
    select: {
      classSections: true,
      questions: true,
      exams: true,
      tuitionItems: true,
      prerequisites: true,
      requiredFor: true,
    },
  },
} satisfies Prisma.CourseSelect;

type CourseRecord = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: CourseQueryDto) {
    const where: Prisma.CourseWhereInput = {
      departmentId: query.departmentId,
      status: query.status,
      ...(!query.includeDeleted ? { deletedAt: null } : {}),
      ...(query.search
        ? {
            OR: [
              { courseCode: { contains: query.search, mode: 'insensitive' } },
              { name: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        select: courseSelect,
        orderBy: { [query.sortBy]: query.sortOrder } as Prisma.CourseOrderByWithRelationInput,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.course.count({ where }),
    ]);
    return { data, meta: paginationMeta(query.page, query.limit, total) };
  }

  async findOne(id: string): Promise<CourseRecord> {
    const course = await this.prisma.course.findUnique({ where: { id }, select: courseSelect });
    if (!course)
      throw new BusinessException(
        'COURSE_NOT_FOUND',
        'Không tìm thấy môn học',
        HttpStatus.NOT_FOUND,
      );
    return course;
  }

  async create(actorUserId: string, dto: CreateCourseDto, metadata: RequestMetadata) {
    await this.assertDepartmentActive(dto.departmentId);
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const course = await transaction.course.create({ data: dto, select: courseSelect });
        await this.audit.record(
          {
            actorUserId,
            action: 'COURSE_CREATED',
            entityType: 'Course',
            entityId: course.id,
            newValues: this.auditValues(course),
            metadata,
          },
          transaction,
        );
        return course;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(actorUserId: string, id: string, dto: UpdateCourseDto, metadata: RequestMetadata) {
    const existing = await this.findOne(id);
    if (dto.departmentId) await this.assertDepartmentActive(dto.departmentId);
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const course = await transaction.course.update({
          where: { id },
          data: dto,
          select: courseSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'COURSE_UPDATED',
            entityType: 'Course',
            entityId: id,
            oldValues: this.auditValues(existing),
            newValues: this.auditValues(course),
            metadata,
          },
          transaction,
        );
        return course;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async remove(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findOne(id);
    const counts = existing._count;
    if (
      counts.classSections ||
      counts.questions ||
      counts.exams ||
      counts.tuitionItems ||
      counts.prerequisites ||
      counts.requiredFor
    ) {
      throw new BusinessException(
        'COURSE_IN_USE',
        'Không thể xóa môn học đang có dữ liệu tham chiếu hoặc quan hệ tiên quyết',
        HttpStatus.CONFLICT,
      );
    }
    await this.prisma.$transaction(async (transaction) => {
      const course = await transaction.course.update({
        where: { id },
        data: { deletedAt: new Date(), status: RecordStatus.ARCHIVED },
        select: courseSelect,
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'COURSE_DELETED',
          entityType: 'Course',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: this.auditValues(course),
          metadata,
        },
        transaction,
      );
    });
  }

  async restore(actorUserId: string, id: string, metadata: RequestMetadata) {
    const existing = await this.findOne(id);
    if (!existing.deletedAt)
      throw new BusinessException('COURSE_NOT_DELETED', 'Môn học chưa bị xóa');
    await this.assertDepartmentActive(existing.departmentId);
    return this.prisma.$transaction(async (transaction) => {
      const course = await transaction.course.update({
        where: { id },
        data: { deletedAt: null, status: RecordStatus.ACTIVE },
        select: courseSelect,
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'COURSE_RESTORED',
          entityType: 'Course',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: this.auditValues(course),
          metadata,
        },
        transaction,
      );
      return course;
    });
  }

  async addPrerequisite(
    actorUserId: string,
    courseId: string,
    dto: AddPrerequisiteDto,
    metadata: RequestMetadata,
  ) {
    if (courseId === dto.prerequisiteCourseId)
      throw new BusinessException(
        'PREREQUISITE_SELF_REFERENCE',
        'Môn học không thể là môn tiên quyết của chính nó',
      );
    await Promise.all([
      this.assertCourseActive(courseId),
      this.assertCourseActive(dto.prerequisiteCourseId),
    ]);
    if (await this.wouldCreateCycle(courseId, dto.prerequisiteCourseId)) {
      throw new BusinessException(
        'PREREQUISITE_CYCLE',
        'Quan hệ môn tiên quyết tạo thành vòng lặp',
        HttpStatus.CONFLICT,
      );
    }
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const relation = await transaction.prerequisite.create({
          data: {
            courseId,
            prerequisiteCourseId: dto.prerequisiteCourseId,
            minimumGrade: dto.minimumGrade,
          },
          select: {
            courseId: true,
            prerequisiteCourseId: true,
            minimumGrade: true,
            prerequisiteCourse: { select: { courseCode: true, name: true } },
          },
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'COURSE_PREREQUISITE_ADDED',
            entityType: 'Prerequisite',
            entityId: `${courseId}:${dto.prerequisiteCourseId}`,
            newValues: this.prerequisiteAuditValues(relation),
            metadata,
          },
          transaction,
        );
        return relation;
      });
    } catch (error) {
      this.rethrowPrerequisiteError(error);
    }
  }

  async updatePrerequisite(
    actorUserId: string,
    courseId: string,
    prerequisiteCourseId: string,
    dto: UpdatePrerequisiteDto,
    metadata: RequestMetadata,
  ) {
    const existing = await this.prisma.prerequisite.findUnique({
      where: { courseId_prerequisiteCourseId: { courseId, prerequisiteCourseId } },
      select: { courseId: true, prerequisiteCourseId: true, minimumGrade: true },
    });
    if (!existing)
      throw new BusinessException(
        'PREREQUISITE_NOT_FOUND',
        'Không tìm thấy quan hệ môn tiên quyết',
        HttpStatus.NOT_FOUND,
      );
    return this.prisma.$transaction(async (transaction) => {
      const relation = await transaction.prerequisite.update({
        where: { courseId_prerequisiteCourseId: { courseId, prerequisiteCourseId } },
        data: { minimumGrade: dto.minimumGrade },
        select: {
          courseId: true,
          prerequisiteCourseId: true,
          minimumGrade: true,
          prerequisiteCourse: { select: { courseCode: true, name: true } },
        },
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'COURSE_PREREQUISITE_UPDATED',
          entityType: 'Prerequisite',
          entityId: `${courseId}:${prerequisiteCourseId}`,
          oldValues: this.prerequisiteAuditValues(existing),
          newValues: this.prerequisiteAuditValues(relation),
          metadata,
        },
        transaction,
      );
      return relation;
    });
  }

  async removePrerequisite(
    actorUserId: string,
    courseId: string,
    prerequisiteCourseId: string,
    metadata: RequestMetadata,
  ): Promise<void> {
    const existing = await this.prisma.prerequisite.findUnique({
      where: { courseId_prerequisiteCourseId: { courseId, prerequisiteCourseId } },
      select: { courseId: true, prerequisiteCourseId: true, minimumGrade: true },
    });
    if (!existing)
      throw new BusinessException(
        'PREREQUISITE_NOT_FOUND',
        'Không tìm thấy quan hệ môn tiên quyết',
        HttpStatus.NOT_FOUND,
      );
    await this.prisma.$transaction(async (transaction) => {
      await transaction.prerequisite.delete({
        where: { courseId_prerequisiteCourseId: { courseId, prerequisiteCourseId } },
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'COURSE_PREREQUISITE_REMOVED',
          entityType: 'Prerequisite',
          entityId: `${courseId}:${prerequisiteCourseId}`,
          oldValues: this.prerequisiteAuditValues(existing),
          metadata,
        },
        transaction,
      );
    });
  }

  async wouldCreateCycle(courseId: string, prerequisiteCourseId: string): Promise<boolean> {
    const visited = new Set<string>();
    let frontier = [prerequisiteCourseId];
    while (frontier.length) {
      if (frontier.includes(courseId)) return true;
      const unvisited = frontier.filter((id) => !visited.has(id));
      if (!unvisited.length) return false;
      unvisited.forEach((id) => visited.add(id));
      const edges = await this.prisma.prerequisite.findMany({
        where: { courseId: { in: unvisited } },
        select: { prerequisiteCourseId: true },
      });
      frontier = edges.map((edge) => edge.prerequisiteCourseId);
    }
    return false;
  }

  private async assertDepartmentActive(id: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, status: RecordStatus.ACTIVE, deletedAt: null },
      select: { id: true },
    });
    if (!department)
      throw new BusinessException(
        'DEPARTMENT_NOT_ACTIVE',
        'Khoa không tồn tại hoặc không hoạt động',
      );
  }

  private async assertCourseActive(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, status: RecordStatus.ACTIVE, deletedAt: null },
      select: { id: true },
    });
    if (!course)
      throw new BusinessException(
        'COURSE_NOT_ACTIVE',
        'Môn học không tồn tại hoặc không hoạt động',
        HttpStatus.NOT_FOUND,
      );
  }

  private auditValues(value: CourseRecord): Prisma.InputJsonValue {
    return {
      courseCode: value.courseCode,
      name: value.name,
      credits: value.credits,
      theoryPeriods: value.theoryPeriods,
      practicePeriods: value.practicePeriods,
      tuitionFeePerCredit: value.tuitionFeePerCredit.toString(),
      departmentId: value.departmentId,
      description: value.description ?? undefined,
      status: value.status,
      deletedAt: value.deletedAt?.toISOString() ?? undefined,
    };
  }

  private prerequisiteAuditValues(value: {
    courseId: string;
    prerequisiteCourseId: string;
    minimumGrade: Prisma.Decimal | null;
  }): Prisma.InputJsonValue {
    return {
      courseId: value.courseId,
      prerequisiteCourseId: value.prerequisiteCourseId,
      minimumGrade: value.minimumGrade?.toString() ?? undefined,
    };
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
      throw new BusinessException('COURSE_DUPLICATE', 'Mã môn học đã tồn tại', HttpStatus.CONFLICT);
    throw error;
  }

  private rethrowPrerequisiteError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
      throw new BusinessException(
        'PREREQUISITE_DUPLICATE',
        'Quan hệ môn tiên quyết đã tồn tại',
        HttpStatus.CONFLICT,
      );
    throw error;
  }
}

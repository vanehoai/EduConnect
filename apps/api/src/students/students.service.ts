import { HttpStatus, Injectable } from '@nestjs/common';
import { AcademicStatus, Prisma, UserStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { hash } from 'bcryptjs';
import { parse } from 'csv-parse/sync';
import { AuditService } from '../audit/audit.service';
import { PASSWORD_HASH_ROUNDS } from '../auth/auth.constants';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { BusinessException } from '../common/exceptions/business.exception';
import { paginationMeta } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateStudentDto } from './dto/create-student.dto';
import { StudentImportRowDto } from './dto/student-import-row.dto';
import type { StudentQueryDto } from './dto/student-query.dto';
import type { UpdateStudentDto } from './dto/update-student.dto';

const studentSelect = {
  id: true,
  studentCode: true,
  userId: true,
  departmentId: true,
  admissionAcademicYearId: true,
  fullName: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  gender: true,
  address: true,
  cohortClass: true,
  cohort: true,
  enrollmentDate: true,
  academicStatus: true,
  department: { select: { id: true, code: true, name: true } },
  admissionAcademicYear: { select: { id: true, code: true, name: true } },
  user: { select: { id: true, status: true } },
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  _count: {
    select: {
      enrollments: true,
      attendanceRecords: true,
      grades: true,
      examAssignments: true,
      examAttempts: true,
      invoices: true,
      paymentTransactions: true,
    },
  },
} satisfies Prisma.StudentSelect;

type StudentRecord = Prisma.StudentGetPayload<{ select: typeof studentSelect }>;

export interface StudentImportError {
  row: number;
  code: string;
  message: string;
}

interface StudentImportPlan {
  row: number;
  dto: StudentImportRowDto;
  departmentId: string;
  admissionAcademicYearId: string | null;
  existingUserId: string | null;
  passwordHash: string | null;
}

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: StudentQueryDto, financeView = false) {
    const where = this.listWhere(query, financeView);
    const orderBy = {
      [query.sortBy]: query.sortOrder,
    } as Prisma.StudentOrderByWithRelationInput;
    const [students, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        select: studentSelect,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.student.count({ where }),
    ]);
    return {
      data: financeView ? students.map((student) => this.financeView(student)) : students,
      meta: paginationMeta(query.page, query.limit, total),
    };
  }

  async findOne(id: string, financeView = false) {
    const student = await this.findRecord(id);
    return financeView ? this.financeView(student) : student;
  }

  async findMe(userId: string) {
    const student = await this.prisma.student.findFirst({
      where: { userId, deletedAt: null },
      select: studentSelect,
    });
    if (!student) {
      throw new BusinessException(
        'STUDENT_PROFILE_NOT_FOUND',
        'Tài khoản chưa có hồ sơ sinh viên',
        HttpStatus.NOT_FOUND,
      );
    }
    return student;
  }

  async getGpa(userId: string) {
    const student = await this.prisma.student.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!student) {
      throw new BusinessException(
        'STUDENT_NOT_FOUND',
        'Sinh viên không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: { not: 'DROPPED' },
        finalGradePublishedAt: { not: null },
      },
      include: {
        classSection: {
          include: {
            course: true,
            semester: true,
          },
        },
      },
    });

    const letterToGpa = (letter: string) => {
      switch (letter) {
        case 'A':
          return 4.0;
        case 'B+':
          return 3.5;
        case 'B':
          return 3.0;
        case 'C+':
          return 2.5;
        case 'C':
          return 2.0;
        case 'D+':
          return 1.5;
        case 'D':
          return 1.0;
        case 'F':
          return 0.0;
        default:
          return 0.0;
      }
    };

    const semesterMap = new Map<
      string,
      { totalPoints: Prisma.Decimal; totalCredits: number; semester: { id: string; code: string } }
    >();

    for (const en of enrollments) {
      if (!en.letterGrade) continue;
      const semId = en.classSection.semesterId;
      const credits = en.classSection.course.credits;
      const gpa = letterToGpa(en.letterGrade);

      if (!semesterMap.has(semId)) {
        semesterMap.set(semId, {
          totalPoints: new Prisma.Decimal(0),
          totalCredits: 0,
          semester: en.classSection.semester,
        });
      }

      const semData = semesterMap.get(semId)!;
      semData.totalPoints = semData.totalPoints.add(new Prisma.Decimal(gpa).mul(credits));
      semData.totalCredits += credits;
    }

    const semesterGpas = Array.from(semesterMap.values()).map((data) => ({
      semesterId: data.semester.id,
      semesterCode: data.semester.code,
      gpa:
        data.totalCredits > 0
          ? data.totalPoints
              .div(data.totalCredits)
              .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
              .toNumber()
          : 0,
      credits: data.totalCredits,
    }));

    const highestEnrollments = new Map<string, (typeof enrollments)[0]>();
    for (const en of enrollments) {
      if (!en.letterGrade) continue;
      const courseId = en.classSection.courseId;
      const existing = highestEnrollments.get(courseId);
      if (!existing || Number(en.finalScore) > Number(existing.finalScore)) {
        highestEnrollments.set(courseId, en);
      }
    }

    let cumPoints = new Prisma.Decimal(0);
    let cumCredits = 0;
    for (const en of highestEnrollments.values()) {
      const credits = en.classSection.course.credits;
      const gpa = letterToGpa(en.letterGrade!);
      cumPoints = cumPoints.add(new Prisma.Decimal(gpa).mul(credits));
      cumCredits += credits;
    }

    const cumulativeGpa =
      cumCredits > 0
        ? cumPoints.div(cumCredits).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP).toNumber()
        : 0;

    return {
      semesterGpas,
      cumulativeGpa,
      totalCredits: cumCredits,
    };
  }

  async findAvailableClassSections(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    semesterId?: string,
  ) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) {
      throw new BusinessException(
        'STUDENT_NOT_FOUND',
        'Sinh viên không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const where: Prisma.ClassSectionWhereInput = {
      status: 'OPEN',
      ...(semesterId ? { semesterId } : {}),
      ...(search
        ? {
            OR: [
              { sectionCode: { contains: search, mode: 'insensitive' } },
              { course: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [classSections, total] = await this.prisma.$transaction([
      this.prisma.classSection.findMany({
        where,
        include: {
          course: { include: { prerequisites: true } },
          semester: true,
          schedules: true,
          lecturer: { select: { fullName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.classSection.count({ where }),
    ]);

    // const activeSemesters = [...new Set(classSections.map((cs) => cs.semesterId))];

    // Fetch student's current enrollments and completed prerequisites
    const allEnrollments = await this.prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { classSection: { include: { course: true, schedules: true } } },
    });

    const enrolledBySemester = new Map<string, typeof allEnrollments>();
    for (const en of allEnrollments) {
      if (en.status !== 'ENROLLED') continue;
      const sid = en.classSection.semesterId;
      if (!enrolledBySemester.has(sid)) enrolledBySemester.set(sid, []);
      enrolledBySemester.get(sid)!.push(en);
    }

    const results = classSections.map((cs) => {
      const ineligibilityReasons: string[] = [];
      const currentEnrollments = enrolledBySemester.get(cs.semesterId) || [];
      const now = new Date();

      // Validate Registration time
      if (cs.semester.status !== 'REGISTRATION_OPEN') {
        ineligibilityReasons.push('Học kỳ chưa mở đăng ký');
      } else if (now < cs.semester.registrationStartDate || now > cs.semester.registrationEndDate) {
        ineligibilityReasons.push('Ngoài thời gian đăng ký học kỳ này');
      }

      // Check max capacity
      if (cs.enrolledCount >= cs.maxCapacity) {
        ineligibilityReasons.push('Lớp đã đầy');
      }

      // 1. Check duplicate course
      const existingCourseEnrollment = currentEnrollments.find(
        (e) => e.classSection.courseId === cs.courseId,
      );
      if (existingCourseEnrollment) {
        ineligibilityReasons.push('Đã đăng ký một lớp khác của môn học này trong học kỳ');
      }

      // 2. Check maxCredits
      const currentCredits = currentEnrollments.reduce(
        (sum, en) => sum + en.classSection.course.credits,
        0,
      );
      if (
        !existingCourseEnrollment &&
        currentCredits + cs.course.credits > cs.semester.maxCredits
      ) {
        ineligibilityReasons.push(`Vượt quá số tín chỉ tối đa (${cs.semester.maxCredits})`);
      }

      // 3. Check schedule conflict
      let hasConflict = false;
      for (const en of currentEnrollments) {
        if (hasConflict) break;
        for (const currentSchedule of en.classSection.schedules) {
          if (hasConflict) break;
          for (const newSchedule of cs.schedules) {
            if (currentSchedule.dayOfWeek === newSchedule.dayOfWeek) {
              const cStart = currentSchedule.startTime.getTime();
              const cEnd = currentSchedule.endTime.getTime();
              const nStart = newSchedule.startTime.getTime();
              const nEnd = newSchedule.endTime.getTime();
              if (Math.max(cStart, nStart) < Math.min(cEnd, nEnd)) {
                hasConflict = true;
                ineligibilityReasons.push(`Trùng lịch học với lớp ${en.classSection.sectionCode}`);
                break;
              }
            }
          }
        }
      }

      // 4. Check prerequisites
      for (const prereq of cs.course.prerequisites) {
        const passed = allEnrollments.find(
          (e) =>
            e.status === 'COMPLETED' && e.classSection.courseId === prereq.prerequisiteCourseId,
        );
        if (!passed) {
          ineligibilityReasons.push('Chưa đạt môn tiên quyết');
          break; // Avoid spamming multiple prereq errors
        }
      }

      return {
        ...cs,
        eligible: ineligibilityReasons.length === 0,
        ineligibilityReasons,
      };
    });

    return {
      data: results,
      meta: paginationMeta(page, limit, total),
    };
  }

  async create(actorUserId: string, dto: CreateStudentDto, metadata: RequestMetadata) {
    await this.ensureDepartment(dto.departmentId);
    if (dto.admissionAcademicYearId) {
      await this.ensureAcademicYear(dto.admissionAcademicYearId);
    }
    await this.ensureAvailableStudentUser(dto.userId, dto.email);
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const student = await transaction.student.create({
          data: {
            ...dto,
            academicStatus: dto.academicStatus ?? AcademicStatus.STUDYING,
          },
          select: studentSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'STUDENT_CREATED',
            entityType: 'Student',
            entityId: student.id,
            newValues: this.auditValues(student),
            metadata,
          },
          transaction,
        );
        return student;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async update(actorUserId: string, id: string, dto: UpdateStudentDto, metadata: RequestMetadata) {
    const existing = await this.findRecord(id);
    if (dto.departmentId) await this.ensureDepartment(dto.departmentId);
    if (dto.admissionAcademicYearId) {
      await this.ensureAcademicYear(dto.admissionAcademicYearId);
    }
    try {
      return await this.prisma.$transaction(async (transaction) => {
        if (dto.email && dto.email !== existing.email) {
          await transaction.user.update({
            where: { id: existing.userId },
            data: { email: dto.email },
          });
        }
        const student = await transaction.student.update({
          where: { id },
          data: dto,
          select: studentSelect,
        });
        await this.audit.record(
          {
            actorUserId,
            action: 'STUDENT_UPDATED',
            entityType: 'Student',
            entityId: id,
            oldValues: this.auditValues(existing),
            newValues: this.auditValues(student),
            metadata,
          },
          transaction,
        );
        return student;
      });
    } catch (error) {
      this.rethrowKnownError(error);
    }
  }

  async softDelete(actorUserId: string, id: string, metadata: RequestMetadata): Promise<void> {
    const existing = await this.findRecord(id);
    if (Object.values(existing._count).some((count) => count > 0)) {
      throw new BusinessException(
        'STUDENT_IN_USE',
        'Không thể xóa sinh viên đã có dữ liệu học tập, thi hoặc tài chính',
        HttpStatus.CONFLICT,
      );
    }
    const now = new Date();
    await this.prisma.$transaction(async (transaction) => {
      await transaction.student.update({
        where: { id },
        data: { deletedAt: now, academicStatus: AcademicStatus.WITHDRAWN },
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'STUDENT_DELETED',
          entityType: 'Student',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: { deletedAt: now.toISOString(), academicStatus: AcademicStatus.WITHDRAWN },
          metadata,
        },
        transaction,
      );
    });
  }

  async restore(actorUserId: string, id: string, metadata: RequestMetadata) {
    const existing = await this.prisma.student.findFirst({
      where: { id, deletedAt: { not: null } },
      select: studentSelect,
    });
    if (!existing) {
      throw new BusinessException(
        'STUDENT_NOT_FOUND',
        'Không tìm thấy sinh viên đã xóa',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.ensureDepartment(existing.departmentId);
    return this.prisma.$transaction(async (transaction) => {
      const student = await transaction.student.update({
        where: { id },
        data: { deletedAt: null, academicStatus: AcademicStatus.STUDYING },
        select: studentSelect,
      });
      await this.audit.record(
        {
          actorUserId,
          action: 'STUDENT_RESTORED',
          entityType: 'Student',
          entityId: id,
          oldValues: this.auditValues(existing),
          newValues: this.auditValues(student),
          metadata,
        },
        transaction,
      );
      return student;
    });
  }

  async importCsv(
    actorUserId: string,
    file: Express.Multer.File | undefined,
    atomic: boolean,
    metadata: RequestMetadata,
  ) {
    if (!file || !file.buffer?.length) {
      throw new BusinessException('STUDENT_IMPORT_FILE_REQUIRED', 'Vui lòng chọn file CSV');
    }
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BusinessException(
        'STUDENT_IMPORT_FILE_INVALID',
        'File import phải có định dạng CSV',
      );
    }

    let rawRows: Record<string, string>[];
    try {
      rawRows = parse(file.buffer, {
        bom: true,
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as Record<string, string>[];
    } catch {
      throw new BusinessException('STUDENT_IMPORT_CSV_INVALID', 'Không thể đọc nội dung CSV');
    }
    if (!rawRows.length) {
      throw new BusinessException('STUDENT_IMPORT_EMPTY', 'File CSV không có dữ liệu');
    }
    if (rawRows.length > 1000) {
      throw new BusinessException(
        'STUDENT_IMPORT_TOO_LARGE',
        'Mỗi lần chỉ được import tối đa 1000 dòng',
      );
    }

    const { plans, errors } = await this.prepareImport(rawRows);
    if (atomic && errors.length) {
      throw new BusinessException(
        'STUDENT_IMPORT_VALIDATION_FAILED',
        'File CSV có dòng không hợp lệ; chế độ atomic không tạo dữ liệu',
        HttpStatus.UNPROCESSABLE_ENTITY,
        errors,
      );
    }

    const studentRole = await this.prisma.role.findUnique({
      where: { code: 'STUDENT' },
      select: { id: true },
    });
    if (!studentRole) {
      throw new BusinessException('STUDENT_ROLE_NOT_FOUND', 'Không tìm thấy vai trò STUDENT');
    }

    if (atomic) {
      try {
        await this.prisma.$transaction(async (transaction) => {
          for (const plan of plans) {
            await this.createImportedStudent(
              transaction,
              actorUserId,
              plan,
              studentRole.id,
              metadata,
            );
          }
        });
      } catch (error) {
        this.rethrowKnownError(error);
      }
      return { imported: plans.length, errors: [], atomic: true };
    }

    let imported = 0;
    for (const plan of plans) {
      try {
        await this.prisma.$transaction((transaction) =>
          this.createImportedStudent(transaction, actorUserId, plan, studentRole.id, metadata),
        );
        imported += 1;
      } catch (error) {
        const response =
          error instanceof BusinessException
            ? (error.getResponse() as { message?: string | string[] })
            : undefined;
        errors.push({
          row: plan.row,
          code: 'STUDENT_IMPORT_DATABASE_ERROR',
          message:
            typeof response?.message === 'string'
              ? response.message
              : 'Không thể tạo sinh viên do dữ liệu đã thay đổi',
        });
      }
    }
    return { imported, errors: errors.sort((a, b) => a.row - b.row), atomic: false };
  }

  async exportCsv(query: StudentQueryDto): Promise<string> {
    const students = await this.prisma.student.findMany({
      where: this.listWhere(query),
      select: studentSelect,
      orderBy: { studentCode: 'asc' },
      take: 10_000,
    });
    const header = [
      'studentCode',
      'fullName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'departmentCode',
      'admissionAcademicYearCode',
      'cohortClass',
      'cohort',
      'enrollmentDate',
      'academicStatus',
    ];
    const rows = students.map((student) => [
      student.studentCode,
      student.fullName,
      student.email,
      student.phone ?? '',
      this.dateOnly(student.dateOfBirth),
      student.gender ?? '',
      student.address ?? '',
      student.department.code,
      student.admissionAcademicYear?.code ?? '',
      student.cohortClass,
      student.cohort,
      this.dateOnly(student.enrollmentDate),
      student.academicStatus,
    ]);
    return [header, ...rows].map((row) => row.map(this.csvCell).join(',')).join('\r\n');
  }

  importTemplate(): string {
    return [
      'studentCode,fullName,email,phone,dateOfBirth,gender,address,departmentCode,admissionAcademicYearCode,cohortClass,cohort,enrollmentDate,academicStatus,initialPassword',
      'SV2025001,Nguyễn Văn A,student@example.edu.vn,0901234567,2007-01-15,MALE,TP.HCM,CNTT,2025-2026,CNTT2025A,K2025,2025-09-01,STUDYING,Password@123',
    ].join('\r\n');
  }

  private async prepareImport(rawRows: Record<string, string>[]) {
    const plans: StudentImportPlan[] = [];
    const errors: StudentImportError[] = [];
    const rows: Array<{ row: number; dto: StudentImportRowDto }> = [];
    const seenCodes = new Set<string>();
    const seenEmails = new Set<string>();

    for (let index = 0; index < rawRows.length; index += 1) {
      const rowNumber = index + 2;
      const dto = plainToInstance(StudentImportRowDto, rawRows[index]);
      const validationErrors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (validationErrors.length) {
        errors.push({
          row: rowNumber,
          code: 'STUDENT_IMPORT_ROW_INVALID',
          message: validationErrors
            .flatMap((error) => Object.values(error.constraints ?? {}))
            .join('; '),
        });
        continue;
      }
      if (seenCodes.has(dto.studentCode) || seenEmails.has(dto.email)) {
        errors.push({
          row: rowNumber,
          code: 'STUDENT_IMPORT_DUPLICATE_IN_FILE',
          message: 'Mã sinh viên hoặc email bị trùng trong file',
        });
        continue;
      }
      seenCodes.add(dto.studentCode);
      seenEmails.add(dto.email);
      rows.push({ row: rowNumber, dto });
    }

    const departmentCodes = [...new Set(rows.map(({ dto }) => dto.departmentCode))];
    const academicYearCodes = [
      ...new Set(
        rows
          .map(({ dto }) => dto.admissionAcademicYearCode)
          .filter((code): code is string => Boolean(code)),
      ),
    ];
    const emails = rows.map(({ dto }) => dto.email);
    const studentCodes = rows.map(({ dto }) => dto.studentCode);
    const [departments, academicYears, users, existingStudents] = await Promise.all([
      this.prisma.department.findMany({
        where: { code: { in: departmentCodes }, deletedAt: null },
        select: { id: true, code: true },
      }),
      this.prisma.academicYear.findMany({
        where: { code: { in: academicYearCodes } },
        select: { id: true, code: true },
      }),
      this.prisma.user.findMany({
        where: { email: { in: emails }, deletedAt: null },
        select: {
          id: true,
          email: true,
          student: { select: { id: true } },
          roles: { select: { role: { select: { code: true } } } },
        },
      }),
      this.prisma.student.findMany({
        where: {
          OR: [{ studentCode: { in: studentCodes } }, { email: { in: emails } }],
        },
        select: { studentCode: true, email: true },
      }),
    ]);

    const departmentsByCode = new Map(departments.map((value) => [value.code, value.id]));
    const yearsByCode = new Map(academicYears.map((value) => [value.code, value.id]));
    const usersByEmail = new Map(users.map((value) => [value.email.toLowerCase(), value]));
    const existingCodes = new Set(existingStudents.map((value) => value.studentCode));
    const existingEmails = new Set(existingStudents.map((value) => value.email.toLowerCase()));

    for (const row of rows) {
      const departmentId = departmentsByCode.get(row.dto.departmentCode);
      const yearId = row.dto.admissionAcademicYearCode
        ? yearsByCode.get(row.dto.admissionAcademicYearCode)
        : undefined;
      const user = usersByEmail.get(row.dto.email);
      let error: StudentImportError | undefined;

      if (!departmentId) {
        error = { row: row.row, code: 'DEPARTMENT_NOT_FOUND', message: 'Mã khoa không tồn tại' };
      } else if (row.dto.admissionAcademicYearCode && !yearId) {
        error = {
          row: row.row,
          code: 'ACADEMIC_YEAR_NOT_FOUND',
          message: 'Mã năm học không tồn tại',
        };
      } else if (existingCodes.has(row.dto.studentCode) || existingEmails.has(row.dto.email)) {
        error = {
          row: row.row,
          code: 'STUDENT_IMPORT_DUPLICATE_DATABASE',
          message: 'Mã sinh viên hoặc email đã tồn tại',
        };
      } else if (user?.student) {
        error = {
          row: row.row,
          code: 'STUDENT_USER_ALREADY_LINKED',
          message: 'Tài khoản đã liên kết với sinh viên khác',
        };
      } else if (user && !user.roles.some(({ role }) => role.code === 'STUDENT')) {
        error = {
          row: row.row,
          code: 'STUDENT_USER_ROLE_REQUIRED',
          message: 'Tài khoản hiện có chưa được gán role STUDENT',
        };
      } else if (!user && !row.dto.initialPassword) {
        error = {
          row: row.row,
          code: 'STUDENT_INITIAL_PASSWORD_REQUIRED',
          message: 'Tài khoản mới phải có initialPassword hợp lệ',
        };
      }

      if (error) {
        errors.push(error);
        continue;
      }
      plans.push({
        row: row.row,
        dto: row.dto,
        departmentId: departmentId!,
        admissionAcademicYearId: yearId ?? null,
        existingUserId: user?.id ?? null,
        passwordHash: user ? null : await hash(row.dto.initialPassword!, PASSWORD_HASH_ROUNDS),
      });
    }
    return { plans, errors };
  }

  private async createImportedStudent(
    transaction: Prisma.TransactionClient,
    actorUserId: string,
    plan: StudentImportPlan,
    studentRoleId: string,
    metadata: RequestMetadata,
  ) {
    const userId =
      plan.existingUserId ??
      (
        await transaction.user.create({
          data: {
            email: plan.dto.email,
            fullName: plan.dto.fullName,
            passwordHash: plan.passwordHash!,
            status: UserStatus.ACTIVE,
            roles: { create: { roleId: studentRoleId } },
          },
          select: { id: true },
        })
      ).id;
    const student = await transaction.student.create({
      data: {
        studentCode: plan.dto.studentCode,
        userId,
        departmentId: plan.departmentId,
        admissionAcademicYearId: plan.admissionAcademicYearId,
        fullName: plan.dto.fullName,
        email: plan.dto.email,
        phone: plan.dto.phone || null,
        dateOfBirth: plan.dto.dateOfBirth ? new Date(plan.dto.dateOfBirth) : null,
        gender: plan.dto.gender || null,
        address: plan.dto.address || null,
        cohortClass: plan.dto.cohortClass,
        cohort: plan.dto.cohort,
        enrollmentDate: new Date(plan.dto.enrollmentDate),
        academicStatus: plan.dto.academicStatus ?? AcademicStatus.STUDYING,
      },
      select: studentSelect,
    });
    await this.audit.record(
      {
        actorUserId,
        action: 'STUDENT_IMPORTED',
        entityType: 'Student',
        entityId: student.id,
        newValues: this.auditValues(student),
        metadata,
      },
      transaction,
    );
    return student;
  }

  private async findRecord(id: string): Promise<StudentRecord> {
    const student = await this.prisma.student.findFirst({
      where: { id, deletedAt: null },
      select: studentSelect,
    });
    if (!student) {
      throw new BusinessException(
        'STUDENT_NOT_FOUND',
        'Không tìm thấy sinh viên',
        HttpStatus.NOT_FOUND,
      );
    }
    return student;
  }

  private listWhere(query: StudentQueryDto, forceActive = false): Prisma.StudentWhereInput {
    return {
      ...(!query.includeDeleted || forceActive ? { deletedAt: null } : {}),
      ...(query.departmentId ? { departmentId: query.departmentId } : {}),
      ...(query.cohort ? { cohort: query.cohort } : {}),
      ...(query.academicStatus ? { academicStatus: query.academicStatus } : {}),
      ...(query.search
        ? {
            OR: [
              { studentCode: { contains: query.search, mode: 'insensitive' } },
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
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

  private async ensureAcademicYear(id: string): Promise<void> {
    if (!(await this.prisma.academicYear.findUnique({ where: { id }, select: { id: true } }))) {
      throw new BusinessException('ACADEMIC_YEAR_NOT_FOUND', 'Năm học không tồn tại');
    }
  }

  private async ensureAvailableStudentUser(userId: string, email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        email: true,
        student: { select: { id: true } },
        roles: { select: { role: { select: { code: true } } } },
      },
    });
    if (!user || !user.roles.some(({ role }) => role.code === 'STUDENT')) {
      throw new BusinessException(
        'STUDENT_USER_ROLE_REQUIRED',
        'Tài khoản liên kết phải có vai trò STUDENT',
      );
    }
    if (user.student) {
      throw new BusinessException(
        'STUDENT_USER_ALREADY_LINKED',
        'Tài khoản đã liên kết với một sinh viên khác',
        HttpStatus.CONFLICT,
      );
    }
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      throw new BusinessException(
        'STUDENT_EMAIL_MISMATCH',
        'Email sinh viên phải trùng với email tài khoản liên kết',
      );
    }
  }

  private financeView(student: StudentRecord) {
    return {
      id: student.id,
      studentCode: student.studentCode,
      fullName: student.fullName,
      email: student.email,
      cohort: student.cohort,
      cohortClass: student.cohortClass,
      academicStatus: student.academicStatus,
      department: student.department,
    };
  }

  private auditValues(student: StudentRecord): Prisma.InputJsonValue {
    return {
      studentCode: student.studentCode,
      userId: student.userId,
      departmentId: student.departmentId,
      admissionAcademicYearId: student.admissionAcademicYearId,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      cohortClass: student.cohortClass,
      cohort: student.cohort,
      academicStatus: student.academicStatus,
      deletedAt: student.deletedAt?.toISOString() ?? null,
    };
  }

  private dateOnly(value: Date | null): string {
    return value ? value.toISOString().slice(0, 10) : '';
  }

  private csvCell(value: unknown): string {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  private rethrowKnownError(error: unknown): never {
    if (error instanceof BusinessException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BusinessException(
        'STUDENT_DUPLICATE',
        'Mã sinh viên, email hoặc tài khoản liên kết đã tồn tại',
        HttpStatus.CONFLICT,
      );
    }
    throw error;
  }
}

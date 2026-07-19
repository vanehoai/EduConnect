import { AuditService } from '../audit/audit.service';
import { CoursesService } from '../courses/courses.service';
import { DepartmentsService } from '../departments/departments.service';
import { LecturersService } from '../lecturers/lecturers.service';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';

const metadata = { ipAddress: null, userAgent: null };
const audit = { record: jest.fn() } as unknown as AuditService;

describe('Reference safety before soft delete', () => {
  it('chặn xóa khoa đang có sinh viên', async () => {
    const prisma = {
      department: {
        findFirst: jest
          .fn()
          .mockResolvedValue({ id: 'd1', _count: { lecturers: 0, students: 1, courses: 0 } }),
      },
      $transaction: jest.fn(),
    };
    const service = new DepartmentsService(prisma as unknown as PrismaService, audit);
    await expect(service.softDelete('actor', 'd1', metadata)).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'DEPARTMENT_IN_USE' }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('chặn xóa giảng viên có dữ liệu giảng dạy', async () => {
    const prisma = {
      lecturer: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'l1',
          headedDepartment: null,
          _count: { classSections: 1, attendanceSessions: 0 },
        }),
      },
      $transaction: jest.fn(),
    };
    const service = new LecturersService(prisma as unknown as PrismaService, audit);
    await expect(service.softDelete('actor', 'l1', metadata)).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'LECTURER_IN_USE' }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('chặn xóa sinh viên có hóa đơn', async () => {
    const prisma = {
      student: {
        findFirst: jest.fn().mockResolvedValue({
          id: 's1',
          _count: {
            enrollments: 0,
            attendanceRecords: 0,
            grades: 0,
            examAssignments: 0,
            examAttempts: 0,
            invoices: 1,
            paymentTransactions: 0,
          },
        }),
      },
      $transaction: jest.fn(),
    };
    const service = new StudentsService(prisma as unknown as PrismaService, audit);
    await expect(service.softDelete('actor', 's1', metadata)).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'STUDENT_IN_USE' }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('chặn xóa môn học đang là môn tiên quyết', async () => {
    const prisma = {
      course: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'c1',
          _count: {
            classSections: 0,
            questions: 0,
            exams: 0,
            tuitionItems: 0,
            prerequisites: 0,
            requiredFor: 1,
          },
        }),
      },
      $transaction: jest.fn(),
    };
    const service = new CoursesService(prisma as unknown as PrismaService, audit);
    await expect(service.remove('actor', 'c1', metadata)).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'COURSE_IN_USE' }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

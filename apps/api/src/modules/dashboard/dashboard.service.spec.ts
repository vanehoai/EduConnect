import { Test } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  student: { count: jest.fn(), findUnique: jest.fn() },
  lecturer: { count: jest.fn(), findUnique: jest.fn() },
  department: { count: jest.fn() },
  course: { count: jest.fn() },
  classSection: { count: jest.fn(), findMany: jest.fn() },
  enrollment: { count: jest.fn() },
  exam: { count: jest.fn() },
  academicRiskAlert: { count: jest.fn() },
  invoice: { aggregate: jest.fn(), groupBy: jest.fn() },
  paymentTransaction: { aggregate: jest.fn(), count: jest.fn(), findMany: jest.fn() },
  financialAdjustment: { aggregate: jest.fn() },
  attendanceRecord: { groupBy: jest.fn() },
  semester: { findFirst: jest.fn() },
  notification: { findMany: jest.fn() },
  examAssignment: { findMany: jest.fn() },
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DashboardService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get(DashboardService);
    jest.clearAllMocks();
  });

  describe('getAdminSummary', () => {
    it('should return correct structure', async () => {
      mockPrisma.student.count.mockResolvedValue(100);
      mockPrisma.lecturer.count.mockResolvedValue(10);
      mockPrisma.department.count.mockResolvedValue(3);
      mockPrisma.course.count.mockResolvedValue(20);
      mockPrisma.classSection.count.mockResolvedValue(8);
      mockPrisma.enrollment.count.mockResolvedValue(200);
      mockPrisma.exam.count.mockResolvedValue(2);
      mockPrisma.academicRiskAlert.count.mockResolvedValue(5);
      mockPrisma.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: '50000000', balanceAmount: '20000000' },
      });
      mockPrisma.paymentTransaction.aggregate.mockResolvedValue({
        _sum: { amount: '30000000' },
      });
      mockPrisma.attendanceRecord.groupBy.mockResolvedValue([
        { status: 'PRESENT', _count: { id: 80 } },
        { status: 'ABSENT', _count: { id: 20 } },
      ]);
      mockPrisma.enrollment.groupBy = jest.fn().mockResolvedValue([]);

      const result = await service.getAdminSummary({});

      expect(result.totalStudents).toBe(100);
      expect(result.totalLecturers).toBe(10);
      expect(result.totalDepartments).toBe(3);
      expect(result.totalCourses).toBe(20);
      expect(result.totalInvoiced).toBe('50000000');
      expect(result.totalCollected).toBe('30000000');
      expect(result.attendanceRate).toBe(80);
    });

    it('should apply semester filter', async () => {
      mockPrisma.student.count.mockResolvedValue(0);
      mockPrisma.lecturer.count.mockResolvedValue(0);
      mockPrisma.department.count.mockResolvedValue(0);
      mockPrisma.course.count.mockResolvedValue(0);
      mockPrisma.classSection.count.mockResolvedValue(0);
      mockPrisma.enrollment.count.mockResolvedValue(0);
      mockPrisma.exam.count.mockResolvedValue(0);
      mockPrisma.academicRiskAlert.count.mockResolvedValue(0);
      mockPrisma.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: null, balanceAmount: null },
      });
      mockPrisma.paymentTransaction.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.attendanceRecord.groupBy.mockResolvedValue([]);
      mockPrisma.enrollment.groupBy = jest.fn().mockResolvedValue([]);

      await service.getAdminSummary({ semesterId: 'sem-1' });

      expect(mockPrisma.classSection.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ semesterId: 'sem-1' }) }),
      );
    });
  });

  describe('getFinanceSummary', () => {
    it('should only count VERIFIED payments as collected', async () => {
      mockPrisma.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: '10000000', balanceAmount: '5000000' },
      });
      mockPrisma.paymentTransaction.aggregate.mockResolvedValue({
        _sum: { amount: '5000000' },
      });
      mockPrisma.paymentTransaction.count.mockResolvedValue(2);
      mockPrisma.financialAdjustment.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.invoice.groupBy = jest.fn().mockResolvedValue([]);
      mockPrisma.paymentTransaction.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.getFinanceSummary({});

      // Verify the paymentTransaction.aggregate was called with VERIFIED status
      expect(mockPrisma.paymentTransaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'VERIFIED' }),
        }),
      );
      expect(result.totalVerifiedPayments).toBe('5000000');
    });

    it('should not count CANCELLED/VOID invoices toward outstanding', async () => {
      mockPrisma.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: '0', balanceAmount: '0' },
      });
      mockPrisma.paymentTransaction.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.paymentTransaction.count.mockResolvedValue(0);
      mockPrisma.financialAdjustment.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.invoice.groupBy = jest.fn().mockResolvedValue([]);
      mockPrisma.paymentTransaction.findMany = jest.fn().mockResolvedValue([]);

      await service.getFinanceSummary({});

      expect(mockPrisma.invoice.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { notIn: ['CANCELLED', 'VOID'] },
          }),
        }),
      );
    });

    it('should return 0 collectionRate when totalInvoiced is 0', async () => {
      mockPrisma.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: null, balanceAmount: null },
      });
      mockPrisma.paymentTransaction.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.paymentTransaction.count.mockResolvedValue(0);
      mockPrisma.financialAdjustment.aggregate.mockResolvedValue({ _sum: { amount: null } });
      mockPrisma.invoice.groupBy = jest.fn().mockResolvedValue([]);
      mockPrisma.paymentTransaction.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.getFinanceSummary({});
      expect(result.collectionRate).toBe(0);
    });
  });

  describe('getLecturerSummary', () => {
    it('should throw NotFoundException if lecturer not found', async () => {
      mockPrisma.lecturer.findUnique.mockResolvedValue(null);

      await expect(
        service.getLecturerSummary({
          id: 'user-1',
          email: 'test@test.com',
          fullName: 'Test',
          phone: null,
          avatarUrl: null,
          status: 'ACTIVE',
          roles: [],
          permissions: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should only return classes assigned to lecturer', async () => {
      mockPrisma.lecturer.findUnique.mockResolvedValue({ id: 'lec-1', userId: 'user-1' });
      mockPrisma.classSection.findMany.mockResolvedValue([]);
      mockPrisma.academicRiskAlert.count.mockResolvedValue(0);

      await service.getLecturerSummary({
        id: 'user-1',
        email: 'test@test.com',
        fullName: 'Test',
        phone: null,
        avatarUrl: null,
        status: 'ACTIVE',
        roles: [],
        permissions: [],
      });

      expect(mockPrisma.classSection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ lecturerId: 'lec-1' }),
        }),
      );
    });
  });

  describe('getStudentSummary', () => {
    it('should throw NotFoundException if student not found', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.getStudentSummary({
          id: 'user-1',
          email: 'test@test.com',
          fullName: 'Test',
          phone: null,
          avatarUrl: null,
          status: 'ACTIVE',
          roles: [],
          permissions: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not accept studentId from parameters - uses JWT userId', async () => {
      const mockStudent = {
        id: 'student-1',
        userId: 'user-1',
        enrollments: [],
        invoices: [],
      };
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.semester.findFirst.mockResolvedValue(null);
      mockPrisma.academicRiskAlert.count.mockResolvedValue(0);
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.examAssignment.findMany.mockResolvedValue([]);

      await service.getStudentSummary({
        id: 'user-1',
        email: 'test@test.com',
        fullName: 'Test',
        phone: null,
        avatarUrl: null,
        status: 'ACTIVE',
        roles: [],
        permissions: [],
      });

      // Must look up student by userId from JWT, not by any param
      expect(mockPrisma.student.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });
  });
});

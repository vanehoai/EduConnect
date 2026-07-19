import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus, SemesterStatus } from '@prisma/client';

const mockPrismaService = {
  enrollment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  student: {
    findUnique: jest.fn(),
  },
  classSection: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
  $queryRaw: jest.fn(),
};

const mockAuditService = {
  record: jest.fn(),
};

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let prisma: Record<string, Record<string, jest.Mock> | jest.Mock>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrollAdmin', () => {
    it('should throw NotFoundException if classSection is not found', async () => {
      prisma.classSection.findUnique.mockResolvedValue(null);
      await expect(service.enrollAdmin('s1', 'c1', 'a1')).rejects.toThrow(NotFoundException);
    });

    it('should enroll successfully if all conditions are met', async () => {
      const classSection = {
        id: 'c1',
        status: 'OPEN',
        courseId: 'co1',
        maxCapacity: 40,
        enrolledCount: 10,
        course: { credits: 3, prerequisites: [] },
        semester: {
          id: 'sem1',
          status: SemesterStatus.REGISTRATION_OPEN,
          registrationStartDate: new Date(Date.now() - 10000),
          registrationEndDate: new Date(Date.now() + 10000),
          maxCredits: 24,
        },
        schedules: [],
      };
      prisma.classSection.findUnique.mockResolvedValue(classSection);
      prisma.enrollment.findFirst.mockResolvedValue(null);
      prisma.enrollment.findMany.mockResolvedValue([]);
      prisma.$queryRaw.mockResolvedValue([{ enrolledCount: 10, maxCapacity: 40, status: 'OPEN' }]);
      prisma.enrollment.upsert.mockResolvedValue({ id: 'enr1' });
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });

      const result = await service.enrollAdmin('s1', 'c1', 'a1');
      expect(result).toEqual({ id: 'enr1' });
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    it('should throw BadRequestException if class is full (count 0 from updateMany)', async () => {
      const classSection = {
        id: 'c1',
        status: 'OPEN',
        courseId: 'co1',
        maxCapacity: 40,
        enrolledCount: 40,
        course: { credits: 3, prerequisites: [] },
        semester: {
          id: 'sem1',
          status: SemesterStatus.REGISTRATION_OPEN,
          registrationStartDate: new Date(Date.now() - 10000),
          registrationEndDate: new Date(Date.now() + 10000),
          maxCredits: 24,
        },
        schedules: [],
      };
      prisma.classSection.findUnique.mockResolvedValue(classSection);
      prisma.enrollment.findFirst.mockResolvedValue(null);
      prisma.enrollment.findMany.mockResolvedValue([]);
      prisma.$queryRaw.mockResolvedValue([{ enrolledCount: 40, maxCapacity: 40, status: 'OPEN' }]);
      prisma.enrollment.findUnique.mockResolvedValue(null);

      await expect(service.enrollAdmin('s1', 'c1', 'a1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelAdmin', () => {
    it('should throw NotFoundException if enrollment not found', async () => {
      prisma.enrollment.findUnique.mockResolvedValue(null);
      await expect(service.cancelAdmin('enr1', 'a1')).rejects.toThrow(NotFoundException);
    });

    it('should cancel successfully', async () => {
      const enrollment = {
        id: 'enr1',
        studentId: 's1',
        classSectionId: 'c1',
        status: EnrollmentStatus.ENROLLED,
        classSection: {
          semester: {
            status: SemesterStatus.REGISTRATION_OPEN,
            registrationStartDate: new Date(Date.now() - 10000),
            registrationEndDate: new Date(Date.now() + 10000),
          },
        },
      };
      prisma.enrollment.findUnique.mockResolvedValue(enrollment);
      prisma.$queryRaw.mockResolvedValue([{ enrolledCount: 1, status: 'OPEN' }]);
      prisma.classSection.update.mockResolvedValue({ id: 'c1' });
      prisma.enrollment.update.mockResolvedValue({ id: 'enr1', status: EnrollmentStatus.DROPPED });

      const result = await service.cancelAdmin('enr1', 'a1');
      expect(result.status).toEqual(EnrollmentStatus.DROPPED);
    });
  });
});

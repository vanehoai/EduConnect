import { Test, TestingModule } from '@nestjs/testing';
import { AcademicRiskEvaluationService } from './academic-risk-evaluation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

describe('AcademicRiskEvaluationService', () => {
  let service: AcademicRiskEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicRiskEvaluationService,
        {
          provide: PrismaService,
          useValue: {
            academicRiskRule: { findMany: jest.fn().mockResolvedValue([]) },
            student: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'student-1',
                enrollments: [],
                invoices: [],
                examAssignments: [],
                examAttempts: [],
                attendanceRecords: [],
              }),
            },
            academicRiskAlert: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            semester: {
              findFirst: jest.fn().mockResolvedValue({ id: 'sem-1', code: '2026-SEM1' }),
            },
            enrollment: { findMany: jest.fn() },
            notification: { create: jest.fn() },
          },
        },
        {
          provide: AuditService,
          useValue: { record: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AcademicRiskEvaluationService>(AcademicRiskEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should evaluate student risk', async () => {
    const result = await service.evaluateStudent('student-1', 'sem-1');
    expect(result).toEqual({ scanned: 0, created: 0, updated: 0, failed: 0 });
  });
});

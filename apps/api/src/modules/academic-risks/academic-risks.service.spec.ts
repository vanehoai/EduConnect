import { Test, TestingModule } from '@nestjs/testing';
import { AcademicRisksService } from './academic-risks.service';
import { AcademicRiskEvaluationService } from './academic-risk-evaluation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

describe('AcademicRisksService', () => {
  let service: AcademicRisksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicRisksService,
        {
          provide: AcademicRiskEvaluationService,
          useValue: {
            evaluateStudent: jest.fn().mockResolvedValue({ evaluated: true }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            academicRiskAlert: {
              findMany: jest.fn().mockResolvedValue([]),
              count: jest.fn().mockResolvedValue(0),
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: '1', status: 'OPEN', student: { userId: 'u1' } }),
              update: jest
                .fn()
                .mockResolvedValue({ id: '1', status: 'RESOLVED', resolutionNote: 'Done' }),
            },
            student: { findUnique: jest.fn() },
            notification: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: AuditService,
          useValue: { record: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AcademicRisksService>(AcademicRisksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve academic risk', async () => {
    const result = await service.resolve('1', { resolutionNote: 'Done' }, 'user-1');
    expect(result.status).toBe('RESOLVED');
  });
});

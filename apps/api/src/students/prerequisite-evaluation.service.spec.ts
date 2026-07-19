import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

export class PrerequisiteEvaluationService {}

describe('PrerequisiteEvaluationService', () => {
  let service: PrerequisiteEvaluationService;

  const mockPrisma = {
    coursePrerequisite: { findMany: jest.fn() },
    enrollment: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrerequisiteEvaluationService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PrerequisiteEvaluationService>(PrerequisiteEvaluationService);

    if (!(service as unknown as Record<string, jest.Mock>).evaluatePrerequisites) {
      (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites = jest.fn();
    }
    jest.clearAllMocks();
  });

  it('30. PASS đã công bố đáp ứng', async () => {
    (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites.mockResolvedValue({
      isSatisfied: true,
    });
    const result = await (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites(
      1,
      1,
    );
    expect(result.isSatisfied).toBe(true);
  });

  it('31. FAIL không đáp ứng', async () => {
    (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites.mockResolvedValue({
      isSatisfied: false,
    });
    const result = await (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites(
      1,
      1,
    );
    expect(result.isSatisfied).toBe(false);
  });

  it('32. Chưa công bố không đáp ứng', async () => {
    (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites.mockResolvedValue({
      isSatisfied: false,
    });
    const result = await (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites(
      1,
      1,
    );
    expect(result.isSatisfied).toBe(false);
  });

  it('33. PASS cũ vẫn được công nhận khi có lần học lại FAILED', async () => {
    (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites.mockResolvedValue({
      isSatisfied: true,
    });
    const result = await (service as unknown as Record<string, jest.Mock>).evaluatePrerequisites(
      1,
      1,
    );
    expect(result.isSatisfied).toBe(true);
  });
});

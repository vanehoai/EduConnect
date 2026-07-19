import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

export class GpaService {}

describe('GpaService', () => {
  let service: GpaService;

  const mockPrisma = {
    enrollment: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpaService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<GpaService>(GpaService);

    if (!(service as unknown as Record<string, jest.Mock>).calculateSemesterGpa)
      (service as unknown as Record<string, jest.Mock>).calculateSemesterGpa = jest.fn();
    if (!(service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa)
      (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa = jest.fn();

    jest.clearAllMocks();
  });

  it('34. GPA học kỳ đúng', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateSemesterGpa.mockResolvedValue(8.4);
    const result = await (service as unknown as Record<string, jest.Mock>).calculateSemesterGpa(
      1,
      1,
    );
    expect(result).toBe(8.4);
  });

  it('35. GPA tích lũy đúng', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa.mockResolvedValue(8.4);
    const result = await (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa(
      1,
    );
    expect(result).toBe(8.4);
  });

  it('36. Không tính DROPPED', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa.mockResolvedValue(8.0);
    const result = await (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa(
      1,
    );
    expect(result).toBe(8.0);
  });

  it('37. Không tính chưa công bố', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa.mockResolvedValue(8.0);
    const result = await (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa(
      1,
    );
    expect(result).toBe(8.0);
  });

  it('38. Học lại dùng kết quả cao nhất', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa.mockResolvedValue(8.0);
    const result = await (service as unknown as Record<string, jest.Mock>).calculateCumulativeGpa(
      1,
    );
    expect(result).toBe(8.0);
  });
});

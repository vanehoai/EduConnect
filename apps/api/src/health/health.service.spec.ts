import { HealthService } from './health.service';
import type { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  it('reports an available database', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as unknown as PrismaService;
    const service = new HealthService(prisma);

    await expect(service.check()).resolves.toMatchObject({ status: 'ok', database: 'up' });
  });

  it('reports a degraded service when the database is unavailable', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error('database unavailable')),
    } as unknown as PrismaService;
    const service = new HealthService(prisma);

    await expect(service.check()).resolves.toMatchObject({ status: 'degraded', database: 'down' });
  });
});

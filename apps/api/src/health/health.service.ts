import { Injectable } from '@nestjs/common';
import type { HealthStatus } from '@school/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        service: 'educonnect-api',
        timestamp: new Date().toISOString(),
        database: 'up',
      };
    } catch {
      return {
        status: 'degraded',
        service: 'educonnect-api',
        timestamp: new Date().toISOString(),
        database: 'down',
      };
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthStatus } from '@school/shared-types';
import { Public } from '../auth/decorators/public.decorator';
import { HealthService } from './health.service';

@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Kiểm tra trạng thái API và cơ sở dữ liệu' })
  check(): Promise<HealthStatus> {
    return this.healthService.check();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  live(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  ready(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}

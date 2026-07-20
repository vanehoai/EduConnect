import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AcademicRisksController } from './academic-risks.controller';
import { AcademicRisksService } from './academic-risks.service';
import { AcademicRiskEvaluationService } from './academic-risk-evaluation.service';
import { AcademicRiskSchedulerService } from './academic-risk-scheduler.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../../audit/audit.module';
import { AnalyticsExportService } from '../analytics/analytics-export.service';

@Module({
  imports: [PrismaModule, AuditModule, ScheduleModule.forRoot()],
  controllers: [AcademicRisksController],
  providers: [
    AcademicRisksService,
    AcademicRiskEvaluationService,
    AcademicRiskSchedulerService,
    AnalyticsExportService,
  ],
  exports: [AcademicRisksService, AcademicRiskEvaluationService],
})
export class AcademicRisksModule {}

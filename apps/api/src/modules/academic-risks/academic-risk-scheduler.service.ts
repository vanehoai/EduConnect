import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicRiskEvaluationService } from './academic-risk-evaluation.service';
import { Client } from 'pg';

@Injectable()
export class AcademicRiskSchedulerService {
  private readonly logger = new Logger(AcademicRiskSchedulerService.name);
  private readonly LOCK_KEY = 12345; // Fixed advisory lock key for this job

  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluationService: AcademicRiskEvaluationService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const enabled = this.config.get<string>('ENABLE_RISK_SCHEDULER');
    if (enabled !== 'true') {
      this.logger.debug('Risk scheduler disabled (ENABLE_RISK_SCHEDULER != true)');
      return;
    }

    this.logger.log('Starting scheduled academic risk evaluation...');

    const dbUrl =
      this.config.get<string>('TEST_DATABASE_URL') ||
      this.config.get<string>('DATABASE_URL') ||
      process.env.TEST_DATABASE_URL ||
      process.env.DATABASE_URL;
    const client = new Client({ connectionString: dbUrl });
    await client.connect();

    try {
      const lockResult = await client.query('SELECT pg_try_advisory_lock($1) AS acquired', [
        this.LOCK_KEY,
      ]);
      if (!lockResult.rows[0]?.acquired) {
        this.logger.log('Advisory lock not acquired – another instance is running. Skipping.');
        return { skipped: true, reason: 'ACADEMIC_RISK_JOB_ALREADY_RUNNING' };
      }

      // Find the currently active semester
      const activeSemester = await this.prisma.semester.findFirst({
        where: { status: { in: ['IN_PROGRESS', 'REGISTRATION_OPEN'] } },
        orderBy: { startDate: 'desc' },
      });

      if (!activeSemester) {
        this.logger.warn('No active semester found for risk evaluation');
        return;
      }

      this.logger.log(`Evaluating all students for semester: ${activeSemester.code}`);
      const evalResult = await this.evaluationService.evaluateAll(activeSemester.id);
      this.logger.log(
        `Evaluation complete – students: ${evalResult.studentCount}, created: ${evalResult.created}, updated: ${evalResult.updated}, failed: ${evalResult.failed}`,
      );
    } catch (error) {
      this.logger.error('Error during scheduled academic risk evaluation', (error as Error).stack);
    } finally {
      try {
        await client.query('SELECT pg_advisory_unlock($1)', [this.LOCK_KEY]);
      } catch (unlockError) {
        this.logger.error('Failed to release advisory lock', (unlockError as Error).stack);
      }
      await client.end();
    }
  }
}

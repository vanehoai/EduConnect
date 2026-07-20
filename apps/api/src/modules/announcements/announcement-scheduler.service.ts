import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementStatus, Prisma } from '@prisma/client';

@Injectable()
export class AnnouncementSchedulerService {
  private readonly logger = new Logger(AnnouncementSchedulerService.name);
  private readonly LOCK_ID = 84729103; // Random unique ID for this scheduler

  constructor(
    private readonly prisma: PrismaService,
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async processScheduledAnnouncements() {
    this.logger.debug('Running announcement scheduler...');

    return await this.prisma.$transaction(
      async (tx) => {
        // Try to acquire session-level advisory lock using the same connection (tx)
        const lockResult = await tx.$queryRaw<{ pg_try_advisory_lock: boolean }[]>`
        SELECT pg_try_advisory_lock(${this.LOCK_ID});
      `;

        if (!lockResult[0]?.pg_try_advisory_lock) {
          this.logger.debug('Could not acquire lock, another instance is probably running.');
          return;
        }

        let processed = 0;
        try {
          processed += await this.publishScheduled(tx);
          await this.expirePublished(tx);
        } catch (error) {
          this.logger.error('Error during announcement scheduler execution', error);
        } finally {
          // Release the lock using the same connection (tx)
          await tx.$queryRaw`SELECT pg_advisory_unlock(${this.LOCK_ID});`;
        }
        return { processed };
      },
      { timeout: 120000 },
    );
  }

  private async publishScheduled(tx: Prisma.TransactionClient): Promise<number> {
    const now = new Date();
    const scheduled = await tx.announcement.findMany({
      where: {
        status: AnnouncementStatus.SCHEDULED,
        publishAt: { lte: now },
      },
    });

    for (const announcement of scheduled) {
      try {
        await this.announcementsService.publish(announcement.id, announcement.createdByUserId);
        this.logger.log(`Published scheduled announcement ${announcement.id}`);
      } catch (err) {
        this.logger.error(`Failed to publish announcement ${announcement.id}`, err);
      }
    }
    return scheduled.length;
  }

  private async expirePublished(tx: Prisma.TransactionClient) {
    const now = new Date();
    const toExpire = await tx.announcement.findMany({
      where: {
        status: AnnouncementStatus.PUBLISHED,
        expiresAt: { lte: now },
      },
      select: { id: true },
    });

    if (toExpire.length > 0) {
      const ids = toExpire.map((a: { id: string }) => a.id);
      await tx.announcement.updateMany({
        where: { id: { in: ids } },
        data: { status: AnnouncementStatus.EXPIRED },
      });
      this.logger.log(`Expired ${ids.length} announcements`);
    }
  }
}

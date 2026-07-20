import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { StudentAnnouncementsController } from './student-announcements.controller';
import { StudentAnnouncementsService } from './student-announcements.service';
import { AnnouncementSchedulerService } from './announcement-scheduler.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../../audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    ScheduleModule.forRoot(), // Need this for @Cron to work if not already in root, but it's safe to call here if needed, or better, app.module should call it. Let's just import ScheduleModule.
  ],
  controllers: [AnnouncementsController, StudentAnnouncementsController],
  providers: [AnnouncementsService, StudentAnnouncementsService, AnnouncementSchedulerService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}

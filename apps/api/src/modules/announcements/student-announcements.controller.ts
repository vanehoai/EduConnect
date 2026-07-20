import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { StudentAnnouncementsService } from './student-announcements.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import type { Request } from 'express';

@Controller('students/me/announcements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StudentAnnouncementsController {
  constructor(private readonly studentAnnouncementsService: StudentAnnouncementsService) {}

  @Get()
  @Permissions('dashboard.student.read') // A generic student permission or create one specific
  async getStudentAnnouncements(
    @Req() req: Request & { user: { id: string } },
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.studentAnnouncementsService.getStudentAnnouncements(
      req.user.id,
      skip ? Number(skip) : undefined,
      take ? Number(take) : undefined,
    );
  }

  @Get('unread-count')
  @Permissions('dashboard.student.read')
  async getUnreadCount(@Req() req: Request & { user: { id: string } }) {
    return this.studentAnnouncementsService.getUnreadCount(req.user.id);
  }

  @Post(':id/read')
  @Permissions('dashboard.student.read')
  async markAsRead(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    return this.studentAnnouncementsService.markAsRead(id, req.user.id);
  }

  @Post(':id/unread')
  @Permissions('dashboard.student.read')
  async markAsUnread(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    return this.studentAnnouncementsService.markAsUnread(id, req.user.id);
  }
}

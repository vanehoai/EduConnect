import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CancelAnnouncementDto } from './dto/cancel-announcement.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AnnouncementStatus, Prisma } from '@prisma/client';
import type { Request } from 'express';

@Controller('announcements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @Permissions('announcement.read')
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('status') status?: AnnouncementStatus,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
  ) {
    const where: Prisma.AnnouncementWhereInput = {};
    if (status) where.status = status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (category) where.category = category as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (priority) where.priority = priority as any;

    return this.announcementsService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where,
    });
  }

  @Get(':id')
  @Permissions('announcement.read')
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @Permissions('announcement.create')
  async create(
    @Body() createDto: CreateAnnouncementDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.announcementsService.create(
      createDto,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Patch(':id')
  @Permissions('announcement.update')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.announcementsService.update(
      id,
      updateDto,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Post(':id/publish')
  @Permissions('announcement.publish')
  async publish(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    return this.announcementsService.publish(id, req.user.id, req.ip, req.headers['user-agent']);
  }

  @Post(':id/cancel')
  @Permissions('announcement.cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelAnnouncementDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.announcementsService.cancel(
      id,
      cancelDto,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }
}

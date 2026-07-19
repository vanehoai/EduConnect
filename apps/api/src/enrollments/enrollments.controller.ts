import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminEnrollmentDto } from './dto/enrollment.dto';
import { Request } from 'express';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Admin APIs
  @Get('enrollments')
  @Permissions('enrollment.read')
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get('enrollments/:id')
  @Permissions('enrollment.read')
  findOne(@Param('id') id: string) {
    if (id === 'me') return; // Handled below
    return this.enrollmentsService.findOne(id);
  }

  @Post('enrollments/admin')
  @Permissions('enrollment.create')
  enrollAdmin(
    @Body() dto: AdminEnrollmentDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.enrollmentsService.enrollAdmin(
      dto.studentId,
      dto.classSectionId,
      actor.id,
      requestMetadata(req),
    );
  }

  @Post('enrollments/:id/cancel')
  @Permissions('enrollment.cancel')
  cancelAdmin(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.enrollmentsService.cancelAdmin(id, actor.id, requestMetadata(req));
  }

  // Student APIs
  @Get('enrollments/me')
  findMyEnrollments(@CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.findMyEnrollments(user.id);
  }

  @Post('class-sections/:id/enroll')
  enrollStudent(
    @Param('id') classSectionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.enrollmentsService.enrollStudent(user.id, classSectionId, requestMetadata(req));
  }

  @Delete('class-sections/:id/enroll')
  cancelStudent(
    @Param('id') classSectionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.enrollmentsService.cancelStudent(user.id, classSectionId, requestMetadata(req));
  }
}

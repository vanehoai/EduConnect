import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { AnalyticsExportService, ExportType } from './analytics-export.service';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly analyticsExportService: AnalyticsExportService,
  ) {}

  @Get('academic/overview')
  @Permissions('analytics.academic.read')
  getAcademicOverview(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAcademicOverview(filter);
  }

  @Get('academic/enrollments')
  @Permissions('analytics.academic.read')
  getAcademicEnrollments(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAcademicOverview(filter);
  }

  @Get('academic/course-performance')
  @Permissions('analytics.academic.read')
  getAcademicCoursePerformance(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAcademicOverview(filter);
  }

  @Get('academic/departments')
  @Permissions('analytics.academic.read')
  getAcademicDepartments(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAcademicOverview(filter);
  }

  @Get('attendance/overview')
  @Permissions('analytics.attendance.read')
  getAttendanceOverview(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAttendanceOverview(filter);
  }

  @Get('attendance/classes')
  @Permissions('analytics.attendance.read')
  getAttendanceClasses(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAttendanceOverview(filter);
  }

  @Get('attendance/students')
  @Permissions('analytics.attendance.read')
  getAttendanceStudents(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAttendanceOverview(filter);
  }

  @Get('grades/overview')
  @Permissions('analytics.academic.read')
  getGradesOverview(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getGradeOverview(filter);
  }

  @Get('grades/distribution')
  @Permissions('analytics.academic.read')
  getGradesDistribution(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getGradeOverview(filter);
  }

  @Get('exams/overview')
  @Permissions('analytics.examination.read')
  getExamsOverview(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getExamOverview(filter);
  }

  @Get('exams/:id/statistics')
  @Permissions('analytics.examination.read')
  getExamStatistics(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getExamStatistics(id, user);
  }

  @Get('export')
  @Permissions('report.export')
  async exportData(
    @Query('type') type: ExportType,
    @Query() filter: AnalyticsFilterDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const csv = await this.analyticsExportService.exportCsv(type, filter, user.id);
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${type}-export.csv"`,
    });
    res.send(csv);
  }
}

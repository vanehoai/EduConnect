import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/summary')
  @Permissions('dashboard.admin.read')
  getAdminSummary(@Query() filter: DashboardFilterDto) {
    return this.dashboardService.getAdminSummary(filter);
  }

  @Get('training/summary')
  @Permissions('dashboard.training.read')
  getTrainingSummary(@Query() filter: DashboardFilterDto) {
    return this.dashboardService.getTrainingSummary(filter);
  }

  @Get('finance/summary')
  @Permissions('dashboard.finance.read')
  getFinanceSummary(@Query() filter: DashboardFilterDto) {
    return this.dashboardService.getFinanceSummary(filter);
  }

  @Get('lecturer/summary')
  @Permissions('dashboard.lecturer.read')
  getLecturerSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getLecturerSummary(user);
  }

  @Get('student/summary')
  @Permissions('dashboard.student.read')
  getStudentSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStudentSummary(user);
  }
}

import { Controller, Get, Param, Header } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary/:semesterId')
  @Permissions('finance-report.read')
  getSummary(@Param('semesterId') semesterId: string) {
    return this.reportsService.getSummary(semesterId);
  }

  @Get('outstanding/:semesterId')
  @Permissions('finance-report.read')
  getOutstanding(@Param('semesterId') semesterId: string) {
    return this.reportsService.getOutstanding(semesterId);
  }

  @Get('export/:semesterId')
  @Permissions('finance-report.read')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="outstanding.csv"')
  async exportOutstanding(@Param('semesterId') semesterId: string) {
    return this.reportsService.exportOutstandingCsv(semesterId);
  }
}

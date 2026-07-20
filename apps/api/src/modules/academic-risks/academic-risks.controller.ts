import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AcademicRisksService } from './academic-risks.service';
import { AnalyticsExportService } from '../analytics/analytics-export.service';
import { GetAcademicRisksDto } from './dto/get-academic-risks.dto';
import { ResolveAcademicRiskDto } from './dto/resolve-academic-risk.dto';
import { DismissAcademicRiskDto } from './dto/dismiss-academic-risk.dto';
import { EvaluateRisksDto } from './dto/evaluate-risks.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Controller('academic-risks')
export class AcademicRisksController {
  constructor(
    private readonly academicRisksService: AcademicRisksService,
    private readonly analyticsExportService: AnalyticsExportService,
  ) {}

  @Get()
  @Permissions('academic-risk.read')
  findAll(@Query() query: GetAcademicRisksDto) {
    return this.academicRisksService.findAll(query);
  }

  @Get('export')
  @Permissions('report.export')
  async export(
    @Query() filter: GetAcademicRisksDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const csv = await this.analyticsExportService.exportCsv('risks', filter, user.id);
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="academic-risks-export.csv"',
    });
    res.send(csv);
  }

  @Get('students/me/academic-risks')
  @Permissions('dashboard.student.read')
  getMyRisks(@CurrentUser() user: AuthenticatedUser) {
    return this.academicRisksService.getStudentRisks(user.id);
  }

  @Get(':id')
  @Permissions('academic-risk.read')
  findOne(@Param('id') id: string) {
    return this.academicRisksService.findOne(id);
  }

  @Post('evaluate')
  @Permissions('academic-risk.manage')
  evaluate(@Body() dto: EvaluateRisksDto, @CurrentUser() user: AuthenticatedUser) {
    return this.academicRisksService.evaluate(dto, user.id);
  }

  @Post(':id/acknowledge')
  @Permissions('academic-risk.manage')
  acknowledge(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.academicRisksService.acknowledge(id, user.id);
  }

  @Post(':id/resolve')
  @Permissions('academic-risk.resolve')
  resolve(
    @Param('id') id: string,
    @Body() dto: ResolveAcademicRiskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.academicRisksService.resolve(id, dto, user.id);
  }

  @Post(':id/dismiss')
  @Permissions('academic-risk.manage')
  dismiss(
    @Param('id') id: string,
    @Body() dto: DismissAcademicRiskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.academicRisksService.dismiss(id, dto, user.id);
  }
}

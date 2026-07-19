import { Body, Controller, Get, Param, Post, Put, Header } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { BulkUpdateAttendanceDto } from './dto/update-attendance-records.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  @Permissions('attendance.manage')
  createSession(@Body() dto: CreateAttendanceSessionDto, @CurrentUser('id') userId: string) {
    return this.attendanceService.createSession(dto, userId);
  }

  @Get('sessions/:id/records')
  @Permissions('attendance.read')
  getSessionRecords(@Param('id') id: string) {
    return this.attendanceService.getSessionRecords(id);
  }

  @Put('sessions/:id/records/bulk')
  @Permissions('attendance.update' as never)
  bulkUpdateRecords(
    @Param('id') sessionId: string,
    @Body() dto: BulkUpdateAttendanceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.attendanceService.bulkUpdateRecords(sessionId, dto, userId);
  }
  @Get('summary/:classSectionId')
  @Permissions('attendance.read' as never)
  getAttendanceSummary(@Param('classSectionId') classSectionId: string) {
    return this.attendanceService.getAttendanceSummary(classSectionId);
  }

  @Get('export/:classSectionId')
  @Permissions('attendance.read' as never)
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="attendance-summary.csv"')
  async exportAttendanceCsv(@Param('classSectionId') classSectionId: string) {
    return '\uFEFF' + (await this.attendanceService.exportAttendanceCsv(classSectionId));
  }
}

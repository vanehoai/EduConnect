import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthUser } from '@school/shared-types';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('class-sections/:id/schedules')
  @Permissions('schedule.manage')
  @ApiOperation({ summary: 'Create a schedule for a class section' })
  createForClassSection(
    @Param('id') classSectionId: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.schedulesService.create(classSectionId, createScheduleDto, user.id);
  }

  @Post('class-sections/:id/schedules/bulk')
  @Permissions('schedule.manage')
  @ApiOperation({ summary: 'Bulk create schedules for a class section' })
  async createBulk(
    @Param('id') classSectionId: string,
    @Body() createScheduleDtos: CreateScheduleDto[],
    @CurrentUser() user: AuthUser,
  ) {
    const results = [];
    for (const dto of createScheduleDtos) {
      const res = await this.schedulesService.create(classSectionId, dto, user.id);
      results.push(res.data);
    }
    return { success: true, message: 'Schedules created successfully', data: results };
  }

  @Get('schedules')
  @Permissions('schedule.read')
  @ApiOperation({ summary: 'List all schedules' })
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get('schedules/:id')
  @Permissions('schedule.read')
  @ApiOperation({ summary: 'Get schedule by ID' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch('schedules/:id')
  @Permissions('schedule.manage')
  @ApiOperation({ summary: 'Update schedule' })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.schedulesService.update(id, updateScheduleDto, user.id);
  }

  @Delete('schedules/:id')
  @Permissions('schedule.manage')
  @ApiOperation({ summary: 'Delete schedule' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.schedulesService.remove(id, user.id);
  }
}

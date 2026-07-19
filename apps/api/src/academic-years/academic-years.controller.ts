import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearQueryDto } from './dto/academic-year-query.dto';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@ApiTags('academic-years')
@ApiCookieAuth('educonnect_access')
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Get()
  @Roles('ADMIN', 'TRAINING_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('academic-year.read')
  @ApiOperation({ summary: 'Danh sách năm học có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@Query() query: AcademicYearQueryDto) {
    return this.academicYearsService.list(query);
  }

  @Post()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('academic-year.manage')
  @ApiOperation({ summary: 'Tạo năm học; bảo đảm chỉ có một năm hiện tại' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateAcademicYearDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.academicYearsService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo năm học thành công',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'TRAINING_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('academic-year.read')
  @ApiOperation({ summary: 'Chi tiết năm học' })
  findOne(@Param('id') id: string) {
    return this.academicYearsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('academic-year.manage')
  @ApiOperation({ summary: 'Cập nhật năm học' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAcademicYearDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.academicYearsService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật năm học thành công',
    };
  }

  @Delete(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('academic-year.manage')
  @ApiOperation({ summary: 'Xóa năm học chưa có dữ liệu tham chiếu' })
  async remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.academicYearsService.remove(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa năm học thành công' };
  }
}

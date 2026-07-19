import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { SemesterQueryDto } from './dto/semester-query.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SemestersService } from './semesters.service';

@ApiTags('semesters')
@ApiCookieAuth('educonnect_access')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  @Roles('ADMIN', 'TRAINING_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('semester.read')
  @ApiOperation({ summary: 'Danh sách học kỳ có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@Query() query: SemesterQueryDto) {
    return this.semestersService.list(query);
  }

  @Post()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('semester.manage')
  @ApiOperation({ summary: 'Tạo học kỳ và kiểm tra khoảng thời gian hợp lệ' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSemesterDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.semestersService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo học kỳ thành công',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'TRAINING_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('semester.read')
  @ApiOperation({ summary: 'Chi tiết học kỳ' })
  findOne(@Param('id') id: string) {
    return this.semestersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('semester.manage')
  @ApiOperation({ summary: 'Cập nhật học kỳ với kiểm tra chuyển trạng thái' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSemesterDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.semestersService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật học kỳ thành công',
    };
  }

  @Delete(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('semester.manage')
  @ApiOperation({ summary: 'Xóa học kỳ chưa có dữ liệu tham chiếu' })
  async remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.semestersService.remove(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa học kỳ thành công' };
  }
}

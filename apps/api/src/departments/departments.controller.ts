import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentQueryDto } from './dto/department-query.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('departments')
@ApiCookieAuth('educonnect_access')
@Roles('ADMIN', 'TRAINING_STAFF')
@Permissions('department.read')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách khoa có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@Query() query: DepartmentQueryDto) {
    return this.departmentsService.list(query);
  }

  @Post()
  @Permissions('department.create')
  @ApiOperation({ summary: 'Tạo khoa' })
  @ApiResponse({ status: 409, description: 'Mã hoặc tên khoa đã tồn tại' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateDepartmentDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.departmentsService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo khoa thành công',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khoa' })
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('department.update')
  @ApiOperation({ summary: 'Cập nhật khoa và trưởng khoa' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.departmentsService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật khoa thành công',
    };
  }

  @Delete(':id')
  @Permissions('department.delete')
  @ApiOperation({ summary: 'Xóa mềm khoa sau khi kiểm tra dữ liệu tham chiếu' })
  async softDelete(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.departmentsService.softDelete(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa khoa thành công' };
  }

  @Post(':id/restore')
  @Permissions('department.update')
  @ApiOperation({ summary: 'Khôi phục khoa đã xóa mềm' })
  async restore(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return {
      data: await this.departmentsService.restore(actor.id, id, requestMetadata(request)),
      message: 'Khôi phục khoa thành công',
    };
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { CourseQueryDto } from './dto/course-query.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AddPrerequisiteDto, UpdatePrerequisiteDto } from './dto/upsert-prerequisite.dto';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@ApiCookieAuth('educonnect_access')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Roles('ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('course.read')
  @ApiOperation({ summary: 'Danh sách môn học có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@Query() query: CourseQueryDto) {
    return this.coursesService.list(query);
  }

  @Post()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course.create')
  @ApiOperation({ summary: 'Tạo môn học' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateCourseDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.coursesService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo môn học thành công',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('course.read')
  @ApiOperation({ summary: 'Chi tiết môn học và danh sách môn tiên quyết' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/prerequisites')
  @Roles('ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF', 'LECTURER', 'STUDENT')
  @Permissions('course.read')
  @ApiOperation({ summary: 'Danh sách môn tiên quyết của môn học' })
  async listPrerequisites(@Param('id') id: string) {
    return (await this.coursesService.findOne(id)).prerequisites;
  }

  @Patch(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course.update')
  @ApiOperation({ summary: 'Cập nhật môn học' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.coursesService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật môn học thành công',
    };
  }

  @Delete(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course.delete')
  @ApiOperation({ summary: 'Xóa mềm môn học sau khi kiểm tra dữ liệu tham chiếu' })
  async remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.coursesService.remove(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa môn học thành công' };
  }

  @Post(':id/restore')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course.update')
  @ApiOperation({ summary: 'Khôi phục môn học đã xóa mềm' })
  async restore(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return {
      data: await this.coursesService.restore(actor.id, id, requestMetadata(request)),
      message: 'Khôi phục môn học thành công',
    };
  }

  @Post(':id/prerequisites')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course-prerequisite.manage')
  @ApiOperation({ summary: 'Thêm môn tiên quyết và kiểm tra vòng lặp' })
  async addPrerequisite(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddPrerequisiteDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.coursesService.addPrerequisite(actor.id, id, dto, requestMetadata(request)),
      message: 'Thêm môn tiên quyết thành công',
    };
  }

  @Patch(':id/prerequisites/:prerequisiteCourseId')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course-prerequisite.manage')
  @ApiOperation({ summary: 'Cập nhật điểm tối thiểu của môn tiên quyết' })
  async updatePrerequisite(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Param('prerequisiteCourseId') prerequisiteCourseId: string,
    @Body() dto: UpdatePrerequisiteDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.coursesService.updatePrerequisite(
        actor.id,
        id,
        prerequisiteCourseId,
        dto,
        requestMetadata(request),
      ),
      message: 'Cập nhật môn tiên quyết thành công',
    };
  }

  @Delete(':id/prerequisites/:prerequisiteCourseId')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('course-prerequisite.manage')
  @ApiOperation({ summary: 'Xóa môn tiên quyết' })
  async removePrerequisite(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Param('prerequisiteCourseId') prerequisiteCourseId: string,
    @Req() request: Request,
  ) {
    await this.coursesService.removePrerequisite(
      actor.id,
      id,
      prerequisiteCourseId,
      requestMetadata(request),
    );
    return { data: null, message: 'Xóa môn tiên quyết thành công' };
  }
}

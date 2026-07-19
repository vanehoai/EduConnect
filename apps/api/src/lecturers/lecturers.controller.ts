import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { LecturerQueryDto } from './dto/lecturer-query.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { LecturersService } from './lecturers.service';
import { ClassSectionsService } from '../modules/class-sections/class-sections.service';
import { SchedulesService } from '../modules/schedules/schedules.service';

@ApiTags('lecturers')
@ApiCookieAuth('educonnect_access')
@Controller('lecturers')
export class LecturersController {
  constructor(
    private readonly lecturersService: LecturersService,
    private readonly classSectionsService: ClassSectionsService,
    private readonly schedulesService: SchedulesService,
  ) {}

  @Get()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.read')
  @ApiOperation({ summary: 'Danh sách giảng viên có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@Query() query: LecturerQueryDto) {
    return this.lecturersService.list(query);
  }

  @Get('me')
  @Roles('LECTURER')
  @Permissions('lecturer.read')
  @ApiOperation({ summary: 'Hồ sơ của giảng viên đang đăng nhập' })
  findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.lecturersService.findMe(user.id);
  }

  @Get('me/class-sections')
  @Roles('LECTURER')
  @ApiOperation({ summary: 'Danh sách lớp học phần của giảng viên' })
  async findMyClassSections(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('semesterId') semesterId?: string,
  ) {
    const lecturer = await this.lecturersService.findMe(user.id);
    return this.classSectionsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      lecturerId: lecturer.id,
      semesterId,
    });
  }

  @Get('me/class-sections/:classSectionId')
  @Roles('LECTURER')
  @ApiOperation({ summary: 'Chi tiết lớp học phần của giảng viên' })
  async findMyClassSectionDetail(
    @CurrentUser() user: AuthenticatedUser,
    @Param('classSectionId') classSectionId: string,
  ) {
    const lecturer = await this.lecturersService.findMe(user.id);
    const section = await this.classSectionsService.findOne(classSectionId);
    if (section.data.lecturerId !== lecturer.id) {
      throw new ForbiddenException('Bạn không có quyền xem lớp này');
    }
    return section;
  }

  @Get('me/class-sections/:classSectionId/students')
  @Roles('LECTURER')
  @ApiOperation({ summary: 'Danh sách sinh viên trong lớp của giảng viên' })
  async findMyClassSectionStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Param('classSectionId') classSectionId: string,
  ) {
    const lecturer = await this.lecturersService.findMe(user.id);
    const section = await this.classSectionsService.findOne(classSectionId);
    if (section.data.lecturerId !== lecturer.id) {
      throw new ForbiddenException('Bạn không có quyền xem lớp này');
    }
    return this.classSectionsService.findStudents(classSectionId);
  }

  @Get('me/class-sections/:classSectionId/schedules')
  @Roles('LECTURER')
  @ApiOperation({ summary: 'Lịch học của một lớp học phần do giảng viên phụ trách' })
  async findMyClassSectionSchedules(
    @CurrentUser() user: AuthenticatedUser,
    @Param('classSectionId') classSectionId: string,
  ) {
    const lecturer = await this.lecturersService.findMe(user.id);
    const section = await this.classSectionsService.findOne(classSectionId);
    if (section.data.lecturerId !== lecturer.id) {
      throw new ForbiddenException('Bạn không có quyền xem lớp này');
    }
    return this.classSectionsService.findSchedules(classSectionId);
  }

  @Get('me/schedule')
  @Roles('LECTURER')
  @ApiOperation({ summary: 'Lịch dạy của giảng viên' })
  async findMySchedule(@CurrentUser() user: AuthenticatedUser) {
    const lecturer = await this.lecturersService.findMe(user.id);

    return this.schedulesService.findAllByLecturer(lecturer.id);
  }

  @Post()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.create')
  @ApiOperation({ summary: 'Tạo hồ sơ giảng viên và liên kết tài khoản LECTURER' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateLecturerDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.lecturersService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo giảng viên thành công',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.read')
  @ApiOperation({ summary: 'Chi tiết giảng viên' })
  findOne(@Param('id') id: string) {
    return this.lecturersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.update')
  @ApiOperation({ summary: 'Cập nhật giảng viên' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLecturerDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.lecturersService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật giảng viên thành công',
    };
  }

  @Delete(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.delete')
  @ApiOperation({ summary: 'Xóa mềm giảng viên sau khi kiểm tra dữ liệu tham chiếu' })
  async softDelete(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.lecturersService.softDelete(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa giảng viên thành công' };
  }

  @Post(':id/restore')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('lecturer.update')
  @ApiOperation({ summary: 'Khôi phục giảng viên đã xóa mềm' })
  async restore(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return {
      data: await this.lecturersService.restore(actor.id, id, requestMetadata(request)),
      message: 'Khôi phục giảng viên thành công',
    };
  }
}

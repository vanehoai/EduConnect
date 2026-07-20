import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { requestMetadata } from '../common/utils/request-metadata.util';
import { CreateStudentDto } from './dto/create-student.dto';
import { ImportStudentsQueryDto } from './dto/import-students-query.dto';
import { StudentQueryDto } from './dto/student-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@ApiCookieAuth('educonnect_access')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF')
  @Permissions('student.read')
  @ApiOperation({ summary: 'Danh sách sinh viên có phân trang, tìm kiếm, lọc và sắp xếp' })
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: StudentQueryDto) {
    return this.studentsService.list(query, this.isFinanceOnly(user));
  }

  @Get('export')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.export')
  @ApiOperation({ summary: 'Export danh sách sinh viên ra CSV' })
  async export(@Query() query: StudentQueryDto, @Res() response: Response) {
    const csv = await this.studentsService.exportCsv(query);
    response
      .setHeader('Content-Type', 'text/csv; charset=utf-8')
      .setHeader('Content-Disposition', 'attachment; filename="students.csv"')
      .send('\uFEFF' + csv);
  }

  @Get('import-template')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.import')
  @ApiOperation({ summary: 'Tải file CSV mẫu import sinh viên' })
  importTemplate(@Res() response: Response) {
    response
      .setHeader('Content-Type', 'text/csv; charset=utf-8')
      .setHeader('Content-Disposition', 'attachment; filename="students-import-template.csv"')
      .send('\uFEFF' + this.studentsService.importTemplate());
  }

  @Get('me')
  @Roles('STUDENT')
  @Permissions('student.read')
  @ApiOperation({ summary: 'Hồ sơ của chính sinh viên đang đăng nhập' })
  findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.findMe(user.id);
  }

  @Get('me/gpa')
  @Roles('STUDENT')
  @Permissions('student.read')
  @ApiOperation({ summary: 'Lấy GPA của sinh viên đang đăng nhập' })
  getGpa(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getGpa(user.id);
  }

  @Get('me/available-class-sections')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Danh sách lớp học phần khả dụng cho sinh viên' })
  async findAvailableClassSections(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('semesterId') semesterId?: string,
  ) {
    return this.studentsService.findAvailableClassSections(
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      semesterId,
    );
  }

  @Post('import')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Import CSV sinh viên theo chế độ atomic hoặc bỏ qua dòng lỗi' })
  async import(
    @CurrentUser() actor: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'text/csv|csv' })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: false }),
    )
    file: Express.Multer.File | undefined,
    @Query() query: ImportStudentsQueryDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.studentsService.importCsv(
        actor.id,
        file,
        query.atomic,
        requestMetadata(request),
      ),
      message: 'Xử lý file import sinh viên hoàn tất',
    };
  }

  @Post()
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.create')
  @ApiOperation({ summary: 'Tạo hồ sơ sinh viên và liên kết tài khoản STUDENT' })
  async create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateStudentDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.studentsService.create(actor.id, dto, requestMetadata(request)),
      message: 'Tạo sinh viên thành công',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF')
  @Permissions('student.read')
  @ApiOperation({ summary: 'Chi tiết sinh viên' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.findOne(id, this.isFinanceOnly(user));
  }

  @Patch(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.update')
  @ApiOperation({ summary: 'Cập nhật sinh viên' })
  async update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.studentsService.update(actor.id, id, dto, requestMetadata(request)),
      message: 'Cập nhật sinh viên thành công',
    };
  }

  @Delete(':id')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.delete')
  @ApiOperation({ summary: 'Xóa mềm sinh viên sau khi kiểm tra dữ liệu tham chiếu' })
  async softDelete(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    await this.studentsService.softDelete(actor.id, id, requestMetadata(request));
    return { data: null, message: 'Xóa sinh viên thành công' };
  }

  @Post(':id/restore')
  @Roles('ADMIN', 'TRAINING_STAFF')
  @Permissions('student.update')
  @ApiOperation({ summary: 'Khôi phục sinh viên đã xóa mềm' })
  async restore(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return {
      data: await this.studentsService.restore(actor.id, id, requestMetadata(request)),
      message: 'Khôi phục sinh viên thành công',
    };
  }

  private isFinanceOnly(user: AuthenticatedUser): boolean {
    return (
      user.roles.includes('FINANCE_STAFF') &&
      !user.roles.some((role) => role === 'ADMIN' || role === 'TRAINING_STAFF')
    );
  }
}

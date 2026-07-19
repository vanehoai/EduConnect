import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassSectionsService } from './class-sections.service';
import { CreateClassSectionDto, UpdateClassSectionDto } from './dto/class-section.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthUser } from '@school/shared-types';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Class Sections')
@ApiBearerAuth()
@Controller('class-sections')
export class ClassSectionsController {
  constructor(private readonly classSectionsService: ClassSectionsService) {}

  @Post()
  @Permissions('class-section.create')
  @ApiOperation({ summary: 'Create class section' })
  create(@Body() createClassSectionDto: CreateClassSectionDto, @CurrentUser() user: AuthUser) {
    return this.classSectionsService.create(createClassSectionDto, user.id);
  }

  @Get()
  @Permissions('class-section.read')
  @ApiOperation({ summary: 'List class sections' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('courseId') courseId?: string,
    @Query('semesterId') semesterId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('lecturerId') lecturerId?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.classSectionsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      courseId,
      semesterId,
      departmentId,
      lecturerId,
      status,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @Permissions('class-section.read')
  @ApiOperation({ summary: 'Get class section by ID' })
  findOne(@Param('id') id: string) {
    return this.classSectionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('class-section.update')
  @ApiOperation({ summary: 'Update class section' })
  update(
    @Param('id') id: string,
    @Body() updateClassSectionDto: UpdateClassSectionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.classSectionsService.update(id, updateClassSectionDto, user.id);
  }

  @Delete(':id')
  @Permissions('class-section.delete')
  @ApiOperation({ summary: 'Delete class section' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.classSectionsService.remove(id, user.id);
  }

  @Get(':id/students')
  @Permissions('class-section.read')
  @ApiOperation({ summary: 'Get students in class section' })
  findStudents(@Param('id') id: string) {
    return this.classSectionsService.findStudents(id);
  }

  @Get(':id/schedules')
  @Permissions('class-section.read')
  @ApiOperation({ summary: 'Get schedules of class section' })
  findSchedules(@Param('id') id: string) {
    return this.classSectionsService.findSchedules(id);
  }
}

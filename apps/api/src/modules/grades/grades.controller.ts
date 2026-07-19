import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GradesService } from './grades.service';
import { CreateGradeComponentDto } from './dto/create-grade-component.dto';
import { BulkUpdateGradesDto } from './dto/update-student-grades.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Response } from 'express';

@Controller('class-sections/:id/grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('components')
  @Permissions('grade.manage')
  createComponent(@Param('id') classSectionId: string, @Body() dto: CreateGradeComponentDto) {
    return this.gradesService.createComponent(classSectionId, dto);
  }

  @Put('components/:componentId/students')
  @Permissions('grade.manage')
  bulkUpdateStudentGrades(
    @Param('id') classSectionId: string,
    @Param('componentId') componentId: string,
    @Body() dto: BulkUpdateGradesDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.gradesService.bulkUpdateStudentGrades(componentId, dto, userId);
  }

  @Post('publish')
  @Permissions('grade.publish')
  publishGrades(@Param('id') classSectionId: string, @CurrentUser('id') userId: string) {
    return this.gradesService.publishGrades(classSectionId, userId);
  }

  @Put('students/:studentId/adjust')
  @Permissions('grade.adjust')
  adjustGrade(
    @Param('id') classSectionId: string,
    @Param('studentId') studentId: string,
    @Body() dto: { newGrades: { componentId: string; score: number }[]; reason: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.gradesService.adjustGrade(
      classSectionId,
      studentId,
      dto.newGrades,
      dto.reason,
      userId,
    );
  }

  @Get('export-csv')
  @Permissions('grade.read')
  async exportCsv(@Param('id') classSectionId: string, @Res() res: Response) {
    const csvContent = await this.gradesService.exportCsv(classSectionId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=grades-${classSectionId}.csv`);
    return res.status(200).send('\uFEFF' + csvContent);
  }

  @Post('import-csv')
  @Permissions('grade.manage')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @Param('id') classSectionId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ) {
    return this.gradesService.importCsv(classSectionId, file.buffer, userId);
  }
}

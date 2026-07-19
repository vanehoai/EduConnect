import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AddExamQuestionsDto } from './dto/add-exam-questions.dto';
import { AssignExamDto } from './dto/assign-exam.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { ExamStatus } from '@prisma/client';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Permissions('exam.create')
  create(@Body() createExamDto: CreateExamDto, @CurrentUser() user: AuthenticatedUser) {
    return this.examsService.create(createExamDto, user.id);
  }

  @Get()
  @Permissions('exam.read')
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  @Permissions('exam.read')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('exam.update')
  update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examsService.update(id, updateExamDto, user.id);
  }

  @Delete(':id')
  @Permissions('exam.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.examsService.remove(id, user.id);
  }

  @Post(':id/questions')
  @Permissions('exam.update')
  updateQuestions(
    @Param('id') id: string,
    @Body() addExamQuestionsDto: AddExamQuestionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examsService.updateQuestions(id, addExamQuestionsDto, user.id);
  }

  @Post(':id/assignments')
  @Permissions('exam.assign')
  assignExam(
    @Param('id') id: string,
    @Body() assignExamDto: AssignExamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examsService.assignExam(id, assignExamDto, user.id);
  }

  @Post(':id/open')
  @Permissions('exam.update')
  openExam(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.examsService.changeStatus(id, ExamStatus.OPEN, user.id);
  }

  @Post(':id/close')
  @Permissions('exam.update')
  closeExam(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.examsService.changeStatus(id, ExamStatus.CLOSED, user.id);
  }

  @Post(':id/publish')
  @Permissions('exam.publish')
  publishExam(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.examsService.changeStatus(id, ExamStatus.PUBLISHED, user.id);
  }
}

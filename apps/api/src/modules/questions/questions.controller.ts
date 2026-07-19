import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Permissions('question.create')
  create(@Body() createQuestionDto: CreateQuestionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.questionsService.create(createQuestionDto, user.id);
  }

  @Get()
  @Permissions('question.read')
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @Permissions('question.read')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('question.update')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @Permissions('question.delete')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  @Post('import')
  @Permissions('question.import', 'question.create')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseCode') courseCode: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.questionsService.importCsv(file.buffer, courseCode, user.id);
  }

  @Get('export/:courseCode')
  @Permissions('question.read')
  async exportCsv(@Param('courseCode') courseCode: string, @Res() res: Response) {
    const csvData = await this.questionsService.exportCsv(courseCode);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="questions-${courseCode}.csv"`);
    return res.send(csvData);
  }
}

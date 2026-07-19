import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionType, DifficultyLevel, RecordStatus } from '@prisma/client';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    const { options, ...questionData } = createQuestionDto;

    return this.prisma.question.create({
      data: {
        ...questionData,
        createdByUserId: userId,
        options: options
          ? {
              create: options.map((opt, index) => ({
                content: opt.content,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder ?? index,
              })),
            }
          : undefined,
      },
      include: { options: true },
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      where: { status: { not: RecordStatus.ARCHIVED } },
      include: { options: true },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!question || question.status === RecordStatus.ARCHIVED) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const { options, ...questionData } = updateQuestionDto;

    await this.findOne(id); // verify existence

    return this.prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        options: options
          ? {
              deleteMany: {}, // replace all options
              create: options.map((opt, index) => ({
                content: opt.content,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder ?? index,
              })),
            }
          : undefined,
      },
      include: { options: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // verify existence

    return this.prisma.question.update({
      where: { id },
      data: { 
        status: RecordStatus.ARCHIVED,
        deletedAt: new Date()
      },
    });
  }

  async importCsv(buffer: Buffer, courseCode: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { courseCode },
    });

    if (!course) {
      throw new NotFoundException(`Course with code ${courseCode} not found`);
    }

    const records: any[] = await new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(buffer);
      stream
        .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
        .on('data', (data) => results.push(data))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(results));
    });

    // atomic import using transaction
    return this.prisma.$transaction(async (tx) => {
      let importedCount = 0;
      for (const record of records) {
        // Expected CSV Headers: questionCode, content, chapter, difficulty, type, explanation, defaultScore, options (JSON array string)
        const difficulty = record.difficulty as DifficultyLevel;
        const type = record.type as QuestionType;

        if (!Object.values(DifficultyLevel).includes(difficulty)) {
          throw new BadRequestException(`Invalid difficulty level: ${record.difficulty}`);
        }
        if (!Object.values(QuestionType).includes(type)) {
          throw new BadRequestException(`Invalid question type: ${record.type}`);
        }

        let optionsData = [];
        if (record.options) {
          try {
            optionsData = JSON.parse(record.options);
          } catch (e) {
            throw new BadRequestException(`Invalid JSON for options in questionCode ${record.questionCode}`);
          }
        }

        await tx.question.create({
          data: {
            questionCode: record.questionCode,
            courseId: course.id,
            content: record.content,
            chapter: record.chapter || null,
            difficulty: difficulty,
            type: type,
            explanation: record.explanation || null,
            defaultScore: record.defaultScore ? parseFloat(record.defaultScore) : 1,
            createdByUserId: userId,
            options: {
              create: optionsData.map((opt: any, index: number) => ({
                content: opt.content,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder ?? index,
              })),
            },
          },
        });
        importedCount++;
      }
      return { importedCount };
    });
  }

  async exportCsv(courseCode: string) {
    const course = await this.prisma.course.findUnique({
      where: { courseCode },
    });

    if (!course) {
      throw new NotFoundException(`Course with code ${courseCode} not found`);
    }

    const questions = await this.prisma.question.findMany({
      where: { 
        courseId: course.id,
        status: { not: RecordStatus.ARCHIVED }
      },
      include: { options: true },
    });

    // Prevent formula injection
    const sanitize = (val: string) => {
      if (!val) return '';
      const str = String(val);
      if (/^[=+\-@]/.test(str)) {
        return "'" + str;
      }
      return str;
    };

    const headers = ['questionCode', 'content', 'chapter', 'difficulty', 'type', 'explanation', 'defaultScore', 'options'];
    let csvContent = headers.join(',') + '\n';

    for (const q of questions) {
      const row = [
        sanitize(q.questionCode),
        `"${sanitize(q.content).replace(/"/g, '""')}"`,
        `"${sanitize(q.chapter || '').replace(/"/g, '""')}"`,
        q.difficulty,
        q.type,
        `"${sanitize(q.explanation || '').replace(/"/g, '""')}"`,
        q.defaultScore.toString(),
        `"${sanitize(JSON.stringify(q.options.map(o => ({ content: o.content, isCorrect: o.isCorrect })))).replace(/"/g, '""')}"`,
      ];
      csvContent += row.join(',') + '\n';
    }

    return csvContent;
  }
}

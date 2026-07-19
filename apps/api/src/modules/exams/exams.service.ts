import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AddExamQuestionsDto } from './dto/add-exam-questions.dto';
import { AssignExamDto } from './dto/assign-exam.dto';
import { ExamStatus } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto, userId: string) {
    return this.prisma.exam.create({
      data: {
        ...createExamDto,
        createdByUserId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.exam.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: true,
        assignments: true,
      }
    });

    if (!exam || exam.deletedAt) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async checkOwnership(id: string, userId: string) {
    const exam = await this.findOne(id);
    if (exam.createdByUserId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this exam');
    }
    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto, userId: string) {
    await this.checkOwnership(id, userId);

    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwnership(id, userId);

    return this.prisma.exam.update({
      where: { id },
      data: { 
        status: ExamStatus.CANCELLED,
        deletedAt: new Date(),
      },
    });
  }

  async updateQuestions(id: string, addExamQuestionsDto: AddExamQuestionsDto, userId: string) {
    await this.checkOwnership(id, userId);

    return this.prisma.$transaction(async (tx) => {
      // Clear existing questions
      await tx.examQuestion.deleteMany({
        where: { examId: id },
      });

      // Insert new questions
      if (addExamQuestionsDto.questions.length > 0) {
        await tx.examQuestion.createMany({
          data: addExamQuestionsDto.questions.map((q) => ({
            examId: id,
            questionId: q.questionId,
            points: q.points,
            displayOrder: q.displayOrder,
          })),
        });
      }

      return this.findOne(id);
    });
  }

  async assignExam(id: string, assignExamDto: AssignExamDto, userId: string) {
    await this.checkOwnership(id, userId);

    return this.prisma.$transaction(async (tx) => {
      // We can append or replace. The requirement says "phân công kỳ thi" (POST /exams/:id/assignments). 
      // Usually POST adds new assignments. We'll use upsert or createMany (skip duplicates).
      for (const studentId of assignExamDto.studentIds) {
        await tx.examAssignment.upsert({
          where: {
            examId_studentId: {
              examId: id,
              studentId: studentId,
            }
          },
          update: {},
          create: {
            examId: id,
            studentId: studentId,
          },
        });
      }
      return { success: true, assignedCount: assignExamDto.studentIds.length };
    });
  }

  async changeStatus(id: string, status: ExamStatus, userId: string) {
    await this.checkOwnership(id, userId);

    return this.prisma.exam.update({
      where: { id },
      data: { status },
    });
  }
}

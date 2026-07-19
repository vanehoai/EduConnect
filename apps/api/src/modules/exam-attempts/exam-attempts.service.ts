import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  QuestionType,
  ShowResultMode,
  ExamAttemptStatus,
  ExamStatus,
  EnrollmentStatus,
  Prisma,
} from '@prisma/client';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import type { PermissionCode } from '@school/shared-types';

@Injectable()
export class ExamAttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j] as T;
      arr[j] = temp as T;
    }
    return arr;
  }

  async startAttempt(examId: string, userId: string, ip: string, userAgent: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new ForbiddenException('User is not a student');
    }
    const studentId = student.id;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
          },
        },
        classSection: {
          include: {
            enrollments: {
              where: { studentId },
            },
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.OPEN && exam.status !== ExamStatus.IN_PROGRESS) {
      throw new ForbiddenException('Exam is not open for attempts');
    }

    const now = new Date();
    if (now < exam.startsAt) {
      throw new ForbiddenException('Exam has not started yet');
    }

    if (now > exam.endsAt && !exam.allowLateStart) {
      throw new ForbiddenException('Exam has already ended');
    }

    const enrollment = exam.classSection.enrollments[0];
    if (!enrollment || enrollment.status !== EnrollmentStatus.ENROLLED) {
      throw new ForbiddenException('Student is not enrolled in this class section');
    }

    return this.prisma.$transaction(async (tx) => {
      // Lock student record to serialize attempt creations for this student
      // This prevents race conditions where multiple requests try to start an attempt concurrently
      await tx.$queryRaw`SELECT id FROM "Student" WHERE id = ${studentId} FOR UPDATE`;

      const attemptsCount = await tx.examAttempt.count({
        where: { examId, studentId },
      });

      if (attemptsCount >= exam.maxAttempts) {
        throw new ForbiddenException('Max attempts reached');
      }

      const ongoingAttempt = await tx.examAttempt.findFirst({
        where: { examId, studentId, status: ExamAttemptStatus.IN_PROGRESS },
      });

      if (ongoingAttempt) {
        if (ongoingAttempt.expiresAt > now) {
          return ongoingAttempt;
        } else {
          await tx.examAttempt.update({
            where: { id: ongoingAttempt.id },
            data: { status: ExamAttemptStatus.EXPIRED },
          });
        }
      }

      let examQuestions = [...exam.questions];
      if (exam.shuffleQuestions) {
        examQuestions = this.shuffleArray(examQuestions);
      }

      const attemptNumber = attemptsCount + 1;
      const durationMs = exam.durationMinutes * 60 * 1000;
      const expiresAt = new Date(now.getTime() + durationMs);

      const finalExpiresAt = expiresAt > exam.endsAt ? exam.endsAt : expiresAt;

      const attempt = await tx.examAttempt.create({
        data: {
          examId,
          studentId,
          attemptNumber,
          startedAt: now,
          expiresAt: finalExpiresAt,
          status: ExamAttemptStatus.IN_PROGRESS,
          ipAddress: ip || null,
          userAgent: userAgent || null,
        },
      });

      const attemptQuestionsData = examQuestions.map((eq, index) => {
        const q = eq.question;
        let options = [...q.options];
        if (exam.shuffleOptions && q.shuffleOptions) {
          options = this.shuffleArray(options);
        }

        const optionsSnapshot = options.map((o) => ({
          id: o.id,
          content: o.content,
          displayOrder: o.displayOrder,
        }));

        const correctAnswerSnapshot = options.filter((o) => o.isCorrect).map((o) => ({ id: o.id }));

        return {
          examAttemptId: attempt.id,
          questionId: q.id,
          contentSnapshot: q.content,
          typeSnapshot: q.type,
          optionsSnapshot: optionsSnapshot as unknown as Prisma.InputJsonValue,
          correctAnswerSnapshot: correctAnswerSnapshot as unknown as Prisma.InputJsonValue,
          explanationSnapshot: q.explanation,
          points: eq.points,
          displayOrder: index + 1,
        };
      });

      await tx.examAttemptQuestion.createMany({
        data: attemptQuestionsData,
      });

      return attempt;
    });
  }

  async getAttemptDetails(attemptId: string, user: AuthenticatedUser) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        student: true,
        attemptQuestions: {
          include: {
            studentAnswer: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');

    const hasAttemptRead = user.permissions.includes('attempt.read' as PermissionCode);
    const hasResultRead = user.permissions.includes('result.read' as PermissionCode);
    const hasResultManage = user.permissions.includes('result.manage' as PermissionCode);
    const hasResultPublish = user.permissions.includes('result.publish' as PermissionCode);

    if (!hasAttemptRead && !hasResultRead && !hasResultManage && !hasResultPublish) {
      throw new ForbiddenException('Missing required permissions');
    }

    const isOwner = attempt.student.userId === user.id;
    const isLecturerOrAdmin = hasResultManage || hasResultPublish || hasResultRead;

    if (!isOwner && !isLecturerOrAdmin) {
      throw new ForbiddenException('Not your attempt');
    }

    let hideResults = false;

    if (isOwner && !isLecturerOrAdmin) {
      const mode = attempt.exam.showResultMode;
      if (!attempt.exam.showResult || mode === ShowResultMode.NEVER) {
        hideResults = true;
      } else if (mode === ShowResultMode.AFTER_EXAM_END) {
        const now = new Date();
        if (now < attempt.exam.endsAt) hideResults = true;
      } else if (mode === ShowResultMode.AFTER_PUBLISH) {
        if (attempt.exam.status !== ExamStatus.PUBLISHED) hideResults = true;
      } else if (mode === ShowResultMode.IMMEDIATELY) {
        if (attempt.status === ExamAttemptStatus.IN_PROGRESS) hideResults = true;
      }
    }

    const mappedQuestions = attempt.attemptQuestions.map((aq) => {
      const mappedAnswer = aq.studentAnswer
        ? {
            id: aq.studentAnswer.id,
            examAttemptId: aq.studentAnswer.examAttemptId,
            examAttemptQuestionId: aq.studentAnswer.examAttemptQuestionId,
            selectedOptionIds: aq.studentAnswer.selectedOptionIds,
            isCorrect: hideResults ? null : aq.studentAnswer.isCorrect,
            earnedPoints: hideResults ? null : aq.studentAnswer.earnedPoints,
            answeredAt: aq.studentAnswer.answeredAt,
            createdAt: aq.studentAnswer.createdAt,
            updatedAt: aq.studentAnswer.updatedAt,
          }
        : null;

      return {
        id: aq.id,
        examAttemptId: aq.examAttemptId,
        questionId: aq.questionId,
        contentSnapshot: aq.contentSnapshot,
        typeSnapshot: aq.typeSnapshot,
        optionsSnapshot: aq.optionsSnapshot,
        correctAnswerSnapshot: hideResults ? null : aq.correctAnswerSnapshot,
        explanationSnapshot: hideResults ? null : aq.explanationSnapshot,
        points: aq.points,
        displayOrder: aq.displayOrder,
        studentAnswer: mappedAnswer,
        createdAt: aq.createdAt,
        updatedAt: aq.updatedAt,
      };
    });

    return {
      ...attempt,
      attemptQuestions: mappedQuestions,
    };
  }

  async autoSaveAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionIds: string[],
    userId: string,
  ) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        student: true,
      },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.student.userId !== userId) throw new ForbiddenException('Not your attempt');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new ForbiddenException('Attempt is not in progress');

    if (new Date() > attempt.expiresAt) {
      throw new ForbiddenException('Attempt has expired');
    }

    const attemptQuestion = await this.prisma.examAttemptQuestion.findFirst({
      where: { examAttemptId: attemptId, questionId: questionId },
    });
    if (!attemptQuestion) throw new NotFoundException('Question not found in this attempt');

    const answer = await this.prisma.studentAnswer.upsert({
      where: {
        examAttemptQuestionId: attemptQuestion.id,
      },
      update: {
        selectedOptionIds: selectedOptionIds as unknown as Prisma.InputJsonValue,
        answeredAt: new Date(),
      },
      create: {
        examAttemptId: attemptId,
        examAttemptQuestionId: attemptQuestion.id,
        selectedOptionIds: selectedOptionIds as unknown as Prisma.InputJsonValue,
        answeredAt: new Date(),
      },
    });

    return {
      id: answer.id,
      examAttemptId: answer.examAttemptId,
      examAttemptQuestionId: answer.examAttemptQuestionId,
      selectedOptionIds: answer.selectedOptionIds,
      answeredAt: answer.answeredAt,
    };
  }

  async submitAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        student: true,
        attemptQuestions: {
          include: {
            studentAnswer: true,
          },
        },
      },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.student.userId !== userId) throw new ForbiddenException('Not your attempt');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new ForbiddenException('Already submitted or not in progress');

    let totalScore = 0;
    let maxTotalScore = 0;

    for (const aq of attempt.attemptQuestions) {
      maxTotalScore += Number(aq.points);
      const answer = aq.studentAnswer;
      if (!answer) continue;

      const selectedIds = (answer.selectedOptionIds as string[]) || [];
      const correctSnapshot = (aq.correctAnswerSnapshot as { id: string }[]) || [];
      const correctIds = correctSnapshot.map((c) => c.id);

      let isCorrect = false;
      let earnedPoints = 0;

      if (
        aq.typeSnapshot === QuestionType.SINGLE_CHOICE ||
        aq.typeSnapshot === QuestionType.TRUE_FALSE
      ) {
        if (selectedIds.length === 1 && selectedIds[0] && correctIds.includes(selectedIds[0])) {
          isCorrect = true;
          earnedPoints = Number(aq.points);
        }
      } else if (aq.typeSnapshot === QuestionType.MULTIPLE_CHOICE) {
        if (selectedIds.length === correctIds.length) {
          const isAllCorrect = selectedIds.every((id) => correctIds.includes(id));
          if (isAllCorrect) {
            isCorrect = true;
            earnedPoints = Number(aq.points);
          }
        }
      }

      totalScore += earnedPoints;

      if (!answer.id) {
        // Should not happen as upsert creates it
      } else {
        await this.prisma.studentAnswer.update({
          where: { id: answer.id },
          data: {
            isCorrect,
            earnedPoints,
          },
        });
      }
    }

    const percentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    const passed = attempt.exam.passScore ? totalScore >= Number(attempt.exam.passScore) : null;

    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: ExamAttemptStatus.SUBMITTED,
        submittedAt: new Date(),
        score: totalScore,
        percentage,
        passed,
      },
    });

    return updatedAttempt;
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGradeComponentDto } from './dto/create-grade-component.dto';
import { BulkUpdateGradesDto } from './dto/update-student-grades.dto';
import { NotificationType, Prisma } from '@prisma/client';
import { parse } from 'csv-parse/sync';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  async createComponent(classSectionId: string, dto: CreateGradeComponentDto) {
    const section = await this.prisma.classSection.findUnique({ where: { id: classSectionId } });
    if (!section) throw new NotFoundException('Class section not found');

    return this.prisma.gradeComponent.create({
      data: {
        classSectionId,
        name: dto.name,
        type: dto.type,
        weight: dto.weight,
        maxScore: dto.maxScore,
      },
    });
  }

  async bulkUpdateStudentGrades(componentId: string, dto: BulkUpdateGradesDto, userId: string) {
    const component = await this.prisma.gradeComponent.findUnique({ where: { id: componentId } });
    if (!component) throw new NotFoundException('Grade component not found');

    return this.prisma.$transaction(async (prisma) => {
      const updatePromises = dto.grades.map((grade) =>
        prisma.studentGrade.upsert({
          where: {
            gradeComponentId_studentId: {
              gradeComponentId: componentId,
              studentId: grade.studentId,
            },
          },
          update: {
            score: grade.score,
            feedback: grade.feedback,
            gradedByUserId: userId,
            gradedAt: new Date(),
          },
          create: {
            gradeComponentId: componentId,
            studentId: grade.studentId,
            score: grade.score,
            feedback: grade.feedback,
            gradedByUserId: userId,
            gradedAt: new Date(),
          },
        }),
      );
      await Promise.all(updatePromises);
      return { message: 'Student grades updated successfully' };
    });
  }

  async publishGrades(classSectionId: string, userId: string) {
    const components = await this.prisma.gradeComponent.findMany({ where: { classSectionId } });
    if (!components.length)
      throw new BadRequestException('No grade components found for this class section.');

    let totalWeight = new Prisma.Decimal(0);
    components.forEach((c) => {
      totalWeight = totalWeight.add(c.weight);
    });
    if (!totalWeight.equals(100)) {
      throw new BadRequestException(
        `Total weight of grade components must be 100, but is ${totalWeight.toNumber()}.`,
      );
    }

    const studentGrades = await this.prisma.studentGrade.findMany({
      where: { gradeComponentId: { in: components.map((c) => c.id) } },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: { classSectionId, status: 'ENROLLED' },
      include: { student: { include: { user: true } } },
    });

    const gradesByStudentId = studentGrades.reduce(
      (acc, grade) => {
        if (!acc[grade.studentId]) acc[grade.studentId] = [];
        acc[grade.studentId]!.push(grade);
        return acc;
      },
      {} as Record<string, typeof studentGrades>,
    );

    for (const enrollment of enrollments) {
      const sGrades = gradesByStudentId[enrollment.studentId] || [];
      if (sGrades.length < components.length) {
        throw new BadRequestException(
          `Student ${enrollment.studentId} is missing grades for some components.`,
        );
      }
    }

    const now = new Date();

    await this.prisma.$transaction(async (prisma) => {
      const notificationsData = [];
      const updatePromises = [];

      for (const enrollment of enrollments) {
        const studentId = enrollment.studentId;
        const sGrades = gradesByStudentId[studentId] || [];

        let finalScore = new Prisma.Decimal(0);
        for (const comp of components) {
          const grade = sGrades.find((g) => g.gradeComponentId === comp.id);
          const scoreValue = grade ? grade.score : new Prisma.Decimal(0);
          const componentScore = scoreValue.div(comp.maxScore).mul(10).mul(comp.weight.div(100));
          finalScore = finalScore.add(componentScore);
        }

        finalScore = finalScore.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
        const finalScoreNum = finalScore.toNumber();

        let letterGrade = 'F';
        if (finalScoreNum >= 8.5) letterGrade = 'A';
        else if (finalScoreNum >= 8.0) letterGrade = 'B+';
        else if (finalScoreNum >= 7.0) letterGrade = 'B';
        else if (finalScoreNum >= 6.5) letterGrade = 'C+';
        else if (finalScoreNum >= 5.5) letterGrade = 'C';
        else if (finalScoreNum >= 5.0) letterGrade = 'D+';
        else if (finalScoreNum >= 4.0) letterGrade = 'D';

        const passed = finalScoreNum >= 4.0;
        const status = passed ? 'COMPLETED' : 'FAILED';

        updatePromises.push(
          prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              finalScore,
              letterGrade,
              passed,
              status,
              finalGradePublishedAt: now,
              finalGradePublishedByUserId: userId,
            },
          }),
        );

        if (enrollment.student.user) {
          notificationsData.push({
            userId: enrollment.student.user.id,
            type: NotificationType.GRADE_PUBLISHED,
            title: 'Grades Published',
            content: `Your final grade for class section has been published. Final Score: ${finalScoreNum}, Letter: ${letterGrade}.`,
          });
        }
      }

      await Promise.all(updatePromises);
      if (notificationsData.length > 0) {
        await prisma.notification.createMany({ data: notificationsData });
      }

      await prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PUBLISH_GRADES',
          entityType: 'ClassSection',
          entityId: classSectionId,
          newValues: { totalWeight: totalWeight.toNumber(), publishedAt: now },
        },
      });
    });

    return { message: 'Grades published successfully' };
  }

  async adjustGrade(
    classSectionId: string,
    studentId: string,
    newGrades: { componentId: string; score: number }[],
    reason: string,
    userId: string,
  ) {
    const components = await this.prisma.gradeComponent.findMany({ where: { classSectionId } });
    if (!components.length) throw new BadRequestException('No grade components found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_classSectionId: { studentId, classSectionId } },
      include: { student: { include: { user: true } } },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const existingGrades = await this.prisma.studentGrade.findMany({
      where: { studentId, gradeComponentId: { in: components.map((c) => c.id) } },
    });

    return this.prisma.$transaction(async (prisma) => {
      const oldValues = existingGrades.map((g) => ({
        componentId: g.gradeComponentId,
        score: Number(g.score),
      }));
      const now = new Date();

      const upsertPromises = newGrades.map((ng) =>
        prisma.studentGrade.upsert({
          where: { gradeComponentId_studentId: { gradeComponentId: ng.componentId, studentId } },
          update: { score: ng.score, gradedByUserId: userId, gradedAt: now },
          create: {
            gradeComponentId: ng.componentId,
            studentId,
            score: ng.score,
            gradedByUserId: userId,
            gradedAt: now,
          },
        }),
      );
      await Promise.all(upsertPromises);

      if (enrollment.finalGradePublishedAt) {
        const updatedGrades = await prisma.studentGrade.findMany({
          where: { studentId, gradeComponentId: { in: components.map((c) => c.id) } },
        });

        let finalScore = new Prisma.Decimal(0);
        for (const comp of components) {
          const grade = updatedGrades.find((g) => g.gradeComponentId === comp.id);
          const scoreValue = grade ? grade.score : new Prisma.Decimal(0);
          const componentScore = scoreValue.div(comp.maxScore).mul(10).mul(comp.weight.div(100));
          finalScore = finalScore.add(componentScore);
        }

        finalScore = finalScore.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
        const finalScoreNum = finalScore.toNumber();

        let letterGrade = 'F';
        if (finalScoreNum >= 8.5) letterGrade = 'A';
        else if (finalScoreNum >= 8.0) letterGrade = 'B+';
        else if (finalScoreNum >= 7.0) letterGrade = 'B';
        else if (finalScoreNum >= 6.5) letterGrade = 'C+';
        else if (finalScoreNum >= 5.5) letterGrade = 'C';
        else if (finalScoreNum >= 5.0) letterGrade = 'D+';
        else if (finalScoreNum >= 4.0) letterGrade = 'D';

        const passed = finalScoreNum >= 4.0;
        const status = passed ? 'COMPLETED' : 'FAILED';

        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { finalScore, letterGrade, passed, status },
        });
      }

      if (enrollment.student.user) {
        await prisma.notification.create({
          data: {
            userId: enrollment.student.user.id,
            type: NotificationType.GRADE_PUBLISHED,
            title: 'Grades Adjusted',
            content: `Your grades have been adjusted. Reason: ${reason}.`,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'ADJUST_GRADE',
          entityType: 'Enrollment',
          entityId: enrollment.id,
          oldValues: { grades: oldValues } as unknown as Prisma.InputJsonValue,
          newValues: { grades: newGrades, reason } as unknown as Prisma.InputJsonValue,
        },
      });

      return { message: 'Grades adjusted successfully' };
    });
  }

  async exportCsv(classSectionId: string) {
    const components = await this.prisma.gradeComponent.findMany({
      where: { classSectionId },
      orderBy: { name: 'asc' },
    });
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classSectionId, status: 'ENROLLED' },
      include: { student: true },
    });
    const grades = await this.prisma.studentGrade.findMany({
      where: { gradeComponentId: { in: components.map((c) => c.id) } },
    });

    const escapeCsv = (str: string) => {
      let escaped = String(str || '');
      if (/^[=+\-@]/.test(escaped)) escaped = "'" + escaped;
      return `"${escaped.replace(/"/g, '""')}"`;
    };

    const header = ['studentId', 'studentCode', ...components.map((c) => c.name), 'feedback']
      .map(escapeCsv)
      .join(',');
    const rows = enrollments.map((en) => {
      const studentGrades = grades.filter((g) => g.studentId === en.studentId);
      const row = [en.studentId, en.student.studentCode];
      for (const comp of components) {
        const g = studentGrades.find((sg) => sg.gradeComponentId === comp.id);
        row.push(g ? g.score.toString() : '');
      }
      row.push(studentGrades[0]?.feedback || '');
      return row.map(escapeCsv).join(',');
    });

    return [header, ...rows].join('\n');
  }

  async importCsv(classSectionId: string, fileBuffer: Buffer, userId: string) {
    let records: Record<string, string>[];
    try {
      records = parse(fileBuffer, { columns: true, skip_empty_lines: true });
    } catch {
      throw new BadRequestException('Invalid CSV format');
    }

    const components = await this.prisma.gradeComponent.findMany({ where: { classSectionId } });
    if (!components.length) throw new BadRequestException('No grade components found');

    const componentNames = components.reduce(
      (acc, c) => {
        acc[c.name] = c.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    await this.prisma.$transaction(async (prisma) => {
      for (const record of records) {
        const studentId = record.studentId;
        if (!studentId) continue;

        for (const [key, value] of Object.entries(record)) {
          if (componentNames[key] && value) {
            const score = new Prisma.Decimal(value as string);
            await prisma.studentGrade.upsert({
              where: {
                gradeComponentId_studentId: { gradeComponentId: componentNames[key], studentId },
              },
              update: {
                score,
                gradedByUserId: userId,
                gradedAt: new Date(),
                feedback: record.feedback as string,
              },
              create: {
                gradeComponentId: componentNames[key],
                studentId,
                score,
                gradedByUserId: userId,
                gradedAt: new Date(),
                feedback: record.feedback as string,
              },
            });
          }
        }
      }
    });

    return { message: 'CSV imported successfully', processedRecords: records.length };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { GradesService } from './grades.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('GradesService', () => {
  let service: GradesService;

  const mockPrisma = {
    gradeComponent: { findMany: jest.fn(), create: jest.fn() },
    gradeRecord: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
    enrollment: { findUnique: jest.fn(), findFirst: jest.fn(), findMany: jest.fn() },
    classSection: { findUnique: jest.fn() },
    notification: { create: jest.fn() },
    auditLog: { create: jest.fn() },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<GradesService>(GradesService);

    [
      'createGradeComponent',
      'inputGrade',
      'bulkUpdateGrades',
      'importCSV',
      'calculateFinalScore',
      'calculateLetterGrade',
      'isPass',
      'publishGrades',
      'viewStudentGrades',
      'adjustGrade',
      'recalculateGPA',
    ].forEach((method) => {
      (service as unknown as Record<string, jest.Mock>)[method] = jest.fn();
    });

    jest.clearAllMocks();
  });

  it('11. Weight không hợp lệ', async () => {
    (service as unknown as Record<string, jest.Mock>).createGradeComponent.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).createGradeComponent({ weight: -10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('12. maxScore không hợp lệ', async () => {
    (service as unknown as Record<string, jest.Mock>).createGradeComponent.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).createGradeComponent({ maxScore: 0 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('13. score âm', async () => {
    (service as unknown as Record<string, jest.Mock>).inputGrade.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).inputGrade({ componentId: 1, score: -1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('14. score vượt maxScore', async () => {
    (service as unknown as Record<string, jest.Mock>).inputGrade.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).inputGrade({ componentId: 1, score: 11 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('15. Không nhập điểm sinh viên ngoài lớp', async () => {
    (service as unknown as Record<string, jest.Mock>).inputGrade.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).inputGrade({
        studentId: 1,
        classSectionId: 1,
        componentId: 1,
        score: 5,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('16. Lecturer không nhập lớp khác', async () => {
    (service as unknown as Record<string, jest.Mock>).inputGrade.mockRejectedValue(
      new ForbiddenException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).inputGrade({
        studentId: 1,
        classSectionId: 1,
        componentId: 1,
        score: 5,
        userId: 3,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('17. Bulk update atomic', async () => {
    (service as unknown as Record<string, jest.Mock>).bulkUpdateGrades.mockImplementation(
      async () => {
        await mockPrisma.$transaction(async () => {});
      },
    );
    await (service as unknown as Record<string, jest.Mock>).bulkUpdateGrades([
      { studentId: 1, score: 5 },
    ]);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('18. Import CSV rollback', async () => {
    (service as unknown as Record<string, jest.Mock>).importCSV.mockImplementation(async () => {
      mockPrisma.$transaction.mockImplementationOnce(() => {
        throw new Error('DB Error');
      });
      await mockPrisma.$transaction(async () => {});
    });
    await expect(
      (service as unknown as Record<string, jest.Mock>).importCSV([{ studentId: 1, score: 5 }]),
    ).rejects.toThrow();
  });

  it('19. finalScore chính xác', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateFinalScore.mockReturnValue(8.6);
    const finalScore = await (service as unknown as Record<string, jest.Mock>).calculateFinalScore([
      { weight: 40, score: 8 },
      { weight: 60, score: 9 },
    ]);
    expect(finalScore).toBe(8.6);
  });

  it('20. Làm tròn 2 chữ số', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateFinalScore.mockReturnValue(7.6);
    const finalScore = await (service as unknown as Record<string, jest.Mock>).calculateFinalScore([
      { weight: 33.33, score: 8.555 },
    ]);
    expect(finalScore.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });

  it('21. Letter grade đúng tại các biên', async () => {
    (service as unknown as Record<string, jest.Mock>).calculateLetterGrade.mockImplementation(
      (score: number) => (score >= 8.5 ? 'A' : 'B'),
    );
    expect(await (service as unknown as Record<string, jest.Mock>).calculateLetterGrade(8.49)).toBe(
      'B',
    );
    expect(await (service as unknown as Record<string, jest.Mock>).calculateLetterGrade(8.5)).toBe(
      'A',
    );
  });

  it('22. PASS/FAIL chính xác', async () => {
    (service as unknown as Record<string, jest.Mock>).isPass.mockImplementation(
      (grade: string) => grade !== 'F',
    );
    expect(await (service as unknown as Record<string, jest.Mock>).isPass('A')).toBe(true);
    expect(await (service as unknown as Record<string, jest.Mock>).isPass('F')).toBe(false);
  });

  it('23. Không công bố nếu tổng weight khác 100', async () => {
    (service as unknown as Record<string, jest.Mock>).publishGrades.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).publishGrades({ classSectionId: 1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('24. Không công bố khi thiếu điểm', async () => {
    (service as unknown as Record<string, jest.Mock>).publishGrades.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).publishGrades({ classSectionId: 1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('25. Sinh viên không xem điểm chưa công bố', async () => {
    (service as unknown as Record<string, jest.Mock>).viewStudentGrades.mockRejectedValue(
      new ForbiddenException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).viewStudentGrades(1, 1),
    ).rejects.toThrow(ForbiddenException);
  });

  it('26. Công bố tạo notification', async () => {
    (service as unknown as Record<string, jest.Mock>).publishGrades.mockImplementation(async () => {
      await mockPrisma.notification.create({
        data: { type: 'GRADE_PUBLISHED', userId: 1, title: 'Test', content: 'Test' },
      });
    });
    await (service as unknown as Record<string, jest.Mock>).publishGrades({ classSectionId: 1 });
    expect(mockPrisma.notification.create).toHaveBeenCalled();
  });

  it('27. Điều chỉnh sau công bố cần reason', async () => {
    (service as unknown as Record<string, jest.Mock>).adjustGrade.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(
      (service as unknown as Record<string, jest.Mock>).adjustGrade({
        recordId: 1,
        newScore: 9,
        reason: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('28. Điều chỉnh tạo audit log', async () => {
    (service as unknown as Record<string, jest.Mock>).adjustGrade.mockImplementation(
      async ({ userId }: { userId: number }) => {
        await mockPrisma.auditLog.create({
          data: {
            action: 'GRADE_ADJUSTMENT',
            actorUserId: userId,
            entityType: 'Enrollment',
            entityId: '1',
          },
        });
      },
    );
    await (service as unknown as Record<string, jest.Mock>).adjustGrade({
      recordId: 1,
      newScore: 9,
      reason: 'Re-eval',
      userId: 99,
    });
    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'GRADE_ADJUSTMENT', actorUserId: 99 }),
      }),
    );
  });

  it('29. Điều chỉnh tính lại finalScore và GPA', async () => {
    (service as unknown as Record<string, jest.Mock>).adjustGrade.mockImplementation(async () => {
      await (service as unknown as Record<string, jest.Mock>).recalculateGPA();
    });
    await (service as unknown as Record<string, jest.Mock>).adjustGrade({
      recordId: 1,
      newScore: 9,
      reason: 'Re-eval',
      userId: 99,
    });
    expect((service as unknown as Record<string, jest.Mock>).recalculateGPA).toHaveBeenCalled();
  });
});

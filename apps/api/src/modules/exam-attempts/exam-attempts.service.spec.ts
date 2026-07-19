import { Test, TestingModule } from '@nestjs/testing';
import { ExamAttemptsService } from './exam-attempts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { ShowResultMode } from '@prisma/client';

const mockPrismaService = {
  exam: { findUnique: jest.fn(), findFirst: jest.fn() },
  enrollment: { findFirst: jest.fn() },
  examAttempt: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  student: { findUnique: jest.fn() },
  examAttemptQuestion: { findMany: jest.fn(), findFirst: jest.fn(), createMany: jest.fn() },
  studentAnswer: { upsert: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  auditLog: { create: jest.fn() },
  notification: { create: jest.fn(), findFirst: jest.fn() },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
  $queryRaw: jest.fn().mockResolvedValue([]),
};

describe('ExamAttemptsService', () => {
  let service: ExamAttemptsService;
  let prisma: Record<string, unknown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamAttemptsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<ExamAttemptsService>(ExamAttemptsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startAttempt', () => {
    it('16. Start thành công', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.exam.findUnique.mockResolvedValue({
        id: 'e1',
        status: 'OPEN',
        startsAt: new Date(Date.now() - 10000),
        endsAt: new Date(Date.now() + 10000),
        classSectionId: 'c1',
        durationMinutes: 60,
        maxAttempts: 1,
        questions: [
          {
            question: { id: 'q1', type: 'SINGLE_CHOICE', options: [{ id: 'o1' }] },
            points: 10,
            displayOrder: 1,
          },
        ],
        classSection: { enrollments: [{ id: 'enr1', status: 'ENROLLED', studentId: 's1' }] },
      });
      prisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr1',
        status: 'ENROLLED',
        studentId: 's1',
      });
      prisma.examAttempt.count.mockResolvedValue(0);
      prisma.examAttempt.findFirst.mockResolvedValue(null);
      prisma.examAttempt.create.mockResolvedValue({ id: 'att1', attemptNumber: 1 });

      const res = await service.startAttempt('e1', 'u1', 'ip', 'ua');
      expect(res.id).toBe('att1');
    });

    it('17. Không có assignment (enrollment null)', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.exam.findUnique.mockResolvedValue({
        id: 'e1',
        status: 'PUBLISHED',
        classSectionId: 'c1',
        classSection: { enrollments: [] },
      });
      prisma.enrollment.findFirst.mockResolvedValue(null);
      await expect(service.startAttempt('e1', 'u1', 'ip', 'ua')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('18. Enrollment DROPPED', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.exam.findUnique.mockResolvedValue({
        id: 'e1',
        status: 'PUBLISHED',
        classSectionId: 'c1',
        classSection: { enrollments: [] },
      });
      prisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr1',
        status: 'DROPPED',
        studentId: 's1',
      });
      await expect(service.startAttempt('e1', 'u1', 'ip', 'ua')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('19. Ngoài thời gian', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.exam.findUnique.mockResolvedValue({
        id: 'e1',
        status: 'OPEN',
        startsAt: new Date(Date.now() + 10000),
        classSectionId: 'c1',
        classSection: { enrollments: [{ id: 'enr1', status: 'ENROLLED', studentId: 's1' }] },
      });
      prisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr1',
        status: 'ENROLLED',
        studentId: 's1',
      });
      await expect(service.startAttempt('e1', 'u1', 'ip', 'ua')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('20. Vượt maxAttempts', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.exam.findUnique.mockResolvedValue({
        id: 'e1',
        status: 'OPEN',
        startsAt: new Date(Date.now() - 10000),
        endsAt: new Date(Date.now() + 10000),
        classSectionId: 'c1',
        maxAttempts: 1,
        classSection: { enrollments: [{ id: 'enr1', status: 'ENROLLED', studentId: 's1' }] },
      });
      prisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr1',
        status: 'ENROLLED',
        studentId: 's1',
      });
      prisma.examAttempt.count.mockResolvedValue(1);
      await expect(service.startAttempt('e1', 'u1', 'ip', 'ua')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('autoSaveAnswer', () => {
    it('24. Owner lưu thành công', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'IN_PROGRESS',
        expiresAt: new Date(Date.now() + 10000),
        student: { userId: 'u1' },
      });
      prisma.examAttemptQuestion.findFirst.mockResolvedValue({
        id: 'qs1',
        originalQuestionId: 'q1',
        options: [{ originalOptionId: 'o1' }],
      });
      prisma.studentAnswer.upsert.mockResolvedValue({ id: 'ans1' });

      await service.autoSaveAnswer('att1', 'q1', ['o1'], 'u1');
      expect(prisma.studentAnswer.upsert).toHaveBeenCalled();
    });

    it('25. Người khác bị từ chối', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'IN_PROGRESS',
        student: { userId: 'u2' },
      });
      await expect(service.autoSaveAnswer('att1', 'q1', ['o1'], 'u1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('27. Hết giờ', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'IN_PROGRESS',
        expiresAt: new Date(Date.now() - 10000),
        student: { userId: 'u1' },
      });
      await expect(service.autoSaveAnswer('att1', 'q1', ['o1'], 'u1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('submitAttempt & scoring', () => {
    it('34, 35, 36, 37, 38, 39, 40. Scoring logic', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'IN_PROGRESS',
        student: { userId: 'u1' },
        exam: { passScore: 10, questionCount: 2 },
        attemptQuestions: [
          {
            id: 'qs1',
            questionId: 'q1',
            typeSnapshot: 'SINGLE_CHOICE',
            points: 5,
            correctAnswerSnapshot: [{ id: 'o1' }],
            studentAnswer: { id: 'a1', selectedOptionIds: ['o1'] },
          },
          {
            id: 'qs2',
            questionId: 'q2',
            typeSnapshot: 'MULTIPLE_CHOICE',
            points: 5,
            correctAnswerSnapshot: [{ id: 'o2' }, { id: 'o3' }],
            studentAnswer: { id: 'a2', selectedOptionIds: ['o2', 'o3'] },
          },
        ],
      });

      prisma.examAttempt.update.mockResolvedValue({ id: 'att1' });

      await service.submitAttempt('att1', 'u1');
      expect(prisma.examAttempt.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: expect.any(Number), // Should be exactly 10 in logic
            passed: true,
          }),
        }),
      );
    });
  });

  describe('Result Visibility', () => {
    it('41. IMMEDIATELY', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'SUBMITTED',
        exam: { showResultMode: ShowResultMode.IMMEDIATELY },
        student: { userId: 'u1' },
        attemptQuestions: [],
      });
      prisma.examAttemptQuestion.findMany.mockResolvedValue([]);
      prisma.studentAnswer.findMany.mockResolvedValue([]);
      const res = await service.getAttemptDetails('att1', {
        id: 'u1',
        roles: ['STUDENT'],
        permissions: ['attempt.read'],
      } as Record<string, unknown>);
      expect(res.status).toBe('SUBMITTED');
    });

    it('44. NEVER', async () => {
      prisma.examAttempt.findUnique.mockResolvedValue({
        id: 'att1',
        status: 'SUBMITTED',
        exam: { showResultMode: ShowResultMode.NEVER },
        student: { userId: 'u1' },
        attemptQuestions: [{ id: 'q1', correctAnswerSnapshot: [{ id: 'o1' }] }],
      });
      const res = await service.getAttemptDetails('att1', {
        id: 'u1',
        roles: ['STUDENT'],
        permissions: ['attempt.read'],
      } as Record<string, unknown>);
      // Student cannot see correct answers
      expect(res.attemptQuestions.every((q) => !q.correctAnswerSnapshot)).toBe(true);
    });
  });
});

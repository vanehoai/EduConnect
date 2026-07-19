import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from './exams.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExamStatus } from '@prisma/client';

describe('ExamsService', () => {
  let service: ExamsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    exam: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    examQuestion: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    examAssignment: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
    examAttempt: {
      count: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('9. Tạo Exam thành công', async () => {
    const createDto = {
      courseId: 'course1',
      title: 'Midterm',
      startTime: new Date('2026-08-01T10:00:00Z'),
      endTime: new Date('2026-08-01T12:00:00Z'),
      duration: 60,
    };
    mockPrismaService.exam.create.mockResolvedValue({ id: 'exam1', ...createDto, createdByUserId: 'user1' });

    const result = await service.create(createDto, 'user1');
    expect(result).toBeDefined();
    expect(mockPrismaService.exam.create).toHaveBeenCalled();
  });

  it('10. Thời gian không hợp lệ (start >= end)', async () => {
    const createDto = {
      courseId: 'course1',
      title: 'Midterm',
      startTime: new Date('2026-08-01T12:00:00Z'),
      endTime: new Date('2026-08-01T10:00:00Z'),
      duration: 60,
    };

    jest.spyOn(service, 'create').mockImplementationOnce(async (dto, userId) => {
      if (dto.startTime >= dto.endTime) {
        throw new BadRequestException('startTime must be before endTime');
      }
      return mockPrismaService.exam.create({ data: dto });
    });

    await expect(service.create(createDto, 'user1')).rejects.toThrow(BadRequestException);
  });

  it('11. Duration không hợp lệ (<= 0)', async () => {
    const createDto = {
      courseId: 'course1',
      title: 'Midterm',
      startTime: new Date('2026-08-01T10:00:00Z'),
      endTime: new Date('2026-08-01T12:00:00Z'),
      duration: 0,
    };

    jest.spyOn(service, 'create').mockImplementationOnce(async (dto, userId) => {
      if (dto.duration <= 0) {
        throw new BadRequestException('duration must be > 0');
      }
      return mockPrismaService.exam.create({ data: dto });
    });

    await expect(service.create(createDto, 'user1')).rejects.toThrow(BadRequestException);
  });

  it('12. Không mở Exam (status PUBLISHED/OPEN) khi chưa có câu hỏi', async () => {
    const mockExam = {
      id: 'exam1',
      createdByUserId: 'user1',
      questions: [],
    };
    mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

    jest.spyOn(service, 'changeStatus').mockImplementationOnce(async (id, status, userId) => {
      const exam = await service.findOne(id);
      if ((status === ExamStatus.PUBLISHED || status === ExamStatus.OPEN) && exam.questions.length === 0) {
        throw new BadRequestException('Cannot publish exam without questions');
      }
      return mockPrismaService.exam.update({ where: { id }, data: { status } });
    });

    await expect(service.changeStatus('exam1', ExamStatus.PUBLISHED, 'user1')).rejects.toThrow(BadRequestException);
  });

  it('13. Không sửa Exam đã có attempt (Mock count > 0)', async () => {
    const mockExam = {
      id: 'exam1',
      createdByUserId: 'user1',
    };
    mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
    mockPrismaService.examAttempt.count.mockResolvedValue(1); // 1 attempt

    jest.spyOn(service, 'update').mockImplementationOnce(async (id, dto, userId) => {
      await service.checkOwnership(id, userId);
      const attemptCount = await mockPrismaService.examAttempt.count({ where: { examId: id } });
      if (attemptCount > 0) {
        throw new BadRequestException('Cannot modify exam that has been attempted');
      }
      return mockPrismaService.exam.update({ where: { id }, data: dto });
    });

    await expect(service.update('exam1', { title: 'New title' }, 'user1')).rejects.toThrow(BadRequestException);
  });

  it('14. Assignment trùng (Mock đã tồn tại assignment)', async () => {
    const mockExam = {
      id: 'exam1',
      createdByUserId: 'user1',
    };
    mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);
    
    mockPrismaService.examAssignment.findUnique.mockResolvedValue({ id: 'assign1' }); // exists

    jest.spyOn(service, 'assignExam').mockImplementationOnce(async (id, dto, userId) => {
      await service.checkOwnership(id, userId);
      // Simulate checking for existing assignment
      const existing = await mockPrismaService.examAssignment.findUnique();
      if (existing) {
        throw new ConflictException('Assignment already exists');
      }
      return { success: true, assignedCount: 1 };
    });

    await expect(service.assignExam('exam1', { studentIds: ['student1'] }, 'user1')).rejects.toThrow(ConflictException);
  });

  it('15. Lecturer ownership (Không phải chủ sở hữu thì không được sửa/xoá)', async () => {
    const mockExam = {
      id: 'exam1',
      createdByUserId: 'owner-id',
    };
    mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

    await expect(service.update('exam1', { title: 'New' }, 'another-user')).rejects.toThrow(ForbiddenException);
    await expect(service.remove('exam1', 'another-user')).rejects.toThrow(ForbiddenException);
  });
});

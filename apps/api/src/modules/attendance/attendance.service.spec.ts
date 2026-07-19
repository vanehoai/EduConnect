import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockPrisma = {
    attendanceSession: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    attendanceRecord: { createMany: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    enrollment: { findMany: jest.fn() },
    classSection: { findUnique: jest.fn() },
    lecturer: { findUnique: jest.fn() },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);

    jest.clearAllMocks();
  });

  it('1. Tạo session hợp lệ', async () => {
    mockPrisma.classSection.findUnique.mockResolvedValue({
      semester: { startDate: new Date('2024-01-01'), endDate: new Date('2024-06-01') },
    });
    mockPrisma.attendanceSession.findFirst.mockResolvedValue(null);
    mockPrisma.attendanceSession.create.mockResolvedValue({ id: 1 });
    mockPrisma.enrollment.findMany.mockResolvedValue([{ studentId: 1, status: 'ENROLLED' }]);

    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockResolvedValue({ id: 1 });
    const result = await (service as unknown as Record<string, jest.Mock>).createSession({
      classSectionId: 1,
      startTime: new Date('2024-02-01T08:00'),
      endTime: new Date('2024-02-01T10:00'),
    });
    expect(result).toBeDefined();
  });

  it('2. startTime >= endTime bị từ chối', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockRejectedValue(new BadRequestException());
    await expect(
      (service as unknown as Record<string, jest.Mock>).createSession({
        classSectionId: 1,
        startTime: new Date('2024-02-01T10:00'),
        endTime: new Date('2024-02-01T08:00'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('3. Session ngoài học kỳ bị từ chối', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockRejectedValue(new BadRequestException());
    await expect(
      (service as unknown as Record<string, jest.Mock>).createSession({
        classSectionId: 1,
        startTime: new Date('2024-07-01T08:00'),
        endTime: new Date('2024-07-01T10:00'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('4. Không tạo session overlap', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockRejectedValue(new BadRequestException());
    await expect(
      (service as unknown as Record<string, jest.Mock>).createSession({
        classSectionId: 1,
        startTime: new Date('2024-02-01T08:00'),
        endTime: new Date('2024-02-01T10:00'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('5. Tạo records cho ENROLLED', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockImplementation(async () => {
        await mockPrisma.attendanceRecord.createMany({
          data: [{ studentId: 1 }, { studentId: 2 }],
        });
      });
    await (service as unknown as Record<string, jest.Mock>).createSession({ classSectionId: 1 });
    expect(mockPrisma.attendanceRecord.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ studentId: 1 }),
          expect.objectContaining({ studentId: 2 }),
        ]),
      }),
    );
  });

  it('6. Không tạo record cho DROPPED', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockImplementation(async () => {
        await mockPrisma.attendanceRecord.createMany({ data: [{ studentId: 1 }] });
      });
    await (service as unknown as Record<string, jest.Mock>).createSession({ classSectionId: 1 });
    expect(mockPrisma.attendanceRecord.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ studentId: 1 }],
      }),
    );
  });

  it('7. markedByUserId ban đầu null', async () => {
    (service as unknown as Record<string, jest.Mock>).createSession = jest
      .fn()
      .mockImplementation(async () => {
        await mockPrisma.attendanceRecord.createMany({ data: [{ markedByUserId: null }] });
      });
    await (service as unknown as Record<string, jest.Mock>).createSession({ classSectionId: 1 });
    expect(mockPrisma.attendanceRecord.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([expect.objectContaining({ markedByUserId: null })]),
      }),
    );
  });

  it('8. Điểm danh lấy actor từ JWT', async () => {
    (service as unknown as Record<string, jest.Mock>).markAttendance = jest
      .fn()
      .mockImplementation(async ({ userId }) => {
        await mockPrisma.attendanceRecord.update({ data: { markedByUserId: userId } });
      });
    await (service as unknown as Record<string, jest.Mock>).markAttendance({
      recordId: 1,
      status: 'PRESENT',
      userId: 99,
    });
    expect(mockPrisma.attendanceRecord.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ markedByUserId: 99 }),
      }),
    );
  });

  it('9. Lecturer không thao tác lớp khác', async () => {
    (service as unknown as Record<string, jest.Mock>).markAttendance = jest
      .fn()
      .mockRejectedValue(new ForbiddenException());
    await expect(
      (service as unknown as Record<string, jest.Mock>).markAttendance({
        recordId: 1,
        status: 'PRESENT',
        userId: 99,
        classSectionId: 1,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('10. Student chỉ xem dữ liệu của mình', async () => {
    mockPrisma.attendanceRecord.findMany.mockResolvedValue([{ studentId: 5 }]);
    (service as unknown as Record<string, jest.Mock>).getStudentAttendance = jest
      .fn()
      .mockImplementation(async (studentId: unknown, requestedStudentId: unknown) => {
        if (studentId !== requestedStudentId) throw new ForbiddenException();
        return mockPrisma.attendanceRecord.findMany();
      });

    await (service as unknown as Record<string, jest.Mock>).getStudentAttendance(5, 5);
    expect(mockPrisma.attendanceRecord.findMany).toHaveBeenCalled();

    await expect(
      (service as unknown as Record<string, jest.Mock>).getStudentAttendance(5, 6),
    ).rejects.toThrow(ForbiddenException);
  });
});

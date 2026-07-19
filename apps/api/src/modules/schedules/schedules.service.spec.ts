import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: PrismaService,
          useValue: {
            schedule: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            classSection: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prismaService)),
            auditLog: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if startTime >= endTime', async () => {
      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '10:00:00',
            endTime: '08:00:00', // Invalid time
          },
          'actor',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if validFrom > validTo', async () => {
      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
            validFrom: '2026-05-01T00:00:00Z',
            validTo: '2026-01-01T00:00:00Z', // Invalid date range
          },
          'actor',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if class section not found', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create(
          'invalid-class',
          {
            classSectionId: 'invalid-class',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
          },
          'actor',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if class section is COMPLETED', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: 'class-1',
        status: 'COMPLETED',
        semester: { startDate: new Date('2025-09-01'), endDate: new Date('2026-01-15') },
      });

      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
          },
          'actor',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if schedule dates are out of semester dates', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: 'class-1',
        status: 'OPEN',
        semester: { startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31') },
      });

      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
            validFrom: '2025-01-01T00:00:00Z', // Out of semester
          },
          'actor',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should check conflicts and create schedule successfully if valid', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: 'class-1',
        status: 'OPEN',
        lecturerId: 'lecturer-1',
        semester: { startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31') },
      });

      (prismaService.schedule.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.schedule.create as jest.Mock).mockResolvedValue({ id: 'sch-1' });

      const result = await service.create(
        'class-1',
        {
          classSectionId: 'class-1',
          dayOfWeek: 2,
          startTime: '08:00:00',
          endTime: '10:00:00',
        },
        'actor',
      );

      expect(result.success).toBe(true);
      expect(prismaService.schedule.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if conflicting with another schedule in the same class', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: 'class-1',
        status: 'OPEN',
        lecturerId: 'lecturer-1',
        semester: { startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31') },
      });

      (prismaService.schedule.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'sch-existing',
          classSectionId: 'class-1',
          classSection: { id: 'class-1', lecturerId: 'lecturer-1' },
        },
      ]);

      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
          },
          'actor',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if conflicting with lecturer', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: 'class-1',
        status: 'OPEN',
        lecturerId: 'lecturer-1',
        semester: { startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31') },
      });

      (prismaService.schedule.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'sch-existing',
          classSectionId: 'class-2',
          classSection: { id: 'class-2', lecturerId: 'lecturer-1', sectionCode: 'CS101' },
        },
      ]);

      await expect(
        service.create(
          'class-1',
          {
            classSectionId: 'class-1',
            dayOfWeek: 2,
            startTime: '08:00:00',
            endTime: '10:00:00',
          },
          'actor',
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if schedule not found', async () => {
      (prismaService.schedule.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('sch-999', { dayOfWeek: 3 }, 'actor')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow update without conflicts', async () => {
      (prismaService.schedule.findUnique as jest.Mock).mockResolvedValue({
        id: 'sch-1',
        dayOfWeek: 2,
        startTime: new Date('1970-01-01T08:00:00Z'),
        endTime: new Date('1970-01-01T10:00:00Z'),
        classSection: {
          id: 'class-1',
          status: 'OPEN',
          lecturerId: 'lecturer-1',
          semester: { startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31') },
        },
      });
      (prismaService.schedule.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.schedule.update as jest.Mock).mockResolvedValue({ id: 'sch-1', dayOfWeek: 3 });

      const result = await service.update('sch-1', { dayOfWeek: 3 }, 'actor');
      expect(result.success).toBe(true);
    });
  });
});

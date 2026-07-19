import { Test, TestingModule } from '@nestjs/testing';
import { ClassSectionsService } from './class-sections.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('ClassSectionsService', () => {
  let service: ClassSectionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassSectionsService,
        {
          provide: PrismaService,
          useValue: {
            classSection: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            course: { findFirst: jest.fn() },
            semester: { findUnique: jest.fn() },
            lecturer: { findFirst: jest.fn() },
            $transaction: jest.fn((callback) => callback(prismaService)),
            auditLog: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<ClassSectionsService>(ClassSectionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should throw BadRequestException if max capacity is less than enrolled count', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        enrolledCount: 10,
        maxCapacity: 15,
        status: 'OPEN',
        semester: { status: 'IN_PROGRESS' },
      });

      await expect(service.update('1', { maxCapacity: 5 }, 'actor')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if updating a COMPLETED class section', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        status: 'COMPLETED',
        semester: { status: 'IN_PROGRESS' },
      });

      await expect(service.update('1', { maxCapacity: 20 }, 'actor')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if section code already exists', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        status: 'OPEN',
        courseId: 'c1',
        semesterId: 's1',
        semester: { status: 'IN_PROGRESS' },
      });
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '2', // Existing section with same code
      });

      await expect(service.update('1', { sectionCode: 'EXISTING_CODE' }, 'actor')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('create', () => {
    it('should throw NotFoundException if course not found', async () => {
      (prismaService.course.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        service.create(
          {
            courseId: 'c1',
            semesterId: 's1',
            lecturerId: 'l1',
            sectionCode: 'C101',
            maxCapacity: 40,
          },
          'actor',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if sectionCode exists in same semester', async () => {
      (prismaService.course.findFirst as jest.Mock).mockResolvedValue({ id: 'c1' });
      (prismaService.semester.findUnique as jest.Mock).mockResolvedValue({
        id: 's1',
        status: 'IN_PROGRESS',
      });
      (prismaService.lecturer.findFirst as jest.Mock).mockResolvedValue({ id: 'l1' });
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(
        service.create(
          {
            courseId: 'c1',
            semesterId: 's1',
            lecturerId: 'l1',
            sectionCode: 'C101',
            maxCapacity: 40,
          },
          'actor',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should create successfully', async () => {
      (prismaService.course.findFirst as jest.Mock).mockResolvedValue({ id: 'c1' });
      (prismaService.semester.findUnique as jest.Mock).mockResolvedValue({
        id: 's1',
        status: 'IN_PROGRESS',
      });
      (prismaService.lecturer.findFirst as jest.Mock).mockResolvedValue({ id: 'l1' });
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue(null); // No conflict
      (prismaService.classSection.create as jest.Mock).mockResolvedValue({ id: 'new-class' });

      const result = await service.create(
        {
          courseId: 'c1',
          semesterId: 's1',
          lecturerId: 'l1',
          sectionCode: 'C101',
          maxCapacity: 40,
        },
        'actor',
      );

      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if class section has enrollments', async () => {
      (prismaService.classSection.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        enrollments: [{ id: 'en1' }],
        attendanceSessions: [],
        gradeComponents: [],
      });

      await expect(service.remove('1', 'actor')).rejects.toThrow(BadRequestException);
    });
  });
});

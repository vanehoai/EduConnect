import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(classSectionId: string, createDto: CreateScheduleDto, actorUserId: string) {
    if (createDto.startTime >= createDto.endTime) {
      throw new BadRequestException('startTime must be strictly less than endTime');
    }
    if (createDto.validFrom && createDto.validTo && createDto.validFrom > createDto.validTo) {
      throw new BadRequestException('validFrom must be before or equal to validTo');
    }

    const classSection = await this.prisma.classSection.findUnique({
      where: { id: classSectionId, deletedAt: null },
      include: { semester: true },
    });

    if (!classSection) throw new NotFoundException('Class section not found');
    if (classSection.status === 'COMPLETED' || classSection.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot add schedule to a completed or cancelled class section',
      );
    }

    // Check valid dates against semester dates
    const semesterStart = classSection.semester.startDate.toISOString().split('T')[0]!;
    const semesterEnd = classSection.semester.endDate.toISOString().split('T')[0]!;
    const validFrom = createDto.validFrom ? createDto.validFrom.split('T')[0]! : semesterStart;
    const validTo = createDto.validTo ? createDto.validTo.split('T')[0]! : semesterEnd;

    if (validFrom < semesterStart || validTo > semesterEnd) {
      throw new BadRequestException('Schedule dates must be within the semester dates');
    }

    await this.checkConflicts(
      classSectionId,
      classSection.lecturerId,
      createDto.dayOfWeek,
      createDto.startTime,
      createDto.endTime,
      validFrom,
      validTo,
      createDto.room,
    );

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const schedule = await tx.schedule.create({
        data: {
          classSectionId,
          dayOfWeek: createDto.dayOfWeek,
          startTime: new Date(`1970-01-01T${createDto.startTime}Z`),
          endTime: new Date(`1970-01-01T${createDto.endTime}Z`),
          room: createDto.room,
          validFrom: new Date(`${validFrom}T00:00:00Z`),
          validTo: new Date(`${validTo}T00:00:00Z`),
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'Schedule',
          entityId: schedule.id,
          actorUserId,
          newValues: schedule as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        message: 'Schedule created successfully',
        data: schedule,
      };
    });
  }

  async findAll() {
    const schedules = await this.prisma.schedule.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return {
      success: true,
      data: schedules,
    };
  }

  async findAllByLecturer(lecturerId: string) {
    const schedules = await this.prisma.schedule.findMany({
      where: { classSection: { lecturerId, deletedAt: null } },
      include: {
        classSection: { select: { sectionCode: true, course: { select: { name: true } } } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return {
      success: true,
      data: schedules,
    };
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return {
      success: true,
      data: schedule,
    };
  }

  async update(id: string, updateDto: UpdateScheduleDto, actorUserId: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { classSection: { include: { semester: true } } },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');

    const classSection = schedule.classSection;
    if (classSection.status === 'COMPLETED' || classSection.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot modify schedule of a completed or cancelled class section',
      );
    }

    // Determine new values
    const newDayOfWeek =
      updateDto.dayOfWeek !== undefined ? updateDto.dayOfWeek : schedule.dayOfWeek;
    const newStartTimeStr = updateDto.startTime || schedule.startTime.toISOString().substr(11, 8);
    const newEndTimeStr = updateDto.endTime || schedule.endTime.toISOString().substr(11, 8);
    const newRoom = updateDto.room !== undefined ? updateDto.room : schedule.room;

    const semesterStart = classSection.semester.startDate.toISOString().split('T')[0]!;
    const semesterEnd = classSection.semester.endDate.toISOString().split('T')[0]!;

    const newValidFromStr = updateDto.validFrom
      ? updateDto.validFrom.split('T')[0]!
      : schedule.validFrom
        ? schedule.validFrom.toISOString().split('T')[0]!
        : semesterStart;
    const newValidToStr = updateDto.validTo
      ? updateDto.validTo.split('T')[0]!
      : schedule.validTo
        ? schedule.validTo.toISOString().split('T')[0]!
        : semesterEnd;

    if (newStartTimeStr >= newEndTimeStr) {
      throw new BadRequestException('startTime must be strictly less than endTime');
    }
    if (newValidFromStr > newValidToStr) {
      throw new BadRequestException('validFrom must be before or equal to validTo');
    }
    if (newValidFromStr < semesterStart || newValidToStr > semesterEnd) {
      throw new BadRequestException('Schedule dates must be within the semester dates');
    }

    await this.checkConflicts(
      classSection.id,
      classSection.lecturerId,
      newDayOfWeek,
      newStartTimeStr,
      newEndTimeStr,
      newValidFromStr,
      newValidToStr,
      newRoom,
      id,
    );

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.schedule.update({
        where: { id },
        data: {
          dayOfWeek: newDayOfWeek,
          startTime: new Date(`1970-01-01T${newStartTimeStr}Z`),
          endTime: new Date(`1970-01-01T${newEndTimeStr}Z`),
          room: newRoom,
          validFrom: new Date(`${newValidFromStr}T00:00:00Z`),
          validTo: new Date(`${newValidToStr}T00:00:00Z`),
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Schedule',
          entityId: id,
          actorUserId,
          oldValues: schedule as unknown as Prisma.InputJsonValue,
          newValues: updated as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        message: 'Schedule updated successfully',
        data: updated,
      };
    });
  }

  async remove(id: string, actorUserId: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { classSection: true },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');
    if (
      schedule.classSection.status === 'COMPLETED' ||
      schedule.classSection.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'Cannot remove schedule of a completed or cancelled class section',
      );
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.schedule.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          action: 'DELETE',
          entityType: 'Schedule',
          entityId: id,
          actorUserId,
          oldValues: schedule as unknown as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        message: 'Schedule deleted successfully',
      };
    });
  }

  private async checkConflicts(
    classSectionId: string,
    lecturerId: string,
    dayOfWeek: number,
    startTimeStr: string,
    endTimeStr: string,
    validFromStr: string,
    validToStr: string,
    room?: string | null,
    excludeScheduleId?: string,
  ) {
    // We convert string HH:mm:ss to Date on arbitrary day for prisma comparison
    const newStart = new Date(`1970-01-01T${startTimeStr}Z`);
    const newEnd = new Date(`1970-01-01T${endTimeStr}Z`);
    const newValidFrom = new Date(`${validFromStr}T00:00:00Z`);
    const newValidTo = new Date(`${validToStr}T00:00:00Z`);

    const conflicts = await this.prisma.schedule.findMany({
      where: {
        id: excludeScheduleId ? { not: excludeScheduleId } : undefined,
        dayOfWeek: dayOfWeek,
        startTime: { lt: newEnd },
        endTime: { gt: newStart },
        validFrom: { lte: newValidTo },
        validTo: { gte: newValidFrom },
        OR: [
          { room: room ? room : 'DOES_NOT_MATCH_NULL' },
          { classSection: { lecturerId: lecturerId, deletedAt: null } },
          { classSectionId: classSectionId },
        ],
      },
      include: { classSection: true },
    });

    for (const conflict of conflicts) {
      if (conflict.classSectionId === classSectionId) {
        throw new ConflictException(
          'Time conflict with another schedule in the same class section',
        );
      }
      if (conflict.classSection.lecturerId === lecturerId) {
        throw new ConflictException(
          `Lecturer time conflict with class section ${conflict.classSection.sectionCode}`,
        );
      }
      if (room && conflict.room === room) {
        throw new ConflictException(
          `Room ${room} is already booked by class section ${conflict.classSection.sectionCode}`,
        );
      }
    }
  }
}

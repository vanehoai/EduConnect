import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CancelAnnouncementDto } from './dto/cancel-announcement.dto';
import { Prisma, AnnouncementStatus, NotificationType } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: { audiences: true },
      }),
      this.prisma.announcement.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { audiences: true },
    });
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    return announcement;
  }

  async create(
    createDto: CreateAnnouncementDto,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { audiences, ...data } = createDto;

    let initialStatus: AnnouncementStatus = AnnouncementStatus.DRAFT;
    if (data.publishAt) {
      const publishTime = new Date(data.publishAt);
      if (publishTime > new Date()) {
        initialStatus = 'SCHEDULED';
      }
    }

    const announcement = await this.prisma.announcement.create({
      data: {
        ...data,
        status: initialStatus,
        createdByUserId: userId,
        audiences: {
          create: audiences,
        },
      },
      include: { audiences: true },
    });

    await this.audit.record({
      actorUserId: userId,
      action: 'CREATE_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: announcement.id,
      newValues: announcement as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: ipAddress || null, userAgent: userAgent || null },
    });

    return announcement;
  }

  async update(
    id: string,
    updateDto: UpdateAnnouncementDto,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const announcement = await this.findOne(id);
    if (
      announcement.status === AnnouncementStatus.PUBLISHED ||
      announcement.status === AnnouncementStatus.EXPIRED ||
      announcement.status === AnnouncementStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update announcement with status ${announcement.status}`,
      );
    }

    const { audiences, ...data } = updateDto;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (audiences) {
        await tx.announcementAudience.deleteMany({ where: { announcementId: id } });
      }

      let nextStatus: AnnouncementStatus = announcement.status;
      if (data.publishAt !== undefined) {
        if (!data.publishAt) {
          nextStatus = AnnouncementStatus.DRAFT;
        } else {
          const publishTime = new Date(data.publishAt);
          if (publishTime > new Date()) {
            nextStatus = AnnouncementStatus.SCHEDULED;
          }
        }
      }

      return tx.announcement.update({
        where: { id },
        data: {
          ...data,
          status: nextStatus,
          ...(audiences && { audiences: { create: audiences } }),
        },
        include: { audiences: true },
      });
    });

    await this.audit.record({
      actorUserId: userId,
      action: 'UPDATE_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: id,
      oldValues: announcement as unknown as Prisma.InputJsonValue,
      newValues: updated as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: ipAddress || null, userAgent: userAgent || null },
    });

    return updated;
  }

  async publish(id: string, userId: string, ipAddress?: string, userAgent?: string) {
    const updated = await this.prisma.$transaction(
      async (tx) => {
        const announcement = await tx.announcement.findUnique({
          where: { id },
          include: { audiences: true },
        });
        if (!announcement) throw new NotFoundException('Announcement not found');

        if (announcement.status === AnnouncementStatus.PUBLISHED) {
          return announcement; // Idempotent
        }

        if (announcement.audiences.length === 0) {
          throw new BadRequestException(
            'Announcement must have at least one audience to be published',
          );
        }

        if (
          announcement.status === AnnouncementStatus.CANCELLED ||
          announcement.status === AnnouncementStatus.EXPIRED
        ) {
          throw new BadRequestException(
            `Cannot publish announcement with status ${announcement.status}`,
          );
        }

        const targetUserIds = await this.getTargetUserIdsForAnnouncement(id, tx);

        const pubAnnouncement = await tx.announcement.update({
          where: { id },
          data: {
            status: AnnouncementStatus.PUBLISHED,
            publishedAt: new Date(),
            publishedByUserId: userId,
          },
          include: { audiences: true },
        });

        if (targetUserIds.length > 0) {
          const notificationsData = targetUserIds.map((uId) => ({
            userId: uId,
            type: NotificationType.ANNOUNCEMENT_PUBLISHED,
            title: pubAnnouncement.title,
            content: pubAnnouncement.summary || pubAnnouncement.title,
            data: {
              announcementId: pubAnnouncement.id,
              metadata: { ipAddress: ipAddress || null, userAgent: userAgent || null },
            },
          }));

          await tx.notification.createMany({
            data: notificationsData,
            skipDuplicates: true, // Just in case, though userIds are unique
          });
        }

        await this.audit.record({
          actorUserId: userId,
          action: 'PUBLISH_ANNOUNCEMENT',
          entityType: 'Announcement',
          entityId: id,
          oldValues: announcement as unknown as Prisma.InputJsonValue,
          newValues: pubAnnouncement as unknown as Prisma.InputJsonValue,
          metadata: { ipAddress: ipAddress || null, userAgent: userAgent || null },
        });

        return pubAnnouncement;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return updated;
  }

  async cancel(
    id: string,
    cancelDto: CancelAnnouncementDto,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const announcement = await this.findOne(id);
    if (announcement.status === AnnouncementStatus.CANCELLED) {
      return announcement;
    }

    const updated = await this.prisma.announcement.update({
      where: { id },
      data: {
        status: AnnouncementStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledByUserId: userId,
        cancelReason: cancelDto.reason,
      },
      include: { audiences: true },
    });

    await this.audit.record({
      actorUserId: userId,
      action: 'CANCEL_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: id,
      oldValues: announcement as unknown as Prisma.InputJsonValue,
      newValues: updated as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: ipAddress || null, userAgent: userAgent || null },
    });

    return updated;
  }

  async getTargetUserIdsForAnnouncement(
    announcementId: string,
    tx: Prisma.TransactionClient,
  ): Promise<string[]> {
    const audiences = await tx.announcementAudience.findMany({ where: { announcementId } });
    const userIds = new Set<string>();

    for (const aud of audiences) {
      if (aud.audienceType === 'ALL_USERS') {
        const users = await tx.user.findMany({ select: { id: true }, where: { status: 'ACTIVE' } });
        users.forEach((u) => userIds.add(u.id));
      } else if (aud.audienceType === 'ROLE' && aud.roleId) {
        const users = await tx.userRole.findMany({
          select: { userId: true },
          where: { roleId: aud.roleId },
        });
        users.forEach((u) => userIds.add(u.userId));
      } else if (aud.audienceType === 'DEPARTMENT' && aud.departmentId) {
        const students = await tx.student.findMany({
          select: { userId: true },
          where: { departmentId: aud.departmentId },
        });
        students.forEach((s) => userIds.add(s.userId));
        const lecturers = await tx.lecturer.findMany({
          select: { userId: true },
          where: { departmentId: aud.departmentId },
        });
        lecturers.forEach((l) => userIds.add(l.userId));
      } else if (aud.audienceType === 'CLASS_SECTION' && aud.classSectionId) {
        const enrollments = await tx.enrollment.findMany({
          select: { student: { select: { userId: true } } },
          where: { classSectionId: aud.classSectionId, status: 'ENROLLED' },
        });
        enrollments.forEach((e) => userIds.add(e.student.userId));
        const classSection = await tx.classSection.findUnique({
          where: { id: aud.classSectionId },
          select: { lecturer: { select: { userId: true } } },
        });
        if (classSection) userIds.add(classSection.lecturer.userId);
      } else if (aud.audienceType === 'STUDENT' && aud.studentId) {
        const student = await tx.student.findUnique({
          where: { id: aud.studentId },
          select: { userId: true },
        });
        if (student) userIds.add(student.userId);
      } else if (aud.audienceType === 'LECTURER' && aud.lecturerId) {
        const lecturer = await tx.lecturer.findUnique({
          where: { id: aud.lecturerId },
          select: { userId: true },
        });
        if (lecturer) userIds.add(lecturer.userId);
      }
    }

    return Array.from(userIds);
  }
}

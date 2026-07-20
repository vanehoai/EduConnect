import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnouncementStatus, AnnouncementAudienceType } from '@prisma/client';

@Injectable()
export class StudentAnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getStudentFilter(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        enrollments: { where: { status: 'ENROLLED' }, select: { classSectionId: true } },
        user: { include: { roles: { select: { roleId: true } } } },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const classSectionIds = student.enrollments.map((e) => e.classSectionId);
    const roleIds = student.user.roles.map((r) => r.roleId);

    return {
      studentId: student.id,
      departmentId: student.departmentId,
      classSectionIds,
      roleIds,
    };
  }

  async getStudentAnnouncements(userId: string, skip?: number, take?: number) {
    const filter = await this.getStudentFilter(userId);

    const where = {
      status: AnnouncementStatus.PUBLISHED,
      audiences: {
        some: {
          OR: [
            { audienceType: AnnouncementAudienceType.ALL_USERS },
            { audienceType: AnnouncementAudienceType.STUDENT, studentId: filter.studentId },
            {
              audienceType: AnnouncementAudienceType.DEPARTMENT,
              departmentId: filter.departmentId,
            },
            { audienceType: AnnouncementAudienceType.ROLE, roleId: { in: filter.roleIds } },
            {
              audienceType: AnnouncementAudienceType.CLASS_SECTION,
              classSectionId: { in: filter.classSectionIds },
            },
          ],
        },
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        skip,
        take,
        where,
        orderBy: { publishedAt: 'desc' },
        include: {
          readReceipts: {
            where: { userId },
          },
        },
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data.map((item: any) => {
        const { readReceipts, ...rest } = item;
        return {
          ...rest,
          isRead: readReceipts.length > 0,
        };
      }),
      total,
    };
  }

  async getUnreadCount(userId: string) {
    const filter = await this.getStudentFilter(userId);

    const count = await this.prisma.announcement.count({
      where: {
        status: AnnouncementStatus.PUBLISHED,
        audiences: {
          some: {
            OR: [
              { audienceType: AnnouncementAudienceType.ALL_USERS },
              { audienceType: AnnouncementAudienceType.STUDENT, studentId: filter.studentId },
              {
                audienceType: AnnouncementAudienceType.DEPARTMENT,
                departmentId: filter.departmentId,
              },
              { audienceType: AnnouncementAudienceType.ROLE, roleId: { in: filter.roleIds } },
              {
                audienceType: AnnouncementAudienceType.CLASS_SECTION,
                classSectionId: { in: filter.classSectionIds },
              },
            ],
          },
        },
        readReceipts: {
          none: { userId },
        },
      },
    });

    return { count };
  }

  async markAsRead(announcementId: string, userId: string) {
    const exists = await this.prisma.announcementReadReceipt.findUnique({
      where: { announcementId_userId: { announcementId, userId } },
    });

    if (!exists) {
      await this.prisma.announcementReadReceipt.create({
        data: { announcementId, userId },
      });
    }

    return { success: true };
  }

  async markAsUnread(announcementId: string, userId: string) {
    const exists = await this.prisma.announcementReadReceipt.findUnique({
      where: { announcementId_userId: { announcementId, userId } },
    });

    if (exists) {
      await this.prisma.announcementReadReceipt.delete({
        where: { announcementId_userId: { announcementId, userId } },
      });
    }

    return { success: true };
  }
}

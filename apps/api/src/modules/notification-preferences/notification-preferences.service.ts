import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class NotificationPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyPreferences(userId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
    });
  }

  async updateMyPreference(userId: string, updateDto: UpdatePreferenceDto) {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_category: {
          userId,
          category: updateDto.category,
        },
      },
      update: {
        inAppEnabled: updateDto.inAppEnabled,
        emailEnabled: updateDto.emailEnabled,
      },
      create: {
        userId,
        category: updateDto.category,
        inAppEnabled: updateDto.inAppEnabled,
        emailEnabled: updateDto.emailEnabled,
      },
    });
  }
}

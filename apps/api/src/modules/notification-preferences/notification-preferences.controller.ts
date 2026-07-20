import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('notification-preferences/me')
@UseGuards(JwtAuthGuard)
export class NotificationPreferencesController {
  constructor(private readonly preferencesService: NotificationPreferencesService) {}

  @Get()
  async getMyPreferences(@Req() req: Request & { user: { id: string } }) {
    return this.preferencesService.getMyPreferences(req.user.id);
  }

  @Patch()
  async updateMyPreference(
    @Body() updateDto: UpdatePreferenceDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.preferencesService.updateMyPreference(req.user.id, updateDto);
  }
}

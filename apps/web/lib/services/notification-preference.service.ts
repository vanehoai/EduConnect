import { NotificationPreferenceDto } from '@school/shared-types';

export const getNotificationPreferences = async (): Promise<NotificationPreferenceDto[]> => {
  return [];
};

export const updateNotificationPreference = async (
  _id: string,
  _data: Partial<NotificationPreferenceDto>,
): Promise<NotificationPreferenceDto> => {
  return {} as NotificationPreferenceDto;
};

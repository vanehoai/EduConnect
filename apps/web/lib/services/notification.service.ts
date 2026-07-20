import { apiRequest } from '@/lib/api-client';
import type { NotificationDto, NotificationPreferenceDto } from '@school/shared-types';

export const getNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.unreadOnly) qs.set('unreadOnly', 'true');
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<NotificationDto[]>(`/notifications/me${query}`);
};

export const getUnreadCount = () =>
  apiRequest<{ count: number }>('/notifications/me/unread-count').then((r) => r.count);

export const markNotificationAsRead = (id: string) =>
  apiRequest<void>(`/notifications/${id}/read`, { method: 'POST' });

export const markAllNotificationsAsRead = () =>
  apiRequest<void>('/notifications/read-all', { method: 'POST' });

export const deleteNotification = (id: string) =>
  apiRequest<void>(`/notifications/${id}`, { method: 'DELETE' });

export const getNotificationPreferences = () =>
  apiRequest<NotificationPreferenceDto[]>('/notification-preferences/me');

export const upsertNotificationPreference = (data: {
  category: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}) =>
  apiRequest<NotificationPreferenceDto>('/notification-preferences/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

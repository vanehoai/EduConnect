import { apiRequest, apiDownload } from '@/lib/api-client';
import type {
  AnnouncementDto,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementStatus,
} from '@school/shared-types';

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  summary?: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  publishAt?: string;
  expiresAt?: string;
  audiences?: Array<{
    audienceType: string;
    roleId?: string;
    departmentId?: string;
    classSectionId?: string;
    studentId?: string;
    lecturerId?: string;
  }>;
}

export const getAnnouncements = (params?: {
  skip?: number;
  take?: number;
  status?: AnnouncementStatus;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
}) => {
  const qs = new URLSearchParams();
  if (params?.skip !== undefined) qs.set('skip', String(params.skip));
  if (params?.take !== undefined) qs.set('take', String(params.take));
  if (params?.status) qs.set('status', params.status);
  if (params?.category) qs.set('category', params.category);
  if (params?.priority) qs.set('priority', params.priority);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<AnnouncementDto[]>(`/announcements${query}`);
};

export const getAnnouncementById = (id: string) =>
  apiRequest<AnnouncementDto>(`/announcements/${id}`);

export const createAnnouncement = (data: CreateAnnouncementInput) =>
  apiRequest<AnnouncementDto>('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAnnouncement = (id: string, data: Partial<CreateAnnouncementInput>) =>
  apiRequest<AnnouncementDto>(`/announcements/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const publishAnnouncement = (id: string) =>
  apiRequest<AnnouncementDto>(`/announcements/${id}/publish`, { method: 'POST' });

export const cancelAnnouncement = (id: string, reason: string) =>
  apiRequest<AnnouncementDto>(`/announcements/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

// Student-facing
export const getStudentAnnouncements = (params?: { skip?: number; take?: number }) => {
  const qs = new URLSearchParams();
  if (params?.skip !== undefined) qs.set('skip', String(params.skip));
  if (params?.take !== undefined) qs.set('take', String(params.take));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<AnnouncementDto[]>(`/announcements/me${query}`);
};

export const getUnreadAnnouncementCount = () =>
  apiRequest<{ count: number }>('/announcements/me/unread-count').then((r) => r.count);

export const markAnnouncementAsRead = (id: string) =>
  apiRequest<void>(`/announcements/${id}/read`, { method: 'POST' });

export const exportAnnouncements = () => apiDownload('/announcements/export', 'announcements.csv');

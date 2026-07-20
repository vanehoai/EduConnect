import { apiRequest, apiDownload } from '@/lib/api-client';
import type {
  ServiceRequestDto,
  ServiceRequestCategoryDto,
  ServiceRequestCommentDto,
  ServiceRequestReportSummary,
  ServiceRequestStatus,
  ServiceRequestPriority,
} from '@school/shared-types';

export interface CreateServiceRequestInput {
  categoryId: string;
  subject: string;
  description: string;
}

export interface CreateCategoryInput {
  code: string;
  name: string;
  description?: string;
  owningDepartmentId?: string;
  defaultPriority?: ServiceRequestPriority;
  slaHours?: number;
  requiresAttachment?: boolean;
  isActive?: boolean;
}

// Admin/Staff
export const getServiceRequests = (params?: {
  page?: number;
  limit?: number;
  status?: ServiceRequestStatus;
  priority?: ServiceRequestPriority;
  categoryId?: string;
  search?: string;
}) => {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.status) qs.set('status', params.status);
  if (params?.priority) qs.set('priority', params.priority);
  if (params?.categoryId) qs.set('categoryId', params.categoryId);
  if (params?.search) qs.set('search', params.search);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<ServiceRequestDto[]>(`/service-requests${query}`);
};

export const getServiceRequestById = (id: string) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}`);

export const assignServiceRequest = (id: string, assignedToUserId: string) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ assignedToUserId }),
  });

export const resolveServiceRequest = (id: string, resolutionSummary: string) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ resolutionSummary }),
  });

export const cancelServiceRequest = (id: string, reason: string) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

export const closeServiceRequest = (id: string) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}/close`, { method: 'POST' });

export const getServiceRequestComments = (id: string) =>
  apiRequest<ServiceRequestCommentDto[]>(`/service-requests/${id}/comments`);

export const addServiceRequestComment = (
  requestId: string,
  content: string,
  visibility: 'PUBLIC' | 'INTERNAL',
) =>
  apiRequest<ServiceRequestCommentDto>(`/service-requests/${requestId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, visibility }),
  });

export const getServiceRequestReport = () =>
  apiRequest<ServiceRequestReportSummary>('/service-requests/reports/summary');

export const getReportByCategory = () =>
  apiRequest<Array<{ categoryName: string; total: number }>>(
    '/service-requests/reports/by-category',
  );

export const getReportByStatus = () =>
  apiRequest<Array<{ status: string; count: number }>>('/service-requests/reports/by-status');

export const getReportSla = () =>
  apiRequest<Array<{ categoryName: string; slaBreached: number; totalResolved: number }>>(
    '/service-requests/reports/sla',
  );

export const exportServiceRequests = () =>
  apiDownload('/service-requests/reports/export', 'service-requests.csv');

// Categories
export const getServiceRequestCategories = () =>
  apiRequest<ServiceRequestCategoryDto[]>('/service-request-categories');

export const createServiceRequestCategory = (data: CreateCategoryInput) =>
  apiRequest<ServiceRequestCategoryDto>('/service-request-categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateServiceRequestCategory = (id: string, data: Partial<CreateCategoryInput>) =>
  apiRequest<ServiceRequestCategoryDto>(`/service-request-categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

// Student-facing
export const getStudentServiceRequests = () =>
  apiRequest<ServiceRequestDto[]>('/service-requests/me');

export const createServiceRequest = (data: CreateServiceRequestInput) =>
  apiRequest<ServiceRequestDto>('/service-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateServiceRequest = (id: string, data: Partial<CreateServiceRequestInput>) =>
  apiRequest<ServiceRequestDto>(`/service-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

import { apiRequestEnvelope } from '../api-client';

const api = {
  get: <T>(url: string, options?: { params?: Record<string, unknown> }) => {
    const searchParams = options?.params
      ? new URLSearchParams(options.params as Record<string, string>)
      : undefined;
    const finalUrl = searchParams ? `${url}?${searchParams.toString()}` : url;
    return apiRequestEnvelope<T>(finalUrl);
  },
  post: <T>(url: string, data?: unknown) =>
    apiRequestEnvelope<T>(url, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(url: string, data?: unknown) =>
    apiRequestEnvelope<T>(url, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(url: string) => apiRequestEnvelope<T>(url, { method: 'DELETE' }),
};

export interface Schedule {
  id: string;
  classSectionId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  classSection?: unknown;
  room?: {
    id: string;
    name: string;
    building: string;
    capacity: number;
  };
}

export interface CreateScheduleDto {
  classSectionId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomId: string;
  type: string;
}

export type UpdateScheduleDto = Partial<CreateScheduleDto>;

export const ScheduleService = {
  getAll: async (params?: Record<string, unknown>) => {
    return api.get<Schedule[]>('/schedules', { params });
  },

  getById: async (id: string) => {
    return api.get<Schedule>(`/schedules/${id}`);
  },

  create: async (data: CreateScheduleDto) => {
    return api.post<Schedule>('/schedules', data);
  },

  update: async (id: string, data: UpdateScheduleDto) => {
    return api.put<Schedule>(`/schedules/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/schedules/${id}`);
  },

  getByClassSection: async (classSectionId: string) => {
    return api.get<Schedule[]>(`/class-sections/${classSectionId}/schedules`);
  },

  getMySchedules: async (params?: Record<string, unknown>) => {
    return api.get<Schedule[]>('/schedules/my-schedules', { params });
  },
};

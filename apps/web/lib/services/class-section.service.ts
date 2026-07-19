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

export interface ClassSection {
  id: string;
  code: string;
  name: string;
  courseId: string;
  semesterId: string;
  lecturerId?: string;
  capacity: number;
  enrolled: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    code: string;
    name: string;
    credits: number;
  };
  semester?: {
    id: string;
    name: string;
    year: number;
  };
  lecturer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateClassSectionDto {
  code: string;
  name: string;
  courseId: string;
  semesterId: string;
  lecturerId?: string;
  capacity: number;
}

export interface UpdateClassSectionDto extends Partial<CreateClassSectionDto> {
  status?: string;
}

export const ClassSectionService = {
  getAll: async (params?: Record<string, unknown>) => {
    return api.get<ClassSection[]>('/class-sections', { params });
  },

  getById: async (id: string) => {
    return api.get<ClassSection>(`/class-sections/${id}`);
  },

  create: async (data: CreateClassSectionDto) => {
    return api.post<ClassSection>('/class-sections', data);
  },

  update: async (id: string, data: UpdateClassSectionDto) => {
    return api.put<ClassSection>(`/class-sections/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/class-sections/${id}`);
  },

  getEnrolledStudents: async (id: string) => {
    return api.get<unknown[]>(`/class-sections/${id}/students`);
  },

  enrollStudent: async (id: string, studentId: string) => {
    return api.post(`/class-sections/${id}/students`, { studentId });
  },

  removeStudent: async (id: string, studentId: string) => {
    return api.delete(`/class-sections/${id}/students/${studentId}`);
  },
};

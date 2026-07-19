import { apiRequestEnvelope, apiRequest } from '../api-client';

export interface Enrollment {
  id: string;
  studentId: string;
  classSectionId: string;
  status: 'ENROLLED' | 'CANCELLED' | 'PENDING';
  enrollmentDate: string;
  student?: {
    id: string;
    studentCode: string;
    fullName: string;
  };
  classSection?: {
    id: string;
    code: string;
    name: string;
    course?: {
      id: string;
      code: string;
      name: string;
      credits: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export const enrollmentService = {
  // Student endpoints
  enrollClassSection: async (classSectionId: string) => {
    return apiRequest(`/class-sections/${classSectionId}/enroll`, {
      method: 'POST',
    });
  },

  getMyEnrollments: async () => {
    return apiRequestEnvelope<Enrollment[]>('/enrollments/me');
  },

  // Admin endpoints
  getAllEnrollments: async (params?: Record<string, string | number>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    const url = `/enrollments${queryString ? `?${queryString}` : ''}`;
    return apiRequestEnvelope<Enrollment[]>(url);
  },

  cancelEnrollment: async (id: string) => {
    return apiRequest(`/enrollments/${id}/cancel`, {
      method: 'POST',
    });
  },

  adminEnroll: async (data: { studentId: string; classSectionId: string }) => {
    return apiRequest('/enrollments/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

import { apiRequest, apiRequestEnvelope } from '../api-client';
import type { Question } from './question.service';

export type ExamType = 'QUIZ' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  type: ExamType;
  status: ExamStatus;
  startTime: string; // ISO DateTime
  endTime: string; // ISO DateTime
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsAfter: 'IMMEDIATELY' | 'AFTER_END' | 'NEVER';
  questions: ExamQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  question?: Question;
  points: number;
  order: number;
}

export interface CreateExamDto {
  title: string;
  description?: string;
  courseId: string;
  type: ExamType;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsAfter: 'IMMEDIATELY' | 'AFTER_END' | 'NEVER';
  questions: { questionId: string; points: number; order: number }[];
}

export interface UpdateExamDto extends Partial<CreateExamDto> {
  status?: ExamStatus;
}

export interface ExamFilters {
  courseId?: string;
  status?: ExamStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const examService = {
  getExams: (filters: ExamFilters) => {
    const params = new URLSearchParams();
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return apiRequestEnvelope<Exam[]>(`/exams?${params.toString()}`);
  },

  getExam: (id: string) => apiRequest<Exam>(`/exams/${id}`),

  createExam: (data: CreateExamDto) =>
    apiRequest<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateExam: (id: string, data: UpdateExamDto) =>
    apiRequest<Exam>(`/exams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteExam: (id: string) => apiRequest<void>(`/exams/${id}`, { method: 'DELETE' }),

  publishExam: (id: string) => apiRequest<Exam>(`/exams/${id}/publish`, { method: 'POST' }),
};

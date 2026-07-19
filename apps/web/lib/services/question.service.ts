import { apiRequest, apiRequestEnvelope, apiDownload } from '../api-client';

export type QuestionType = 'MULTIPLE_CHOICE' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'ESSAY';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionOption {
  id?: string;
  content: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: string;
  courseId: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: { id: string; content: string; isCorrect: boolean }[];
  explanation?: string;
  points: number;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDto {
  courseId: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  options: Omit<QuestionOption, 'id'>[];
  explanation?: string;
  points: number;
  tags?: string[];
}

export type UpdateQuestionDto = Partial<CreateQuestionDto>;

export interface QuestionFilters {
  courseId?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  search?: string;
  page?: number;
  limit?: number;
}

export const questionService = {
  getQuestions: (filters: QuestionFilters) => {
    const params = new URLSearchParams();
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return apiRequestEnvelope<Question[]>(`/questions?${params.toString()}`);
  },

  getQuestion: (id: string) => apiRequest<Question>(`/questions/${id}`),

  createQuestion: (data: CreateQuestionDto) =>
    apiRequest<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateQuestion: (id: string, data: UpdateQuestionDto) =>
    apiRequest<Question>(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteQuestion: (id: string) => apiRequest<void>(`/questions/${id}`, { method: 'DELETE' }),

  importQuestions: (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);
    return apiRequest<{ imported: number }>('/questions/import', {
      method: 'POST',
      body: formData,
    });
  },

  exportQuestions: (courseId: string) =>
    apiDownload(`/questions/export?courseId=${courseId}`, `questions-${courseId}.xlsx`),
};

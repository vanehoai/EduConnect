import { apiRequest, apiRequestEnvelope } from '../api-client';
import type { Exam } from './exam.service';
import type { QuestionType } from './question.service';

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED' | 'GRADED';

// Option WITHOUT isCorrect for frontend to render
export interface AttemptOption {
  id: string;
  content: string;
  order: number;
}

export interface AttemptQuestion {
  id: string;
  questionId: string;
  content: string;
  type: QuestionType;
  options: AttemptOption[];
  points: number;
  order: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  status: AttemptStatus;
  startTime: string;
  endTime?: string;
  remainingTime: number; // in seconds
  score?: number;
  answers: AttemptAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
}

export interface SaveAnswerDto {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
}

export const examAttemptService = {
  getStudentExams: () => {
    return apiRequestEnvelope<Exam[]>('/student/exams');
  },

  startAttempt: (examId: string) =>
    apiRequest<{ attempt: ExamAttempt; questions: AttemptQuestion[] }>(
      `/exam-attempts/start/${examId}`,
      { method: 'POST' },
    ),

  getAttempt: (attemptId: string) =>
    apiRequest<{ attempt: ExamAttempt; questions: AttemptQuestion[] }>(
      `/exam-attempts/${attemptId}`,
    ),

  saveAnswer: (attemptId: string, data: SaveAnswerDto) =>
    apiRequest<{ success: boolean }>(`/exam-attempts/${attemptId}/answers`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  submitAttempt: (attemptId: string) =>
    apiRequest<ExamAttempt>(`/exam-attempts/${attemptId}/submit`, {
      method: 'POST',
    }),

  getAttemptResult: (attemptId: string) =>
    apiRequest<Record<string, unknown>>(`/exam-attempts/${attemptId}/result`),
};

import { apiRequest } from '../api-client';

export interface AdminDashboardSummary {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  activeClasses: number;
  studentStatusStats: {
    status: string;
    count: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
}

export interface StudentDashboardSummary {
  totalCredits: number;
  passedCredits: number;
  currentGpa: number;
  upcomingExams: number;
  attendanceRate: number;
  tuitionDebt: number;
}

export const analyticsService = {
  async getAdminSummary(): Promise<AdminDashboardSummary> {
    try {
      return await apiRequest<AdminDashboardSummary>('/dashboard/admin/summary');
    } catch (_error) {
      // Return mock data if endpoint is not fully ready
      return {
        totalStudents: 1250,
        totalLecturers: 120,
        totalCourses: 45,
        activeClasses: 85,
        studentStatusStats: [
          { status: 'STUDYING', count: 1100 },
          { status: 'SUSPENDED', count: 50 },
          { status: 'DROPPED_OUT', count: 20 },
          { status: 'GRADUATED', count: 80 },
        ],
        revenueByMonth: [
          { month: 'Jan', amount: 50000000 },
          { month: 'Feb', amount: 45000000 },
          { month: 'Mar', amount: 60000000 },
          { month: 'Apr', amount: 55000000 },
          { month: 'May', amount: 70000000 },
        ],
      };
    }
  },

  async getStudentSummary(): Promise<StudentDashboardSummary> {
    try {
      return await apiRequest<StudentDashboardSummary>('/dashboard/student/summary');
    } catch (_error) {
      return {
        totalCredits: 120,
        passedCredits: 95,
        currentGpa: 3.2,
        upcomingExams: 3,
        attendanceRate: 92,
        tuitionDebt: 0,
      };
    }
  },
};

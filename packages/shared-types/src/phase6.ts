// Giai đoạn 6 - Shared types for Dashboard, Analytics, Academic Risks

export type RiskType =
  | 'LOW_GPA'
  | 'GPA_DECLINE'
  | 'HIGH_ABSENCE'
  | 'CONSECUTIVE_ABSENCE'
  | 'FAILED_COURSES'
  | 'LOW_CREDIT_COMPLETION'
  | 'EXAM_INCOMPLETE'
  | 'FINANCIAL_HOLD'
  | 'OTHER';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AnalyticsFilter {
  academicYearId?: string;
  semesterId?: string;
  departmentId?: string;
  courseId?: string;
  classSectionId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AdminDashboardSummary {
  totalStudents: number;
  activeStudents: number;
  totalLecturers: number;
  totalDepartments: number;
  totalCourses: number;
  activeClassSections: number;
  totalEnrollments: number;
  attendanceRate: number;
  averageGpa: number;
  passRate: number;
  activeExams: number;
  examCompletionRate: number;
  totalInvoiced: string;
  totalCollected: string;
  totalOutstanding: string;
  overdueAmount: string;
  studentsAtRisk: number;
  unresolvedRiskAlerts: number;
  studentsByMonth: ChartDataPoint[];
  enrollmentsBySemester: ChartDataPoint[];
  attendanceTrend: ChartDataPoint[];
  averageGradeTrend: ChartDataPoint[];
  paymentCollectionTrend: ChartDataPoint[];
}

export interface TrainingDashboardSummary {
  activeStudents: number;
  activeClassSections: number;
  totalEnrollments: number;
  cancelledEnrollments: number;
  nearFullSections: number;
  overCapacitySections: number;
  attendanceRate: number;
  passRate: number;
  lowGpaStudents: number;
  highAbsenceStudents: number;
  unresolvedRiskAlerts: number;
  highAbsenceClasses: Array<{ id: string; code: string; name: string; absenceRate: number }>;
  highFailureCourses: Array<{ id: string; code: string; name: string; failRate: number }>;
  gpaDeclineStudents: Array<{
    id: string;
    studentCode: string;
    fullName: string;
    previousGpa: number;
    currentGpa: number;
    decline: number;
  }>;
}

export interface FinanceDashboardSummary {
  totalInvoiced: string;
  totalVerifiedPayments: string;
  totalOutstanding: string;
  overdueAmount: string;
  collectionRate: number;
  pendingPayments: number;
  cancelledPayments: number;
  scholarshipsAmount: string;
  adjustmentsAmount: string;
  studentsWithDebt: number;
  paymentsByMonth: ChartDataPoint[];
  paymentsByMethod: ChartDataPoint[];
  debtByDepartment: ChartDataPoint[];
  debtBySemester: ChartDataPoint[];
  invoicesByStatus: ChartDataPoint[];
}

export interface LecturerDashboardSummary {
  activeClassSections: Array<{
    id: string;
    code: string;
    courseName: string;
    enrolledCount: number;
    attendanceRate: number;
    passRate: number;
  }>;
  totalStudents: number;
  upcomingSchedules: Array<{
    classSectionId: string;
    classSectionCode: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string | null;
  }>;
  incompleteAttendanceSessions: number;
  activeExams: number;
  pendingSubmissions: number;
  studentsAtRisk: number;
}

export interface StudentDashboardSummary {
  currentSemester: { id: string; code: string; name: string } | null;
  enrolledCredits: number;
  attendanceRate: number;
  currentGpa: number;
  cumulativeGpa: number;
  completedCredits: number;
  failedCourses: number;
  upcomingClasses: Array<{
    classSectionCode: string;
    courseName: string;
    dayOfWeek: number;
    startTime: string;
    room: string | null;
  }>;
  upcomingExams: Array<{ id: string; title: string; startTime: string }>;
  pendingExamAttempts: number;
  totalOutstanding: string;
  overdueAmount: string;
  activeRiskAlerts: number;
  recentNotifications: Array<{ id: string; type: string; content: string; createdAt: string }>;
}

export interface AcademicOverview {
  totalEnrollments: number;
  averageCredits: number;
  completionRate: number;
  failRate: number;
  dropRate: number;
  averageGpa: number;
  gpaByDepartment: ChartDataPoint[];
  gpaBySemester: ChartDataPoint[];
  highFailureCourses: Array<{
    courseId: string;
    courseCode: string;
    courseName: string;
    failRate: number;
    enrollmentCount: number;
  }>;
}

export interface AttendanceOverview {
  attendanceRate: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  totalSessions: number;
  highAbsenceClasses: Array<{
    classSectionId: string;
    classSectionCode: string;
    courseName: string;
    absenceRate: number;
  }>;
  consecutiveAbsenceStudents: Array<{
    studentId: string;
    studentCode: string;
    fullName: string;
    consecutiveAbsences: number;
  }>;
  attendanceTrend: ChartDataPoint[];
}

export interface GradeOverview {
  averageScore: number;
  averageGpa: number;
  passRate: number;
  failRate: number;
  gradeDistribution: ChartDataPoint[];
  topCourses: Array<{ courseCode: string; courseName: string; averageGpa: number }>;
  highFailureCourses: Array<{ courseCode: string; courseName: string; failRate: number }>;
  studentsBelowGpaThreshold: number;
  semesterGpaTrend: ChartDataPoint[];
}

export interface ExamOverview {
  assignedStudents: number;
  startedAttempts: number;
  submittedAttempts: number;
  autoSubmittedAttempts: number;
  completionRate: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  averageDuration: number;
  unansweredRate: number;
}

export interface AcademicRiskDto {
  id: string;
  studentId: string;
  studentCode: string;
  studentFullName: string;
  semesterId: string;
  semesterCode: string;
  type: RiskType;
  severity: RiskSeverity;
  status: RiskStatus;
  title: string;
  description: string | null;
  ruleCode: string;
  evaluationPeriod: string;
  detectedAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  dismissedAt: string | null;
  dismissReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRiskQuery {
  page?: number;
  limit?: number;
  studentCode?: string;
  fullName?: string;
  semesterId?: string;
  departmentId?: string;
  type?: RiskType;
  severity?: RiskSeverity;
  status?: RiskStatus;
  sortBy?: 'detectedAt' | 'severity' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Permissions for Phase 6
export const PHASE6_PERMISSIONS = [
  'dashboard.admin.read',
  'dashboard.training.read',
  'dashboard.finance.read',
  'dashboard.lecturer.read',
  'dashboard.student.read',
  'analytics.academic.read',
  'analytics.attendance.read',
  'analytics.examination.read',
  'analytics.finance.read',
  'academic-risk.read',
  'academic-risk.manage',
  'academic-risk.resolve',
  'report.export',
] as const;

export type Phase6Permission = (typeof PHASE6_PERMISSIONS)[number];

export const SYSTEM_ROLES = [
  'ADMIN',
  'TRAINING_STAFF',
  'FINANCE_STAFF',
  'LECTURER',
  'STUDENT',
] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const PERMISSION_CODES = [
  'user.read',
  'user.create',
  'user.update',
  'user.delete',
  'role.read',
  'role.manage',
  'department.read',
  'department.create',
  'department.update',
  'department.delete',
  'student.read',
  'student.manage',
  'student.create',
  'student.update',
  'student.delete',
  'student.import',
  'student.export',
  'lecturer.read',
  'lecturer.manage',
  'lecturer.create',
  'lecturer.update',
  'lecturer.delete',
  'academic-year.read',
  'academic-year.manage',
  'semester.read',
  'semester.manage',
  'course.read',
  'course.manage',
  'course.create',
  'course.update',
  'course.delete',
  'course-prerequisite.manage',
  'class-section.read',
  'class-section.create',
  'class-section.update',
  'class-section.delete',
  'schedule.read',
  'schedule.manage',
  'exam.read',
  'exam.manage',
  'exam.create',
  'exam.update',
  'exam.delete',
  'exam.assign',
  'exam.publish',
  'question.read',
  'question.create',
  'question.update',
  'question.delete',
  'question.import',
  'grade.read',
  'grade.manage',
  'invoice.read',
  'invoice.manage',
  'payment.read',
  'payment.manage',
  'audit.read',
  'enrollment.read',
  'enrollment.create',
  'enrollment.cancel',
  'enrollment.manage',
  'attendance.read',
  'attendance.manage',
  'grade.publish',
  'grade.adjust',
  'attempt.start',
  'attempt.read',
  'attempt.submit',
  'result.read',
  'result.manage',
  'result.publish',
  'fee.read',
  'fee.manage',
  'tuition-rate.read',
  'tuition-rate.manage',
  'invoice.read',
  'invoice.create',
  'invoice.update',
  'invoice.cancel',
  'invoice.issue',
  'payment.read',
  'payment.create',
  'payment.verify',
  'payment.cancel',
  'receipt.read',
  'receipt.issue',
  'scholarship.read',
  'scholarship.manage',
  'adjustment.read',
  'adjustment.manage',
  'finance-report.read',
] as const;

export type PermissionCode = (typeof PERMISSION_CODES)[number];

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  status: 'ACTIVE' | 'LOCKED' | 'INACTIVE';
  roles: SystemRole[];
  permissions: PermissionCode[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  database: 'up' | 'down';
}

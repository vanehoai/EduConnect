export type AnnouncementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED' | 'CANCELLED';
export type AnnouncementPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type AnnouncementCategory =
  | 'GENERAL'
  | 'ACADEMIC'
  | 'EXAM'
  | 'ATTENDANCE'
  | 'FINANCE'
  | 'SCHOLARSHIP'
  | 'SYSTEM'
  | 'EVENT'
  | 'OTHER';
export type AnnouncementAudienceType =
  'ALL_USERS' | 'ROLE' | 'DEPARTMENT' | 'CLASS_SECTION' | 'STUDENT' | 'LECTURER';
export type ServiceRequestStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_STUDENT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REOPENED';
export type ServiceRequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type CommentVisibility = 'PUBLIC' | 'INTERNAL';

export interface AnnouncementAudienceDto {
  id: string;
  audienceType: AnnouncementAudienceType;
  roleId?: string | null;
  departmentId?: string | null;
  classSectionId?: string | null;
  studentId?: string | null;
  lecturerId?: string | null;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  publishAt: string | null;
  expiresAt: string | null;
  publishedAt: string | null;
  publishedByUserId: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancelReason: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  audiences?: AnnouncementAudienceDto[];
  unreadCount?: number; // Added dynamically
}

export interface NotificationPreferenceDto {
  id: string;
  userId: string;
  category: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestCategoryDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  owningDepartmentId: string | null;
  defaultPriority: ServiceRequestPriority;
  defaultAssigneeRoleId: string | null;
  slaHours: number | null;
  requiresAttachment: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestCommentDto {
  id: string;
  serviceRequestId: string;
  authorUserId: string;
  content: string;
  visibility: CommentVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestDto {
  id: string;
  requestNumber: string;
  studentId: string;
  categoryId: string;
  subject: string;
  description: string;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  assignedToUserId: string | null;
  assignedByUserId: string | null;
  assignedAt: string | null;
  dueAt: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  resolutionSummary: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancelReason: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations dynamically joined
  category?: ServiceRequestCategoryDto;
  comments?: ServiceRequestCommentDto[];
}

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  entityId: string | null;
  entityType: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestReportSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  cancelled: number;
  byPriority: {
    LOW: number;
    NORMAL: number;
    HIGH: number;
    URGENT: number;
  };
}

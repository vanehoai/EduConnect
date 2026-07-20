import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function countRows() {
  const [
    permissions,
    rolePermissions,
    categories,
    announcements,
    audiences,
    requests,
    comments,
    notifications,
    preferences,
    audits,
  ] = await Promise.all([
    prisma.permission.count(),
    prisma.rolePermission.count(),
    prisma.serviceRequestCategory.count(),
    prisma.announcement.count(),
    prisma.announcementAudience.count(),
    prisma.serviceRequest.count(),
    prisma.serviceRequestComment.count(),
    prisma.notification.count(),
    prisma.notificationPreference.count(),
    prisma.auditLog.count(),
  ]);

  console.log(`Permission: ${permissions}`);
  console.log(`RolePermission: ${rolePermissions}`);
  console.log(`ServiceRequestCategory: ${categories}`);
  console.log(`Announcement: ${announcements}`);
  console.log(`AnnouncementAudience: ${audiences}`);
  console.log(`ServiceRequest: ${requests}`);
  console.log(`ServiceRequestComment: ${comments}`);
  console.log(`Notification: ${notifications}`);
  console.log(`NotificationPreference: ${preferences}`);
  console.log(`AuditLog: ${audits}`);
}

countRows()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

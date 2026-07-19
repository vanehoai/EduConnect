import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Role:', await prisma.role.count());
  console.log('Permission:', await prisma.permission.count());
  console.log('RolePermission:', await prisma.rolePermission.count());
  console.log('AttendanceSession:', await prisma.attendanceSession.count());
  console.log('AttendanceRecord:', await prisma.attendanceRecord.count());
  console.log('GradeComponent:', await prisma.gradeComponent.count());
  console.log('StudentGrade:', await prisma.studentGrade.count());
  console.log('Enrollment:', await prisma.enrollment.count());
  console.log('Notification:', await prisma.notification.count());
}
main().finally(() => prisma.$disconnect());

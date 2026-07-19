const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = await Promise.all([
    prisma.role.count().then((c) => ['Role', c]),
    prisma.permission.count().then((c) => ['Permission', c]),
    prisma.rolePermission.count().then((c) => ['RolePermission', c]),
    prisma.user.count().then((c) => ['User', c]),
    prisma.student.count().then((c) => ['Student', c]),
    prisma.classSection.count().then((c) => ['ClassSection', c]),
    prisma.enrollment.count().then((c) => ['Enrollment', c]),
    prisma.notification.count().then((c) => ['Notification', c]),
  ]);
  console.log(Object.fromEntries(counts));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

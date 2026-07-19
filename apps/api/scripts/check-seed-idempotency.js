const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

async function getCounts(prisma) {
  return {
    Permission: await prisma.$queryRaw`SELECT count(*) FROM "Permission"`.then((r) =>
      Number(r[0].count),
    ),
    RolePermission: await prisma.$queryRaw`SELECT count(*) FROM "RolePermission"`.then((r) =>
      Number(r[0].count),
    ),
    Question: await prisma.question.count(),
    QuestionOption: await prisma.questionOption.count(),
    Exam: await prisma.exam.count(),
    ExamQuestion: await prisma.examQuestion.count(),
    ExamAssignment: await prisma.examAssignment.count(),
    ExamAttempt: await prisma.examAttempt.count(),
    ExamAnswer: await prisma.studentAnswer.count(),
    Notification: await prisma.notification.count(),
  };
}

async function run() {
  const prisma = new PrismaClient();
  try {
    console.log('--- Running Seed 1 ---');
    execSync('npm run db:seed', { stdio: 'inherit', cwd: 'H:/EduConnect/apps/api' });
    const counts1 = await getCounts(prisma);
    console.log('Counts after Seed 1:', counts1);

    console.log('\n--- Running Seed 2 ---');
    execSync('npm run db:seed', { stdio: 'inherit', cwd: 'H:/EduConnect/apps/api' });
    const counts2 = await getCounts(prisma);
    console.log('Counts after Seed 2:', counts2);

    let isIdempotent = true;
    for (const key in counts1) {
      if (counts1[key] !== counts2[key]) {
        console.error(`Mismatch in ${key}: ${counts1[key]} vs ${counts2[key]}`);
        isIdempotent = false;
      }
    }

    if (isIdempotent) {
      console.log('\nSUCCESS: Seed is fully idempotent!');
    } else {
      console.error('\nFAILURE: Seed is NOT idempotent!');
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

run();

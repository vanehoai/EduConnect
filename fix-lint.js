const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. students.service.ts
replaceInFile(path.join(__dirname, 'apps/api/src/students/students.service.ts'), [
  ['semester: any', 'semester: { id: string; code: string }'],
]);

// 2. attendance.service.spec.ts
replaceInFile(path.join(__dirname, 'apps/api/src/modules/attendance/attendance.service.spec.ts'), [
  ['let prisma: PrismaService;', ''],
  ['prisma = module.get<PrismaService>(PrismaService);', ''],
  ['(service as any)', '(service as unknown as Record<string, jest.Mock>)'],
  ['studentId: any', 'studentId: unknown'],
  ['requestedStudentId: any', 'requestedStudentId: unknown'],
  ['userId: any', 'userId: string'], // wait, userId is extracted from object
]);

// 3. grades.service.ts
replaceInFile(path.join(__dirname, 'apps/api/src/modules/grades/grades.service.ts'), [
  [
    'oldValues: { grades: oldValues } as any',
    'oldValues: { grades: oldValues } as unknown as Prisma.InputJsonValue',
  ],
  [
    'newValues: { grades: newGrades, reason } as any',
    'newValues: { grades: newGrades, reason } as unknown as Prisma.InputJsonValue',
  ],
  ['let records: Record<string, any>[];', 'let records: Record<string, string>[];'],
]);

// 4. grades.service.spec.ts
replaceInFile(path.join(__dirname, 'apps/api/src/modules/grades/grades.service.spec.ts'), [
  ['(service as any)', '(service as unknown as Record<string, jest.Mock>)'],
  ['({ userId }: any)', '({ userId }: { userId: number })'],
]);

// 5. gpa.service.spec.ts
replaceInFile(path.join(__dirname, 'apps/api/src/students/gpa.service.spec.ts'), [
  ['(service as any)', '(service as unknown as Record<string, jest.Mock>)'],
]);

// 6. prerequisite-evaluation.service.spec.ts
replaceInFile(
  path.join(__dirname, 'apps/api/src/students/prerequisite-evaluation.service.spec.ts'),
  [['(service as any)', '(service as unknown as Record<string, jest.Mock>)']],
);

console.log('Fixed lint issues.');

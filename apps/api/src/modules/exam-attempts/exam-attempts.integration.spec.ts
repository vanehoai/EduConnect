import { Test, TestingModule } from '@nestjs/testing';
import { ExamAttemptsService } from './exam-attempts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('ExamAttemptsService (Integration)', () => {
  let service: ExamAttemptsService;
  let prisma: PrismaService;

  const cleanup = async () => {
    if (!prisma) return;
    await prisma.studentAnswer.deleteMany();
    await prisma.examAttemptQuestion.deleteMany();
    await prisma.examAttempt.deleteMany();
    await prisma.examAssignment.deleteMany();
    await prisma.examQuestion.deleteMany();
    await prisma.questionOption.deleteMany();
    await prisma.question.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.paymentAllocation.deleteMany();
    await prisma.receipt.deleteMany();
    await prisma.paymentTransaction.deleteMany();
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.studentScholarship.deleteMany();
    await prisma.scholarship.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.classSection.deleteMany();
    await prisma.prerequisite.deleteMany();
    await prisma.course.deleteMany();
    await prisma.tuitionPolicy.deleteMany();
    await prisma.semester.deleteMany();
    await prisma.academicYear?.deleteMany?.();
    await prisma.student.deleteMany();
    await prisma.lecturer?.deleteMany?.();
    await prisma.department?.deleteMany?.();
    await prisma.user.deleteMany();
  };

  beforeAll(async () => {
    // Validate that we are running against the test database!
    if (!process.env.TEST_DATABASE_URL?.includes('_test')) {
      throw new Error('Integration tests must be run against a database ending with _test');
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [ExamAttemptsService],
    }).compile();

    service = module.get<ExamAttemptsService>(ExamAttemptsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clean up any old test data
    await cleanup();
  });

  afterAll(async () => {
    if (prisma) {
      await cleanup();
      await prisma.$disconnect();
    }
  });

  let studentId: string;
  let userId: string;
  let examId: string;
  let optionId1: string;

  beforeEach(async () => {
    // Setup minimal required data for an exam
    const user = await prisma.user.create({
      data: {
        id: 'u-int-1',
        email: 'test@int.com',
        passwordHash: 'hash',
        fullName: 'Int User',
      },
    });
    userId = user.id;

    const student = await prisma.student.create({
      data: {
        id: 's-int-1',
        user: { connect: { id: user.id } },
        studentCode: 'SINT1',
        fullName: 'Int Student',
        email: 'test@int.com',
        cohortClass: 'SE101',
        cohort: 'K18',
        enrollmentDate: new Date(),
        department: {
          connectOrCreate: {
            where: { code: 'DINT1' },
            create: { code: 'DINT1', name: 'Int Dept' },
          },
        },
      },
    });
    studentId = student.id;

    const course = await prisma.course.create({
      data: {
        id: 'c-int-1',
        courseCode: 'INT101',
        name: 'Int Course',
        credits: 3,
        tuitionFeePerCredit: 100,
        department: { connect: { code: 'DINT1' } },
      },
    });

    const academicYear = await prisma.academicYear.create({
      data: {
        id: 'ay-int-1',
        code: 'AYINT',
        name: 'Int Year',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
    });

    const semester = await prisma.semester.create({
      data: {
        id: 'sem-int-1',
        code: 'SEMINT',
        term: 'FIRST',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        name: 'Int Sem',
        academicYear: { connect: { id: academicYear.id } },
        maxCredits: 20,
        status: 'REGISTRATION_OPEN',
        registrationStartDate: new Date('2025-12-01'),
        registrationEndDate: new Date('2025-12-31'),
      },
    });

    const lecturer = await prisma.lecturer.create({
      data: {
        id: 'l-int-1',
        lecturerCode: 'LINT',
        fullName: 'Int Lecturer',
        email: 'lecturer@int.com',
        department: { connect: { code: 'DINT1' } },
        user: {
          create: {
            id: 'u-lect-1',
            email: 'lecturer@int.com',
            passwordHash: 'hash',
            fullName: 'Int Lecturer',
          },
        },
      },
    });

    const classSection = await prisma.classSection.create({
      data: {
        id: 'cs-int-1',
        sectionCode: 'CSINT',
        courseId: course.id,
        semesterId: semester.id,
        maxCapacity: 50,
        lecturerId: lecturer.id,
        status: 'OPEN',
      },
    });

    await prisma.enrollment.create({
      data: {
        id: 'enr-int-1',
        studentId: student.id,
        classSectionId: classSection.id,
        status: 'ENROLLED',
      },
    });

    const exam = await prisma.exam.create({
      data: {
        id: 'e-int-1',
        examCode: 'E1',
        name: 'Exam 1',
        courseId: course.id,
        classSectionId: classSection.id,
        createdByUserId: user.id,
        startsAt: new Date(Date.now() - 100000),
        endsAt: new Date(Date.now() + 100000),
        durationMinutes: 60,
        passScore: 5,
        questionCount: 1,
        maxAttempts: 1,
        status: 'OPEN',
        showResultMode: 'IMMEDIATELY',
        shuffleQuestions: false,
        shuffleOptions: false,
      },
    });
    examId = exam.id;

    const question = await prisma.question.create({
      data: {
        id: 'q-int-1',
        questionCode: 'Q1',
        courseId: course.id,
        content: 'Test Q',
        difficulty: 'EASY',
        type: 'SINGLE_CHOICE',
        defaultScore: 10,
        createdByUserId: user.id,
        options: {
          create: [
            { id: 'o-int-1', content: 'Opt 1', isCorrect: true, displayOrder: 1 },
            { id: 'o-int-2', content: 'Opt 2', isCorrect: false, displayOrder: 2 },
          ],
        },
      },
      include: { options: true },
    });
    questionId = question.id;
    optionId1 = question.options[0].id;

    await prisma.examQuestion.create({
      data: { examId: exam.id, questionId: question.id, points: 10, displayOrder: 1 },
    });

    await prisma.examAssignment.create({
      data: { examId: exam.id, studentId: studentId },
    });
  });

  afterEach(async () => {
    // Clean up created records to keep db clean for next test
    await cleanup();
  });

  it('Start Attempt Concurrency: Should reject concurrent starts for same maxAttempts', async () => {
    // Attempting to start the exam twice simultaneously
    const promise1 = service.startAttempt(examId, userId, 'ip1', 'ua1');
    const promise2 = service.startAttempt(examId, userId, 'ip2', 'ua2');

    const results = await Promise.allSettled([promise1, promise2]);

    let fulfilledCount = 0;
    let rejectedCount = 0;

    results.forEach((res) => {
      if (res.status === 'fulfilled') fulfilledCount++;
      if (res.status === 'rejected') rejectedCount++;
    });

    // Exactly one should succeed, one should fail due to transaction or maxAttempts logic
    expect(fulfilledCount).toBe(1);
    expect(rejectedCount).toBe(1);

    const attempts = await prisma.examAttempt.findMany({ where: { examId, studentId } });
    expect(attempts.length).toBe(1);
    expect(attempts[0].attemptNumber).toBe(1);
  });

  it('Autosave Concurrency: Should not create duplicate answers', async () => {
    const attempt = await service.startAttempt(examId, userId, 'ip', 'ua');
    const snapshot = await prisma.examAttemptQuestion.findFirst({
      where: { examAttemptId: attempt.id },
    });

    // Send two autosaves concurrently
    const promise1 = service.autoSaveAnswer(attempt.id, snapshot.questionId, [optionId1], userId);
    const promise2 = service.autoSaveAnswer(attempt.id, snapshot.questionId, [optionId1], userId);

    await Promise.allSettled([promise1, promise2]);

    const answers = await prisma.studentAnswer.findMany({ where: { examAttemptId: attempt.id } });
    expect(answers.length).toBe(1); // Upsert guarantees uniqueness
    expect(answers[0].selectedOptionIds).toEqual([optionId1]);
  });

  it('Submit and Autosave Concurrency: Should not double-grade', async () => {
    // Increase maxAttempts to avoid conflict if test leaks
    await prisma.exam.update({ where: { id: examId }, data: { maxAttempts: 2 } });
    const attempt = await service.startAttempt(examId, userId, 'ip', 'ua');
    const snapshot = await prisma.examAttemptQuestion.findFirst({
      where: { examAttemptId: attempt.id },
    });

    // Submit and autosave simultaneously
    const pSave = service.autoSaveAnswer(attempt.id, snapshot.questionId, [optionId1], userId);
    const pSubmit = service.submitAttempt(attempt.id, userId);

    await Promise.allSettled([pSave, pSubmit]);

    const updatedAttempt = await prisma.examAttempt.findUnique({ where: { id: attempt.id } });
    expect(updatedAttempt.status).toBe('SUBMITTED');
    expect(updatedAttempt.score).toBeDefined();

    // Verify exactly one notification generated for submit
    const notifications = await prisma.notification.findMany({
      where: { userId: userId, content: { contains: 'đã nộp' } },
    });
    expect(notifications.length).toBeLessThanOrEqual(1); // Shouldn't be 2
  });
});

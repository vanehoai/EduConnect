import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { PaymentsService } from '../src/modules/finance/payments/payments.service';
import { InvoicesService } from '../src/modules/finance/invoices/invoices.service';
import { ReportsService } from '../src/modules/finance/reports/reports.service';
import { InvoiceCalculationService } from '../src/modules/finance/invoices/invoice-calculation.service';
import { Prisma, PaymentStatus, InvoiceStatus, PaymentProvider } from '@prisma/client';
import { AuditService } from '../src/audit/audit.service';
import { FinanceModule } from '../src/modules/finance/finance.module';
import { ConfigModule } from '@nestjs/config';

describe('Finance Integration - Final Acceptance', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let paymentsService: PaymentsService;
  let invoicesService: InvoicesService;
  let reportsService: ReportsService;

  beforeAll(async () => {
    // Enforcement 1: NODE_ENV must be test
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Test must be run with NODE_ENV=test');
    }

    // Enforcement 2: DB URL must be TEST_DATABASE_URL
    const dbUrl = process.env.TEST_DATABASE_URL;
    if (!dbUrl || !dbUrl.endsWith('_test?schema=public')) {
      throw new Error(
        'Test must use TEST_DATABASE_URL ending with _test?schema=public. Aborting to prevent data corruption.',
      );
    }

    // Temporarily overwrite DATABASE_URL so Prisma uses the test one for this process
    process.env.DATABASE_URL = dbUrl;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), FinanceModule],
      providers: [PrismaService],
    })
      .overrideProvider(AuditService)
      .useValue({ record: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    paymentsService = moduleFixture.get<PaymentsService>(PaymentsService);
    invoicesService = moduleFixture.get<InvoicesService>(InvoicesService);
    reportsService = moduleFixture.get<ReportsService>(ReportsService);

    // Clean up test database before starting
    await prisma.receipt.deleteMany({});
    await prisma.paymentAllocation.deleteMany({});
    await prisma.paymentTransaction.deleteMany({});
    await prisma.invoiceItem.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.tuitionRate.deleteMany({});
    await prisma.feeType.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.classSection.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.semester.deleteMany({});
    await prisma.academicYear.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.lecturer.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  let sharedStudentId = '';
  let sharedSemesterId = '';
  let adminUserId = '';

  it('Setup base data', async () => {
    const user = await prisma.user.create({
      data: { email: `test${Date.now()}@test.com`, passwordHash: 'x', fullName: 'Test' },
    });
    adminUserId = user.id;

    const dept = await prisma.department.create({
      data: { code: 'IT', name: 'IT Dept' },
    });

    const student = await prisma.student.create({
      data: {
        studentCode: 'STU1',
        userId: user.id,
        departmentId: dept.id,
        fullName: 'Test Student',
        email: user.email,
        cohortClass: 'K1',
        cohort: '2023',
        enrollmentDate: new Date(),
      },
    });
    sharedStudentId = student.id;

    const ay = await prisma.academicYear.create({
      data: {
        code: '2023',
        name: '23',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
      },
    });

    const semester = await prisma.semester.create({
      data: {
        academicYearId: ay.id,
        code: 'SEM1',
        name: 'Sem 1',
        term: 'FIRST',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-06-30'),
        registrationStartDate: new Date('2022-12-01'),
        registrationEndDate: new Date('2022-12-31'),
      },
    });
    sharedSemesterId = semester.id;

    const course = await prisma.course.create({
      data: {
        courseCode: 'CS1',
        name: 'CS',
        credits: 3,
        theoryPeriods: 30,
        practicePeriods: 0,
        tuitionFeePerCredit: 1000,
        departmentId: dept.id,
        status: 'ACTIVE',
      },
    });

    const lecturer = await prisma.lecturer.create({
      data: {
        lecturerCode: 'LEC1',
        userId: user.id,
        departmentId: dept.id,
        fullName: 'Test Lecturer',
        email: user.email,
      },
    });

    const section = await prisma.classSection.create({
      data: {
        sectionCode: 'SEC1',
        course: { connect: { id: course.id } },
        semester: { connect: { id: semester.id } },
        lecturer: { connect: { id: lecturer.id } },
        maxCapacity: 10,
        status: 'IN_PROGRESS',
      },
    });

    await prisma.enrollment.create({
      data: { studentId: student.id, classSectionId: section.id, status: 'ENROLLED' },
    });

    const feeType = await prisma.feeType.create({
      data: { code: 'TUITION', name: 'Học phí', isMandatory: true },
    });

    await prisma.tuitionRate.create({
      data: {
        semester: { connect: { id: semester.id } },
        feeType: { connect: { id: feeType.id } },
        amountPerCredit: 500000,
        isActive: true,
        effectiveFrom: new Date(),
      },
    });
  });

  it('should prevent concurrent invoice generation for the same student and semester', async () => {
    // generateInvoice creates an invoice based on enrolled credits
    const p1 = invoicesService.generateInvoice(sharedStudentId, sharedSemesterId, adminUserId);
    const p2 = invoicesService.generateInvoice(sharedStudentId, sharedSemesterId, adminUserId);

    const results = await Promise.allSettled([p1, p2]);
    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.log('Generate Invoice Failure:', failures[0]);
    }

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1); // One should throw Conflict/BadRequest

    const invoices = await prisma.invoice.findMany({
      where: { studentId: sharedStudentId, semesterId: sharedSemesterId },
    });
    expect(invoices.length).toBe(1);
    expect(Number(invoices[0].totalAmount)).toBe(1500000); // 3 credits * 500,000
  });

  it('should allocate payment concurrently idempotently', async () => {
    const invoice = await prisma.invoice.findFirst({ where: { studentId: sharedStudentId } });
    expect(invoice).toBeDefined();

    const paymentTx = await prisma.paymentTransaction.create({
      data: {
        transactionCode: `TX-${Date.now()}`,
        invoiceId: invoice!.id,
        studentId: sharedStudentId,
        provider: PaymentProvider.VNPAY,
        idempotencyKey: `IDEM-${Date.now()}`,
        amount: 1000000,
        status: PaymentStatus.PENDING,
      },
    });

    const idempotencyKey = `VNPAY-WEBHOOK-${Date.now()}`;

    const promise1 = paymentsService.verifyPayment(
      {
        transactionCode: paymentTx.transactionCode,
        idempotencyKey,
        amount: 1000000,
      },
      adminUserId,
    );

    const promise2 = paymentsService.verifyPayment(
      {
        transactionCode: paymentTx.transactionCode,
        idempotencyKey,
        amount: 1000000,
      },
      adminUserId,
    );

    const results = await Promise.allSettled([promise1, promise2]);
    const successes = results.filter((r) => r.status === 'fulfilled');
    expect(successes.length).toBeGreaterThan(0);

    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id: invoice!.id },
      include: { allocations: true, receipts: true },
    });

    expect(updatedInvoice?.allocations.length).toBe(1);
    expect(updatedInvoice?.receipts.length).toBe(1);
    expect(updatedInvoice?.status).toBe(InvoiceStatus.PARTIALLY_PAID);
    expect(Number(updatedInvoice?.paidAmount)).toBe(1000000);
    expect(Number(updatedInvoice?.balanceAmount)).toBe(500000);
  });

  it('should reverse allocation when payment is cancelled concurrently', async () => {
    const payment = await prisma.paymentTransaction.findFirst({
      where: { status: PaymentStatus.VERIFIED },
    });
    expect(payment).toBeDefined();

    const promise1 = paymentsService.cancelPayment(payment!.id, 'Test cancel', adminUserId);
    const promise2 = paymentsService.cancelPayment(payment!.id, 'Test cancel', adminUserId);

    const results = await Promise.allSettled([promise1, promise2]);
    const successes = results.filter((r) => r.status === 'fulfilled');
    expect(successes.length).toBeGreaterThan(0);

    const updatedInvoice = await prisma.invoice.findFirst({
      where: { studentId: sharedStudentId },
    });
    const cancelledPayment = await prisma.paymentTransaction.findUnique({
      where: { id: payment!.id },
    });

    expect(cancelledPayment?.status).toBe(PaymentStatus.CANCELLED);
    expect(Number(updatedInvoice?.paidAmount)).toBe(0);
    expect(Number(updatedInvoice?.balanceAmount)).toBe(1500000);
    expect(updatedInvoice?.status).toBe(InvoiceStatus.ISSUED);
  });

  it('should report correct outstanding amounts', async () => {
    const summary = await reportsService.getSummary(sharedSemesterId);
    expect(Number(summary.totalInvoiced)).toBe(1500000);
    expect(Number(summary.totalPaid)).toBe(0); // Because it was cancelled
    expect(Number(summary.totalOutstanding)).toBe(1500000);
  });
});

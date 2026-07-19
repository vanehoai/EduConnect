import { SemesterStatus, SemesterTerm } from '@prisma/client';
import { SemestersService } from './semesters.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

const academicYear = {
  id: 'year-1',
  startDate: new Date('2026-08-01'),
  endDate: new Date('2027-07-31'),
};
const validDto = {
  academicYearId: 'year-1',
  code: '2026-HK1',
  name: 'Học kỳ 1',
  term: SemesterTerm.FIRST,
  startDate: new Date('2026-09-01'),
  endDate: new Date('2027-01-15'),
  registrationStartDate: new Date('2026-08-10T00:00:00Z'),
  registrationEndDate: new Date('2026-08-25T00:00:00Z'),
};

function harness() {
  const transaction = {
    semester: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  const prisma = {
    academicYear: { findUnique: jest.fn().mockResolvedValue(academicYear) },
    semester: { findUnique: jest.fn() },
    $transaction: jest.fn(async (callback: (client: typeof transaction) => unknown) =>
      callback(transaction),
    ),
  };
  const audit = { record: jest.fn() };
  return {
    prisma,
    transaction,
    service: new SemestersService(
      prisma as unknown as PrismaService,
      audit as unknown as AuditService,
    ),
  };
}

describe('SemestersService constraints', () => {
  it('từ chối kỳ có ngày đăng ký kết thúc sau ngày bắt đầu học', async () => {
    const { service } = harness();
    await expect(
      service.create(
        'actor',
        { ...validDto, registrationEndDate: new Date('2026-09-02') },
        { ipAddress: null, userAgent: null },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'SEMESTER_REGISTRATION_DATES_INVALID' }),
    });
  });

  it('từ chối học kỳ nằm ngoài năm học', async () => {
    const { service } = harness();
    await expect(
      service.create(
        'actor',
        { ...validDto, endDate: new Date('2027-08-02') },
        { ipAddress: null, userAgent: null },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'SEMESTER_OUTSIDE_ACADEMIC_YEAR' }),
    });
  });

  it('không cho mở đăng ký khi đã có kỳ khác đang mở', async () => {
    const { service, transaction } = harness();
    transaction.semester.findFirst.mockResolvedValue({ id: 'already-open' });
    await expect(
      service.create(
        'actor',
        { ...validDto, status: SemesterStatus.REGISTRATION_OPEN },
        { ipAddress: null, userAgent: null },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'SEMESTER_REGISTRATION_OPEN_CONFLICT' }),
    });
    expect(transaction.semester.create).not.toHaveBeenCalled();
  });

  it('chặn chuyển trạng thái PLANNED trực tiếp sang COMPLETED', async () => {
    const { service, prisma } = harness();
    prisma.semester.findUnique.mockResolvedValue({
      ...validDto,
      id: 'semester-1',
      status: SemesterStatus.PLANNED,
      maxCredits: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
      academicYear: { id: 'year-1', code: '2026-2027', name: 'Năm học 2026-2027' },
      _count: { classSections: 0, tuitionPolicies: 0, invoices: 0 },
    });
    await expect(
      service.update(
        'actor',
        'semester-1',
        { status: SemesterStatus.COMPLETED },
        { ipAddress: null, userAgent: null },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'SEMESTER_STATUS_TRANSITION_INVALID' }),
    });
  });
});

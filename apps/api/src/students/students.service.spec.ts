import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

function harness() {
  const prisma = {
    student: { findFirst: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    department: { findMany: jest.fn().mockResolvedValue([]) },
    academicYear: { findMany: jest.fn().mockResolvedValue([]) },
    user: { findMany: jest.fn().mockResolvedValue([]) },
    role: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
  const audit = { record: jest.fn() };
  return {
    prisma,
    service: new StudentsService(
      prisma as unknown as PrismaService,
      audit as unknown as AuditService,
    ),
  };
}

describe('StudentsService', () => {
  it('lấy hồ sơ /students/me theo userId của token, không nhận id bên ngoài', async () => {
    const { service, prisma } = harness();
    prisma.student.findFirst.mockResolvedValue({ id: 'student-1', userId: 'user-1' });
    await expect(service.findMe('user-1')).resolves.toMatchObject({ id: 'student-1' });
    expect(prisma.student.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1', deletedAt: null } }),
    );
  });

  it('không trả hồ sơ sinh viên khác khi user chưa có hồ sơ', async () => {
    const { service, prisma } = harness();
    prisma.student.findFirst.mockResolvedValue(null);
    await expect(service.findMe('user-without-profile')).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'STUDENT_PROFILE_NOT_FOUND' }),
    });
  });

  it('atomic import không ghi dữ liệu khi có dòng lỗi validation', async () => {
    const { service, prisma } = harness();
    const file = {
      originalname: 'students.csv',
      buffer: Buffer.from('studentCode,fullName,email\n,Thiếu dữ liệu,not-an-email'),
    } as Express.Multer.File;
    await expect(
      service.importCsv('actor', file, true, { ipAddress: null, userAgent: null }),
    ).rejects.toMatchObject({
      status: 422,
      response: expect.objectContaining({
        code: 'STUDENT_IMPORT_VALIDATION_FAILED',
        details: expect.any(Array),
      }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.role.findUnique).not.toHaveBeenCalled();
  });
});

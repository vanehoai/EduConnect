import { LecturersService } from './lecturers.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

describe('LecturersService ownership', () => {
  const create = () => {
    const prisma = { lecturer: { findFirst: jest.fn() } };
    const audit = { record: jest.fn() };
    return {
      prisma,
      service: new LecturersService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditService,
      ),
    };
  };

  it('lấy /lecturers/me bằng userId từ access token', async () => {
    const { prisma, service } = create();
    prisma.lecturer.findFirst.mockResolvedValue({ id: 'lecturer-1', userId: 'user-1' });
    await expect(service.findMe('user-1')).resolves.toMatchObject({ id: 'lecturer-1' });
    expect(prisma.lecturer.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1', deletedAt: null } }),
    );
  });

  it('không cho truy xuất hồ sơ không thuộc người dùng', async () => {
    const { prisma, service } = create();
    prisma.lecturer.findFirst.mockResolvedValue(null);
    await expect(service.findMe('other-user')).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'LECTURER_PROFILE_NOT_FOUND' }),
    });
  });
});

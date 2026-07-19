import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

function harness() {
  const prisma = {
    prerequisite: { findMany: jest.fn() },
    course: { findFirst: jest.fn() },
  };
  const audit = { record: jest.fn() };
  return {
    prisma,
    service: new CoursesService(
      prisma as unknown as PrismaService,
      audit as unknown as AuditService,
    ),
  };
}

describe('CoursesService prerequisite graph', () => {
  it('từ chối môn học tiên quyết là chính nó', async () => {
    const { service } = harness();
    await expect(
      service.addPrerequisite(
        'actor',
        'course-a',
        { prerequisiteCourseId: 'course-a' },
        { ipAddress: null, userAgent: null },
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'PREREQUISITE_SELF_REFERENCE' }),
    });
  });

  it('phát hiện vòng lặp trực tiếp', async () => {
    const { service, prisma } = harness();
    prisma.prerequisite.findMany.mockResolvedValueOnce([{ prerequisiteCourseId: 'course-a' }]);
    await expect(service.wouldCreateCycle('course-a', 'course-b')).resolves.toBe(true);
  });

  it('phát hiện vòng lặp nhiều cấp', async () => {
    const { service, prisma } = harness();
    prisma.prerequisite.findMany
      .mockResolvedValueOnce([{ prerequisiteCourseId: 'course-c' }])
      .mockResolvedValueOnce([{ prerequisiteCourseId: 'course-a' }]);
    await expect(service.wouldCreateCycle('course-a', 'course-b')).resolves.toBe(true);
    expect(prisma.prerequisite.findMany).toHaveBeenCalledTimes(2);
  });

  it('chấp nhận đồ thị không có vòng lặp', async () => {
    const { service, prisma } = harness();
    prisma.prerequisite.findMany
      .mockResolvedValueOnce([{ prerequisiteCourseId: 'course-c' }])
      .mockResolvedValueOnce([]);
    await expect(service.wouldCreateCycle('course-a', 'course-b')).resolves.toBe(false);
  });
});

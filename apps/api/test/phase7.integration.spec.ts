import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { ServiceRequestsService } from '../src/modules/service-requests/service-requests.service';
import { AnnouncementsService } from '../src/modules/announcements/announcements.service';
import { StudentAnnouncementsService } from '../src/modules/announcements/student-announcements.service';
import { AnnouncementSchedulerService } from '../src/modules/announcements/announcement-scheduler.service';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { AuditService } from '../src/audit/audit.service';
import { Prisma, AnnouncementStatus } from '@prisma/client';
import { AuthUser } from '@school/shared-types';

describe('Phase 7 Integration (End-to-End)', () => {
  let serviceReqService: ServiceRequestsService;
  let announcementsService: AnnouncementsService;
  let studentAnnouncementsService: StudentAnnouncementsService;
  let schedulerService: AnnouncementSchedulerService;
  let notificationsService: NotificationsService;
  let prisma: PrismaService;

  const mockAdmin: AuthUser = {
    id: 'admin-1',
    email: 'admin@test.com',
    fullName: 'Admin',
    roles: ['ADMIN'],
    departmentId: null,
    permissions: [],
  };
  const mockStudent1: AuthUser = {
    id: 'student-1',
    email: 's1@test.com',
    fullName: 'S1',
    roles: ['STUDENT'],
    departmentId: null,
    permissions: [],
  };
  const mockStudent2: AuthUser = {
    id: 'student-2',
    email: 's2@test.com',
    fullName: 'S2',
    roles: ['STUDENT'],
    departmentId: null,
    permissions: [],
  };

  beforeAll(async () => {
    if (!process.env.TEST_DATABASE_URL?.includes('_test')) {
      throw new Error('Integration tests must be run against a database ending with _test');
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        ServiceRequestsService,
        AnnouncementsService,
        StudentAnnouncementsService,
        AnnouncementSchedulerService,
        NotificationsService,
        AuditService,
      ],
    }).compile();

    serviceReqService = module.get<ServiceRequestsService>(ServiceRequestsService);
    announcementsService = module.get<AnnouncementsService>(AnnouncementsService);
    studentAnnouncementsService = module.get<StudentAnnouncementsService>(
      StudentAnnouncementsService,
    );
    schedulerService = module.get<AnnouncementSchedulerService>(AnnouncementSchedulerService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Setup mock users
    await prisma.user.upsert({
      where: { id: mockAdmin.id },
      update: {},
      create: {
        id: mockAdmin.id,
        email: mockAdmin.email,
        fullName: mockAdmin.fullName,
        passwordHash: 'hash',
      },
    });
    await prisma.user.upsert({
      where: { id: mockStudent1.id },
      update: {},
      create: {
        id: mockStudent1.id,
        email: mockStudent1.email,
        fullName: mockStudent1.fullName,
        passwordHash: 'hash',
      },
    });
    await prisma.user.upsert({
      where: { id: mockStudent2.id },
      update: {},
      create: {
        id: mockStudent2.id,
        email: mockStudent2.email,
        fullName: mockStudent2.fullName,
        passwordHash: 'hash',
      },
    });

    // Setup student profiles
    const dept = await prisma.department.upsert({
      where: { code: 'IT' },
      update: {},
      create: { code: 'IT', name: 'Information Technology' },
    });

    await prisma.student.upsert({
      where: { id: mockStudent1.id },
      update: {},
      create: {
        id: mockStudent1.id,
        studentCode: 'S1',
        user: { connect: { id: mockStudent1.id } },
        department: { connect: { id: dept.id } },
        cohort: '2023',
        cohortClass: '2023-IT',
        enrollmentDate: new Date(),
        fullName: 'S1',
        email: 's1@test.com',
      },
    });
    await prisma.student.upsert({
      where: { id: mockStudent2.id },
      update: {},
      create: {
        id: mockStudent2.id,
        studentCode: 'S2',
        user: { connect: { id: mockStudent2.id } },
        department: { connect: { id: dept.id } },
        cohort: '2023',
        cohortClass: '2023-IT',
        enrollmentDate: new Date(),
        fullName: 'S2',
        email: 's2@test.com',
      },
    });

    await prisma.user.upsert({
      where: { id: 'staff-1' },
      update: {},
      create: {
        id: 'staff-1',
        email: 'staff1@test.com',
        fullName: 'Staff 1',
        passwordHash: 'hash',
      },
    });
    await prisma.user.upsert({
      where: { id: 'staff-2' },
      update: {},
      create: {
        id: 'staff-2',
        email: 'staff2@test.com',
        fullName: 'Staff 2',
        passwordHash: 'hash',
      },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    await prisma.serviceRequestAttachment.deleteMany();
    await prisma.serviceRequestComment.deleteMany();
    await prisma.serviceRequest.deleteMany();
    await prisma.serviceRequestCategory.deleteMany();
    await prisma.announcementReadReceipt.deleteMany();
    await prisma.announcementAudience.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.notificationPreference.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
  });

  describe('1. Concurrent Request Number Generation', () => {
    it('should generate unique request numbers for concurrent requests', async () => {
      const category = await serviceReqService.createCategory(
        { code: 'CAT1', name: 'Cat 1', description: '', isActive: true, defaultPriority: 'NORMAL' },
        mockAdmin,
      );

      const promises = Array.from({ length: 5 }).map(() =>
        serviceReqService
          .createServiceRequest(
            mockStudent1.id,
            { categoryId: category.id, subject: 'S', description: 'D' },
            mockStudent1,
          )
          .catch((e) => e),
      );

      const results = await Promise.all(promises);
      const successfulRequests = results.filter((r) => !(r instanceof Error));
      const reqNumbers = successfulRequests.map((r) => r.requestNumber);
      const uniqueNumbers = new Set(reqNumbers);

      expect(uniqueNumbers.size).toBe(successfulRequests.length); // All successful ones must be unique
    });
  });

  describe('2. Student Request Ownership & Security', () => {
    it('should prevent student from seeing other student requests', async () => {
      const category = await serviceReqService.createCategory(
        { code: 'CAT2', name: 'Cat 2', description: '', isActive: true, defaultPriority: 'NORMAL' },
        mockAdmin,
      );
      const req = await serviceReqService.createServiceRequest(
        mockStudent1.id,
        { categoryId: category.id, subject: 'S', description: 'D' },
        mockStudent1,
      );

      await expect(serviceReqService.getServiceRequestById(req.id, mockStudent2)).rejects.toThrow();
    });

    it('should hide internal comments from students', async () => {
      const category = await serviceReqService.createCategory(
        { code: 'CAT3', name: 'Cat 3', description: '', isActive: true, defaultPriority: 'NORMAL' },
        mockAdmin,
      );
      const req = await serviceReqService.createServiceRequest(
        mockStudent1.id,
        { categoryId: category.id, subject: 'S', description: 'D' },
        mockStudent1,
      );

      await serviceReqService.addComment(
        req.id,
        { content: 'Internal secret', visibility: 'INTERNAL' },
        mockAdmin,
      );
      await serviceReqService.addComment(
        req.id,
        { content: 'Public reply', visibility: 'PUBLIC' },
        mockAdmin,
      );

      const commentsForStudent = await serviceReqService.getComments(req.id, mockStudent1);
      expect(commentsForStudent.length).toBe(1);
      expect(commentsForStudent[0].content).toBe('Public reply');

      const commentsForAdmin = await serviceReqService.getComments(req.id, mockAdmin);
      expect(commentsForAdmin.length).toBe(2);
    });
  });

  describe('3. Concurrent Resolve and Cancel', () => {
    it('should only allow one final state transition', async () => {
      const category = await serviceReqService.createCategory(
        { code: 'CAT4', name: 'Cat 4', description: '', isActive: true, defaultPriority: 'NORMAL' },
        mockAdmin,
      );
      const req = await serviceReqService.createServiceRequest(
        mockStudent1.id,
        { categoryId: category.id, subject: 'S', description: 'D' },
        mockStudent1,
      );

      const p1 = serviceReqService
        .resolveRequest(req.id, { resolutionSummary: 'Done' }, mockAdmin)
        .catch((e) => e);
      const p2 = serviceReqService
        .cancelRequest(req.id, { reason: 'Cancel' }, mockAdmin)
        .catch((e) => e);

      const results = await Promise.all([p1, p2]);
      const successCount = results.filter(
        (r) => !(r instanceof Error) && r.status === 'RESOLVED',
      ).length;
      expect(successCount).toBe(1); // Only one should succeed
    });
  });

  describe('4. Concurrent Assignment', () => {
    it('should not allow double assignment causing issues', async () => {
      const category = await serviceReqService.createCategory(
        { code: 'CAT5', name: 'Cat 5', description: '', isActive: true, defaultPriority: 'NORMAL' },
        mockAdmin,
      );
      const req = await serviceReqService.createServiceRequest(
        mockStudent1.id,
        { categoryId: category.id, subject: 'S', description: 'D' },
        mockStudent1,
      );

      const p1 = serviceReqService
        .assignRequest(req.id, { assignedToUserId: 'staff-1' }, mockAdmin)
        .catch((e) => e);
      const p2 = serviceReqService
        .assignRequest(req.id, { assignedToUserId: 'staff-2' }, mockAdmin)
        .catch((e) => e);

      await Promise.all([p1, p2]);
      const finalReq = await prisma.serviceRequest.findUnique({ where: { id: req.id } });
      expect(['staff-1', 'staff-2']).toContain(finalReq?.assignedToUserId);
      expect(finalReq?.status).toBe('ASSIGNED');
    });
  });

  describe('5. Scheduler Concurrency', () => {
    it('should only execute once when multiple instances run', async () => {
      // Mock announcements
      await prisma.announcement.create({
        data: {
          title: 'A',
          content: 'B',
          status: 'SCHEDULED',
          publishAt: new Date(Date.now() - 10000), // Past
          createdByUserId: mockAdmin.id,
          audiences: {
            create: [{ audienceType: 'ALL_USERS' }],
          },
        },
      });

      const p1 = schedulerService.processScheduledAnnouncements();
      const p2 = schedulerService.processScheduledAnnouncements();

      const results = await Promise.all([p1, p2]);
      // One should return processed count, the other might return 0 or skip
      const totalProcessed = results.reduce((acc: any, val: any) => acc + (val?.processed || 0), 0);
      console.log('RESULTS:', results);
      expect(totalProcessed).toBe(1);
    });
  });

  describe('6. Concurrent Publish Announcements', () => {
    it('should safely handle concurrent publish calls on the same announcement', async () => {
      const ann = await prisma.announcement.create({
        data: {
          title: 'P',
          content: 'C',
          status: 'DRAFT',
          createdByUserId: mockAdmin.id,
          audiences: {
            create: [{ audienceType: 'ALL_USERS' }],
          },
        },
      });

      const p1 = announcementsService.publish(ann.id, mockAdmin.id).catch((e) => e);
      const p2 = announcementsService.publish(ann.id, mockAdmin.id).catch((e) => e);

      await Promise.all([p1, p2]);
      const finalAnn = await prisma.announcement.findUnique({ where: { id: ann.id } });
      expect(finalAnn?.status).toBe('PUBLISHED');

      // Ensure only 1 audit log was created for PUBLISH
      const publishAudits = await prisma.auditLog.count({
        where: { entityId: ann.id, action: 'PUBLISH_ANNOUNCEMENT' },
      });
      expect(publishAudits).toBe(1);
    });
  });

  describe('7. Read Receipt Concurrency & Ownership', () => {
    it('should idempotently mark as read', async () => {
      const ann = await prisma.announcement.create({
        data: {
          title: 'Read me',
          content: 'Content',
          status: 'PUBLISHED',
          createdByUserId: mockAdmin.id,
        },
      });

      const p1 = studentAnnouncementsService.markAsRead(ann.id, mockStudent1.id).catch((e) => e);
      const p2 = studentAnnouncementsService.markAsRead(ann.id, mockStudent1.id).catch((e) => e);

      await Promise.all([p1, p2]);

      const receipts = await prisma.announcementReadReceipt.count({
        where: { announcementId: ann.id, userId: mockStudent1.id },
      });
      expect(receipts).toBe(1);
    });
  });

  describe('8. Notification Read-All Ownership & Idempotency', () => {
    it('should only mark current user notifications as read and not others', async () => {
      await prisma.notification.create({
        data: { userId: mockStudent1.id, type: 'SYSTEM', title: 'T', content: 'C' },
      });
      await prisma.notification.create({
        data: { userId: mockStudent2.id, type: 'SYSTEM', title: 'T', content: 'C' },
      });

      await notificationsService.markAllAsRead(mockStudent1.id);

      const s1Notifs = await prisma.notification.findFirst({ where: { userId: mockStudent1.id } });
      expect(s1Notifs?.readAt).not.toBeNull();

      const s2Notifs = await prisma.notification.findFirst({ where: { userId: mockStudent2.id } });
      expect(s2Notifs?.readAt).toBeNull(); // Untouched
    });
  });
});

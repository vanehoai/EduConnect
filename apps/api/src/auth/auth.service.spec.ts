import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import type { RequestMetadata } from './interfaces/request-metadata.interface';
import type { RefreshTokenPayload } from './interfaces/token-payload.interface';

const accessSecret = 'access-secret-for-tests-1234567890';
const refreshSecret = 'refresh-secret-for-tests-123456789';
const metadata: RequestMetadata = { ipAddress: '127.0.0.1', userAgent: 'jest' };

function createUser(passwordHash: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    email: 'admin@school.local',
    passwordHash,
    fullName: 'Quản trị hệ thống',
    phone: null,
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    failedLoginAttempts: 0,
    lockedUntil: null,
    deletedAt: null,
    roles: [
      {
        role: {
          code: 'ADMIN',
          permissions: [{ permission: { code: 'user.read' } }],
        },
      },
    ],
    ...overrides,
  };
}

function createHarness() {
  const transactionRefreshToken = {
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    create: jest.fn().mockResolvedValue({}),
  };
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    loginHistory: {
      create: jest.fn().mockResolvedValue({}),
    },
    refreshToken: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (input: unknown) => {
      if (Array.isArray(input)) return Promise.all(input);
      const callback = input as (transaction: {
        refreshToken: typeof transactionRefreshToken;
      }) => Promise<unknown>;
      return callback({ refreshToken: transactionRefreshToken });
    }),
  };
  const configMock = {
    get: jest.fn((key: string, fallback: unknown) => {
      const values: Record<string, unknown> = {
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return values[key] ?? fallback;
    }),
    getOrThrow: jest.fn((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return accessSecret;
      if (key === 'JWT_REFRESH_SECRET') return refreshSecret;
      throw new Error(`Missing config ${key}`);
    }),
  };
  const jwtService = new JwtService();
  const service = new AuthService(
    prismaMock as unknown as PrismaService,
    jwtService,
    configMock as unknown as ConfigService,
  );
  return { service, prismaMock, transactionRefreshToken, jwtService };
}

describe('AuthService', () => {
  it('đăng nhập thành công và không trả passwordHash', async () => {
    const harness = createHarness();
    const passwordHash = await hash('Password@123', 4);
    harness.prismaMock.user.findUnique.mockResolvedValue(createUser(passwordHash));

    const session = await harness.service.login(
      { email: 'admin@school.local', password: 'Password@123' },
      metadata,
    );

    expect(session.user).toMatchObject({
      id: 'user-1',
      email: 'admin@school.local',
      roles: ['ADMIN'],
      permissions: ['user.read'],
    });
    expect(session.user).not.toHaveProperty('passwordHash');
    expect(session).toHaveProperty('accessToken');
    expect(session).toHaveProperty('refreshToken');
    expect(
      await compare(
        session.refreshToken,
        harness.prismaMock.refreshToken.create.mock.calls[0][0].data.tokenHash,
      ),
    ).toBe(true);
  });

  it('từ chối mật khẩu sai bằng thông báo chung', async () => {
    const harness = createHarness();
    harness.prismaMock.user.findUnique.mockResolvedValue(createUser(await hash('Password@123', 4)));

    await expect(
      harness.service.login({ email: 'admin@school.local', password: 'sai-mat-khau' }, metadata),
    ).rejects.toThrow('Email hoặc mật khẩu không chính xác');
    expect(harness.prismaMock.loginHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ successful: false }),
      }),
    );
  });

  it('không cho tài khoản đang bị khóa đăng nhập', async () => {
    const harness = createHarness();
    harness.prismaMock.user.findUnique.mockResolvedValue(
      createUser(await hash('Password@123', 4), {
        status: UserStatus.LOCKED,
        lockedUntil: new Date(Date.now() + 60_000),
      }),
    );

    await expect(
      harness.service.login({ email: 'admin@school.local', password: 'Password@123' }, metadata),
    ).rejects.toThrow('Email hoặc mật khẩu không chính xác');
    expect(harness.prismaMock.refreshToken.create).not.toHaveBeenCalled();
  });

  it('rotation refresh token thành công và token cũ không dùng lại được', async () => {
    const harness = createHarness();
    const rawToken = await harness.jwtService.signAsync<RefreshTokenPayload>(
      {
        sub: 'user-1',
        type: 'refresh',
        sessionId: 'session-1',
        familyId: 'family-1',
      },
      { secret: refreshSecret, expiresIn: 3600 },
    );
    const sessionRecord = {
      id: 'session-1',
      userId: 'user-1',
      familyId: 'family-1',
      tokenHash: await hash(rawToken, 4),
      revokedAt: null as Date | null,
      expiresAt: new Date(Date.now() + 60_000),
      user: createUser(await hash('Password@123', 4)),
    };
    harness.prismaMock.refreshToken.findUnique.mockResolvedValue(sessionRecord);

    const rotated = await harness.service.refresh(rawToken, metadata);
    expect(rotated.refreshToken).not.toBe(rawToken);
    expect(harness.transactionRefreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'session-1', revokedAt: null }),
      }),
    );

    sessionRecord.revokedAt = new Date();
    await expect(harness.service.refresh(rawToken, metadata)).rejects.toThrow(
      'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
    );
    expect(harness.prismaMock.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { familyId: 'family-1', revokedAt: null } }),
    );
  });

  it('logout thu hồi phiên hiện tại', async () => {
    const harness = createHarness();
    const rawToken = await harness.jwtService.signAsync<RefreshTokenPayload>(
      {
        sub: 'user-1',
        type: 'refresh',
        sessionId: 'session-1',
        familyId: 'family-1',
      },
      { secret: refreshSecret, expiresIn: 3600 },
    );

    await harness.service.logout(rawToken, metadata);
    expect(harness.prismaMock.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'session-1', userId: 'user-1', revokedAt: null },
      }),
    );
  });
});

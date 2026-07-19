import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserStatus } from '@prisma/client';
import type { PermissionCode, SystemRole } from '@school/shared-types';
import { compare, hash } from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ACCOUNT_LOCK_DURATION_MS,
  MAX_FAILED_LOGIN_ATTEMPTS,
  PASSWORD_HASH_ROUNDS,
} from './auth.constants';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import type { IssuedSession } from './interfaces/issued-session.interface';
import type { RequestMetadata } from './interfaces/request-metadata.interface';
import type { AccessTokenPayload, RefreshTokenPayload } from './interfaces/token-payload.interface';
import { parseDurationInSeconds } from './utils/duration.util';

const authenticationUserSelect = {
  id: true,
  email: true,
  passwordHash: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  status: true,
  failedLoginAttempts: true,
  lockedUntil: true,
  deletedAt: true,
  roles: {
    select: {
      role: {
        select: {
          code: true,
          permissions: {
            select: { permission: { select: { code: true } } },
          },
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

type AuthenticationUser = Prisma.UserGetPayload<{ select: typeof authenticationUserSelect }>;

@Injectable()
export class AuthService {
  private readonly dummyPasswordHash = hash(
    'EduConnect-Dummy-Password-For-Timing',
    PASSWORD_HASH_ROUNDS,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, metadata: RequestMetadata): Promise<IssuedSession> {
    const email = dto.email.trim().toLowerCase();
    let user = await this.prisma.user.findUnique({
      where: { email },
      select: authenticationUserSelect,
    });

    if (!user) {
      await compare(dto.password, await this.dummyPasswordHash);
      await this.recordLogin(null, email, false, 'INVALID_CREDENTIALS', metadata);
      throw this.invalidCredentials();
    }

    if (this.canReleaseTimedLock(user)) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { status: UserStatus.ACTIVE, failedLoginAttempts: 0, lockedUntil: null },
        select: authenticationUserSelect,
      });
    }

    if (user.deletedAt || user.status !== UserStatus.ACTIVE || this.hasActiveLock(user)) {
      await this.recordLogin(user.id, email, false, 'ACCOUNT_UNAVAILABLE', metadata);
      throw this.invalidCredentials();
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      await this.handleFailedPassword(user, metadata);
      throw this.invalidCredentials();
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
      }),
      this.prisma.loginHistory.create({
        data: {
          userId: user.id,
          emailAttempt: email,
          successful: true,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);

    return this.createSession(user, metadata);
  }

  async refresh(
    rawRefreshToken: string | undefined,
    metadata: RequestMetadata,
  ): Promise<IssuedSession> {
    const payload = await this.verifyRefreshToken(rawRefreshToken);
    const session = await this.prisma.refreshToken.findUnique({
      where: { id: payload.sessionId },
      include: {
        user: { select: authenticationUserSelect },
      },
    });

    if (!session) throw this.invalidSession();
    if (
      session.userId !== payload.sub ||
      session.familyId !== payload.familyId ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      session.user.deletedAt ||
      session.user.status !== UserStatus.ACTIVE
    ) {
      await this.revokeFamily(session.familyId, metadata.ipAddress);
      throw this.invalidSession();
    }

    const tokenMatches = await compare(rawRefreshToken!, session.tokenHash);
    if (!tokenMatches) {
      await this.revokeFamily(session.familyId, metadata.ipAddress);
      throw this.invalidSession();
    }

    const nextSessionId = randomUUID();
    const tokens = await this.signTokens(session.userId, nextSessionId, session.familyId);
    const nextTokenHash = await hash(tokens.refreshToken, PASSWORD_HASH_ROUNDS);
    const now = new Date();

    try {
      await this.prisma.$transaction(async (transaction) => {
        const revoked = await transaction.refreshToken.updateMany({
          where: { id: session.id, revokedAt: null, expiresAt: { gt: now } },
          data: {
            revokedAt: now,
            revokedByIp: metadata.ipAddress,
            replacedByTokenHash: nextTokenHash,
          },
        });
        if (revoked.count !== 1) throw this.invalidSession();

        await transaction.refreshToken.create({
          data: {
            id: nextSessionId,
            userId: session.userId,
            tokenHash: nextTokenHash,
            familyId: session.familyId,
            expiresAt: this.refreshExpirationDate(),
            createdByIp: metadata.ipAddress,
            userAgent: metadata.userAgent,
          },
        });
      });
    } catch (error) {
      await this.revokeFamily(session.familyId, metadata.ipAddress);
      if (error instanceof UnauthorizedException) throw error;
      throw this.invalidSession();
    }

    return {
      user: this.toAuthenticatedUser(session.user),
      ...tokens,
      csrfToken: randomBytes(32).toString('base64url'),
    };
  }

  async logout(rawRefreshToken: string | undefined, metadata: RequestMetadata): Promise<void> {
    if (!rawRefreshToken) return;
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(rawRefreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        ignoreExpiration: true,
      });
      if (payload.type !== 'refresh') return;
      await this.prisma.refreshToken.updateMany({
        where: { id: payload.sessionId, userId: payload.sub, revokedAt: null },
        data: { revokedAt: new Date(), revokedByIp: metadata.ipAddress },
      });
    } catch {
      return;
    }
  }

  async logoutAll(userId: string, metadata: RequestMetadata): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date(), revokedByIp: metadata.ipAddress },
    });
    return result.count;
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    metadata: RequestMetadata,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user || !(await compare(dto.currentPassword, user.passwordHash))) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }
    if (await compare(dto.newPassword, user.passwordHash)) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    const passwordHash = await hash(dto.newPassword, PASSWORD_HASH_ROUNDS);
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash, passwordChangedAt: now },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now, revokedByIp: metadata.ipAddress },
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'AUTH_PASSWORD_CHANGED',
          entityType: 'User',
          entityId: userId,
          newValues: { allSessionsRevoked: true },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);
  }

  private async createSession(
    user: AuthenticationUser,
    metadata: RequestMetadata,
  ): Promise<IssuedSession> {
    const sessionId = randomUUID();
    const familyId = randomUUID();
    const tokens = await this.signTokens(user.id, sessionId, familyId);
    const tokenHash = await hash(tokens.refreshToken, PASSWORD_HASH_ROUNDS);

    await this.prisma.refreshToken.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash,
        familyId,
        expiresAt: this.refreshExpirationDate(),
        createdByIp: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    return {
      user: this.toAuthenticatedUser(user),
      ...tokens,
      csrfToken: randomBytes(32).toString('base64url'),
    };
  }

  private async signTokens(
    userId: string,
    sessionId: string,
    familyId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: AccessTokenPayload = { sub: userId, type: 'access' };
    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
      sessionId,
      familyId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.accessTokenSeconds(),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.refreshTokenSeconds(),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(rawToken: string | undefined): Promise<RefreshTokenPayload> {
    if (!rawToken) throw this.invalidSession();
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(rawToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      if (payload.type !== 'refresh' || !payload.sessionId || !payload.familyId) {
        throw this.invalidSession();
      }
      return payload;
    } catch {
      throw this.invalidSession();
    }
  }

  private async handleFailedPassword(
    user: AuthenticationUser,
    metadata: RequestMetadata,
  ): Promise<void> {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS;
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts,
          ...(shouldLock
            ? {
                status: UserStatus.LOCKED,
                lockedUntil: new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS),
              }
            : {}),
        },
      }),
      this.prisma.loginHistory.create({
        data: {
          userId: user.id,
          emailAttempt: user.email,
          successful: false,
          failureReason: shouldLock ? 'ACCOUNT_TEMPORARILY_LOCKED' : 'INVALID_CREDENTIALS',
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);
  }

  private recordLogin(
    userId: string | null,
    emailAttempt: string,
    successful: boolean,
    failureReason: string | null,
    metadata: RequestMetadata,
  ) {
    return this.prisma.loginHistory.create({
      data: {
        userId,
        emailAttempt,
        successful,
        failureReason,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
  }

  private toAuthenticatedUser(user: AuthenticationUser): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      status: user.status,
      roles: user.roles.map(({ role }) => role.code as SystemRole),
      permissions: [
        ...new Set(
          user.roles.flatMap(({ role }) =>
            role.permissions.map(({ permission }) => permission.code as PermissionCode),
          ),
        ),
      ],
    };
  }

  private hasActiveLock(user: AuthenticationUser): boolean {
    return Boolean(user.lockedUntil && user.lockedUntil > new Date());
  }

  private canReleaseTimedLock(user: AuthenticationUser): boolean {
    return Boolean(
      user.status === UserStatus.LOCKED && user.lockedUntil && user.lockedUntil <= new Date(),
    );
  }

  private revokeFamily(familyId: string, revokedByIp: string | null) {
    return this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date(), revokedByIp },
    });
  }

  private accessTokenSeconds(): number {
    return parseDurationInSeconds(
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      15 * 60,
    );
  }

  private refreshTokenSeconds(): number {
    return parseDurationInSeconds(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      7 * 24 * 60 * 60,
    );
  }

  private refreshExpirationDate(): Date {
    return new Date(Date.now() + this.refreshTokenSeconds() * 1000);
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException('Email hoặc mật khẩu không chính xác');
  }

  private invalidSession(): UnauthorizedException {
    return new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
  }
}

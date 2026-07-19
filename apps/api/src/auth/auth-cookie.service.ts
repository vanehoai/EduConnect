import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth.constants';
import type { IssuedSession } from './interfaces/issued-session.interface';
import { parseDurationInSeconds } from './utils/duration.util';

@Injectable()
export class AuthCookieService {
  constructor(private readonly configService: ConfigService) {}

  setSessionCookies(response: Response, session: IssuedSession): void {
    response.cookie(ACCESS_TOKEN_COOKIE, session.accessToken, this.accessCookieOptions());
    response.cookie(REFRESH_TOKEN_COOKIE, session.refreshToken, this.refreshCookieOptions());
    response.cookie(CSRF_TOKEN_COOKIE, session.csrfToken, this.csrfCookieOptions());
  }

  clearSessionCookies(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.clearOptions('/'));
    response.clearCookie(REFRESH_TOKEN_COOKIE, this.clearOptions('/api/auth'));
    response.clearCookie(CSRF_TOKEN_COOKIE, this.clearOptions('/'));
  }

  private accessCookieOptions(): CookieOptions {
    return {
      ...this.baseOptions(),
      httpOnly: true,
      path: '/',
      maxAge:
        parseDurationInSeconds(
          this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
          15 * 60,
        ) * 1000,
    };
  }

  private refreshCookieOptions(): CookieOptions {
    return {
      ...this.baseOptions(),
      httpOnly: true,
      path: '/api/auth',
      maxAge:
        parseDurationInSeconds(
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
          7 * 24 * 60 * 60,
        ) * 1000,
    };
  }

  private csrfCookieOptions(): CookieOptions {
    return {
      ...this.baseOptions(),
      httpOnly: false,
      path: '/',
      maxAge:
        parseDurationInSeconds(
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
          7 * 24 * 60 * 60,
        ) * 1000,
    };
  }

  private baseOptions(): CookieOptions {
    return {
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: 'lax',
    };
  }

  private clearOptions(path: string): CookieOptions {
    return { ...this.baseOptions(), path };
  }
}

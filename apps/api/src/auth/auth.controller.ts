import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthCookieService } from './auth-cookie.service';
import { REFRESH_TOKEN_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { SkipCsrf } from './decorators/skip-csrf.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import type { RequestMetadata } from './interfaces/request-metadata.interface';

type CookieRequest = Request & { cookies?: Record<string, string> };

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Post('login')
  @Public()
  @SkipCsrf()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập bằng email và mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công và thiết lập cookie bảo mật' })
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập không chính xác' })
  @ApiResponse({ status: 429, description: 'Thử đăng nhập quá nhiều lần' })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(dto, this.requestMetadata(request));
    this.authCookieService.setSessionCookies(response, session);
    return { data: session.user, message: 'Đăng nhập thành công' };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotation access token và refresh token' })
  async refresh(@Req() request: CookieRequest, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.refresh(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
      this.requestMetadata(request),
    );
    this.authCookieService.setSessionCookies(response, session);
    return { data: session.user, message: 'Làm mới phiên đăng nhập thành công' };
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thu hồi phiên hiện tại và xóa cookie' })
  async logout(@Req() request: CookieRequest, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
      this.requestMetadata(request),
    );
    this.authCookieService.clearSessionCookies(response);
    return { data: null, message: 'Đăng xuất thành công' };
  }

  @Post('logout-all')
  @ApiCookieAuth('educonnect_access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thu hồi tất cả phiên đăng nhập của tài khoản' })
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const revokedSessions = await this.authService.logoutAll(
      user.id,
      this.requestMetadata(request),
    );
    this.authCookieService.clearSessionCookies(response);
    return {
      data: { revokedSessions },
      message: 'Đã đăng xuất khỏi tất cả thiết bị',
    };
  }

  @Get('me')
  @ApiCookieAuth('educonnect_access')
  @ApiOperation({ summary: 'Lấy thông tin người dùng và quyền hiện tại' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return { data: user, message: 'Lấy thông tin tài khoản thành công' };
  }

  @Post('change-password')
  @ApiCookieAuth('educonnect_access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu và thu hồi tất cả phiên đăng nhập' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.changePassword(user.id, dto, this.requestMetadata(request));
    this.authCookieService.clearSessionCookies(response);
    return {
      data: null,
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại',
    };
  }

  private requestMetadata(request: Request): RequestMetadata {
    const rawUserAgent = request.headers['user-agent'];
    return {
      ipAddress: (request.ip ?? request.socket.remoteAddress ?? '').slice(0, 64) || null,
      userAgent:
        (typeof rawUserAgent === 'string' ? rawUserAgent : rawUserAgent?.[0])?.slice(0, 500) ??
        null,
    };
  }
}

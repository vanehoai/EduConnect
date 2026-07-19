import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('administration')
@ApiCookieAuth('educonnect_access')
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Liệt kê tài khoản' })
  async listUsers() {
    return {
      data: await this.adminService.listUsers(),
      message: 'Lấy danh sách tài khoản thành công',
    };
  }

  @Post('users')
  @Permissions('user.create')
  @ApiOperation({ summary: 'Tạo tài khoản và gán vai trò' })
  async createUser(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateUserDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.adminService.createUser(actor.id, dto, this.requestMetadata(request)),
      message: 'Tạo tài khoản thành công',
    };
  }

  @Patch('users/:userId')
  @Permissions('user.update')
  @ApiOperation({ summary: 'Cập nhật tài khoản' })
  async updateUser(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.adminService.updateUser(
        actor.id,
        userId,
        dto,
        this.requestMetadata(request),
      ),
      message: 'Cập nhật tài khoản thành công',
    };
  }

  @Delete('users/:userId')
  @Permissions('user.delete')
  @ApiOperation({ summary: 'Xóa mềm tài khoản và thu hồi phiên' })
  async deleteUser(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    await this.adminService.deleteUser(actor.id, userId, this.requestMetadata(request));
    return { data: null, message: 'Xóa tài khoản thành công' };
  }

  @Put('users/:userId/roles')
  @Permissions('role.manage')
  @ApiOperation({ summary: 'Thay thế danh sách vai trò của tài khoản' })
  async updateUserRoles(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRolesDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.adminService.updateUserRoles(
        actor.id,
        userId,
        dto,
        this.requestMetadata(request),
      ),
      message: 'Cập nhật vai trò tài khoản thành công',
    };
  }

  @Get('roles')
  @Permissions('role.read')
  @ApiOperation({ summary: 'Liệt kê vai trò và quyền' })
  async listRoles() {
    return {
      data: await this.adminService.listRoles(),
      message: 'Lấy danh sách vai trò thành công',
    };
  }

  @Get('permissions')
  @Permissions('role.read')
  @ApiOperation({ summary: 'Liệt kê permission' })
  async listPermissions() {
    return {
      data: await this.adminService.listPermissions(),
      message: 'Lấy danh sách quyền thành công',
    };
  }

  @Put('roles/:roleId/permissions')
  @Permissions('role.manage')
  @ApiOperation({ summary: 'Thay thế permission của vai trò' })
  async updateRolePermissions(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('roleId') roleId: string,
    @Body() dto: UpdateRolePermissionsDto,
    @Req() request: Request,
  ) {
    return {
      data: await this.adminService.updateRolePermissions(
        actor.id,
        roleId,
        dto,
        this.requestMetadata(request),
      ),
      message: 'Cập nhật quyền cho vai trò thành công',
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

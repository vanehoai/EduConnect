import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PASSWORD_HASH_ROUNDS } from '../auth/auth.constants';
import type { RequestMetadata } from '../auth/interfaces/request-metadata.interface';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import type { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  status: true,
  failedLoginAttempts: true,
  lockedUntil: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  roles: { select: { role: { select: { id: true, code: true, name: true } } } },
} satisfies Prisma.UserSelect;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: safeUserSelect,
      orderBy: [{ fullName: 'asc' }, { email: 'asc' }],
    });
  }

  async createUser(actorUserId: string, dto: CreateUserDto, metadata: RequestMetadata) {
    const roles = await this.resolveRoles(dto.roleCodes);
    const passwordHash = await hash(dto.password, PASSWORD_HASH_ROUNDS);

    const user = await this.prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
          passwordHash,
          status: dto.status ?? UserStatus.ACTIVE,
          roles: {
            create: roles.map((role) => ({ roleId: role.id })),
          },
        },
        select: safeUserSelect,
      });
      await transaction.auditLog.create({
        data: {
          actorUserId,
          action: 'ADMIN_USER_CREATED',
          entityType: 'User',
          entityId: created.id,
          newValues: {
            email: created.email,
            status: created.status,
            roleCodes: dto.roleCodes,
          },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      });
      return created;
    });
    return user;
  }

  async updateUser(
    actorUserId: string,
    userId: string,
    dto: UpdateUserDto,
    metadata: RequestMetadata,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, fullName: true, phone: true, status: true },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy tài khoản');

    return this.prisma.$transaction(async (transaction) => {
      const updated = await transaction.user.update({
        where: { id: userId },
        data: dto,
        select: safeUserSelect,
      });
      if (dto.status && dto.status !== UserStatus.ACTIVE) {
        await transaction.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date(), revokedByIp: metadata.ipAddress },
        });
      }
      await transaction.auditLog.create({
        data: {
          actorUserId,
          action: 'ADMIN_USER_UPDATED',
          entityType: 'User',
          entityId: userId,
          oldValues: existing,
          newValues: {
            ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
            ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
            ...(dto.status !== undefined ? { status: dto.status } : {}),
          },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      });
      return updated;
    });
  }

  async deleteUser(actorUserId: string, userId: string, metadata: RequestMetadata): Promise<void> {
    if (actorUserId === userId) {
      throw new BadRequestException('Quản trị viên không thể tự xóa tài khoản đang đăng nhập');
    }
    const existing = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, email: true, status: true },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy tài khoản');

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: now, status: UserStatus.INACTIVE },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now, revokedByIp: metadata.ipAddress },
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId,
          action: 'ADMIN_USER_DELETED',
          entityType: 'User',
          entityId: userId,
          oldValues: existing,
          newValues: { deletedAt: now.toISOString() },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);
  }

  async updateUserRoles(
    actorUserId: string,
    userId: string,
    dto: UpdateUserRolesDto,
    metadata: RequestMetadata,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, roles: { select: { role: { select: { code: true } } } } },
    });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');
    const roles = await this.resolveRoles(dto.roleCodes);
    const oldRoleCodes = user.roles.map(({ role }) => role.code);

    await this.prisma.$transaction(async (transaction) => {
      await transaction.userRole.deleteMany({ where: { userId } });
      await transaction.userRole.createMany({
        data: roles.map((role) => ({ userId, roleId: role.id })),
      });
      await transaction.auditLog.create({
        data: {
          actorUserId,
          action: 'ADMIN_USER_ROLES_UPDATED',
          entityType: 'User',
          entityId: userId,
          oldValues: { roleCodes: oldRoleCodes },
          newValues: { roleCodes: dto.roleCodes },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      });
    });
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: safeUserSelect });
  }

  listRoles() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        isSystem: true,
        permissions: {
          select: { permission: { select: { id: true, code: true, name: true, module: true } } },
        },
        _count: { select: { users: true } },
      },
      orderBy: { code: 'asc' },
    });
  }

  listPermissions() {
    return this.prisma.permission.findMany({
      select: { id: true, code: true, name: true, description: true, module: true },
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  }

  async updateRolePermissions(
    actorUserId: string,
    roleId: string,
    dto: UpdateRolePermissionsDto,
    metadata: RequestMetadata,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      select: {
        id: true,
        code: true,
        permissions: { select: { permission: { select: { code: true } } } },
      },
    });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: dto.permissionCodes } },
      select: { id: true, code: true },
    });
    if (permissions.length !== new Set(dto.permissionCodes).size) {
      throw new BadRequestException('Danh sách quyền có phần tử không tồn tại');
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.rolePermission.deleteMany({ where: { roleId } });
      if (permissions.length) {
        await transaction.rolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId,
            permissionId: permission.id,
          })),
        });
      }
      await transaction.auditLog.create({
        data: {
          actorUserId,
          action: 'ADMIN_ROLE_PERMISSIONS_UPDATED',
          entityType: 'Role',
          entityId: roleId,
          oldValues: {
            permissionCodes: role.permissions.map(({ permission }) => permission.code),
          },
          newValues: { permissionCodes: dto.permissionCodes },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      });
    });
    return this.prisma.role.findUniqueOrThrow({
      where: { id: roleId },
      select: {
        id: true,
        code: true,
        name: true,
        permissions: { select: { permission: { select: { code: true, name: true } } } },
      },
    });
  }

  private async resolveRoles(roleCodes: string[]) {
    const uniqueRoleCodes = [...new Set(roleCodes)];
    const roles = await this.prisma.role.findMany({
      where: { code: { in: uniqueRoleCodes } },
      select: { id: true, code: true },
    });
    if (roles.length !== uniqueRoleCodes.length) {
      throw new BadRequestException('Danh sách vai trò có phần tử không tồn tại');
    }
    return roles;
  }
}

import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY, ROLES_KEY } from '../auth.constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { RolesGuard } from './roles.guard';

function contextFor(
  user: AuthenticatedUser | undefined,
  metadata: { public?: boolean; roles?: string[]; permissions?: string[] } = {},
): ExecutionContext {
  const handler = () => undefined;
  class TestController {}
  if (metadata.public) Reflect.defineMetadata(IS_PUBLIC_KEY, true, handler);
  if (metadata.roles) Reflect.defineMetadata(ROLES_KEY, metadata.roles, handler);
  if (metadata.permissions) {
    Reflect.defineMetadata(PERMISSIONS_KEY, metadata.permissions, handler);
  }
  return {
    getHandler: () => handler,
    getClass: () => TestController,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
      getResponse: () => ({}),
      getNext: () => undefined,
    }),
  } as unknown as ExecutionContext;
}

const user: AuthenticatedUser = {
  id: 'user-1',
  email: 'admin@school.local',
  fullName: 'Admin',
  phone: null,
  avatarUrl: null,
  status: 'ACTIVE',
  roles: ['ADMIN'],
  permissions: ['user.read', 'role.manage'],
};

describe('Authorization guards', () => {
  it('route public bỏ qua auth, route bảo vệ ủy quyền cho Passport JWT', () => {
    const reflector = new Reflector();
    const guard = new JwtAuthGuard(reflector);
    const basePrototype = Object.getPrototypeOf(JwtAuthGuard.prototype) as {
      canActivate: (context: ExecutionContext) => boolean;
    };
    const passportSpy = jest.spyOn(basePrototype, 'canActivate').mockReturnValue(false);

    expect(guard.canActivate(contextFor(undefined, { public: true }))).toBe(true);
    expect(guard.canActivate(contextFor(undefined))).toBe(false);
    expect(passportSpy).toHaveBeenCalledTimes(1);
  });

  it('route yêu cầu role chỉ cho vai trò phù hợp', () => {
    const guard = new RolesGuard(new Reflector());
    expect(guard.canActivate(contextFor(user, { roles: ['ADMIN'] }))).toBe(true);
    expect(() => guard.canActivate(contextFor(user, { roles: ['LECTURER'] }))).toThrow(
      'Bạn không có vai trò phù hợp',
    );
  });

  it('route yêu cầu permission chỉ cho người có đủ quyền', () => {
    const guard = new PermissionsGuard(new Reflector());
    expect(guard.canActivate(contextFor(user, { permissions: ['user.read', 'role.manage'] }))).toBe(
      true,
    );
    expect(() => guard.canActivate(contextFor(user, { permissions: ['user.delete'] }))).toThrow(
      'Bạn không có quyền',
    );
  });
});

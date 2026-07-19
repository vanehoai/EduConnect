import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { AuthCookieService } from './auth-cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('/auth/me trả thông tin an toàn, không chứa password hoặc token hash', () => {
    const controller = new AuthController({} as AuthService, {} as AuthCookieService);
    const user: AuthenticatedUser = {
      id: 'user-1',
      email: 'student@school.local',
      fullName: 'Sinh viên Mẫu',
      phone: null,
      avatarUrl: null,
      status: 'ACTIVE',
      roles: ['STUDENT'],
      permissions: ['course.read'],
    };

    const response = controller.me(user);
    expect(response.data).toEqual(user);
    expect(response.data).not.toHaveProperty('passwordHash');
    expect(response.data).not.toHaveProperty('tokenHash');
    expect(response.data).not.toHaveProperty('refreshToken');
  });
});

import type { AuthenticatedUser } from './authenticated-user.interface';

export interface IssuedSession {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

import { SetMetadata } from '@nestjs/common';
import type { PermissionCode } from '@school/shared-types';
import { PERMISSIONS_KEY } from '../auth.constants';

export const Permissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

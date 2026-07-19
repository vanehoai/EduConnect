import { SetMetadata } from '@nestjs/common';
import type { SystemRole } from '@school/shared-types';
import { ROLES_KEY } from '../auth.constants';

export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);

import { ApiProperty } from '@nestjs/swagger';
import { PERMISSION_CODES, type PermissionCode } from '@school/shared-types';
import { IsArray, IsIn } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({ enum: PERMISSION_CODES, isArray: true })
  @IsArray()
  @IsIn(PERMISSION_CODES, { each: true })
  permissionCodes!: PermissionCode[];
}

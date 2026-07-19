import { ApiProperty } from '@nestjs/swagger';
import { SYSTEM_ROLES, type SystemRole } from '@school/shared-types';
import { ArrayNotEmpty, IsArray, IsIn } from 'class-validator';

export class UpdateUserRolesDto {
  @ApiProperty({ enum: SYSTEM_ROLES, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(SYSTEM_ROLES, { each: true })
  roleCodes!: SystemRole[];
}

import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { SYSTEM_ROLES, type SystemRole } from '@school/shared-types';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'new.user@school.local' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: 'Mật khẩu phải có chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
  })
  password!: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ enum: SYSTEM_ROLES, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(SYSTEM_ROLES, { each: true })
  roleCodes!: SystemRole[];
}

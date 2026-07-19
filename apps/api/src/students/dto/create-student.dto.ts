import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicStatus, Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'SV2025001' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  studentCode!: string;

  @ApiProperty({ description: 'Tài khoản đã có role STUDENT và chưa liên kết hồ sơ khác' })
  @IsString()
  @MaxLength(100)
  userId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  departmentId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  admissionAcademicYearId?: string;

  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName!: string;

  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(255)
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ type: String, format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  cohortClass!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  cohort!: string;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  enrollmentDate!: Date;

  @ApiPropertyOptional({ enum: AcademicStatus, default: AcademicStatus.STUDYING })
  @IsOptional()
  @IsEnum(AcademicStatus)
  academicStatus?: AcademicStatus;
}

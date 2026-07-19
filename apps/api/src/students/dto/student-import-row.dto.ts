import { AcademicStatus, Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class StudentImportRowDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  studentCode!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsDateString()
  dateOfBirth?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  departmentCode!: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsString()
  @MaxLength(20)
  admissionAcademicYearCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  cohortClass!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  cohort!: string;

  @IsDateString()
  enrollmentDate!: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsEnum(AcademicStatus)
  academicStatus?: AcademicStatus;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: 'initialPassword phải có chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
  })
  initialPassword?: string;
}

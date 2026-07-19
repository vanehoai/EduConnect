import { ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum StudentSortField {
  CODE = 'studentCode',
  NAME = 'fullName',
  EMAIL = 'email',
  COHORT = 'cohort',
  STATUS = 'academicStatus',
  CREATED_AT = 'createdAt',
}

export class StudentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  cohort?: string;

  @ApiPropertyOptional({ enum: AcademicStatus })
  @IsOptional()
  @IsEnum(AcademicStatus)
  academicStatus?: AcademicStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeDeleted = false;

  @ApiPropertyOptional({ enum: StudentSortField, default: StudentSortField.CODE })
  @IsOptional()
  @IsEnum(StudentSortField)
  sortBy: StudentSortField = StudentSortField.CODE;
}

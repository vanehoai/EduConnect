import { ApiPropertyOptional } from '@nestjs/swagger';
import { LecturerStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum LecturerSortField {
  CODE = 'lecturerCode',
  NAME = 'fullName',
  EMAIL = 'email',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

export class LecturerQueryDto extends PaginationQueryDto {
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
  @MaxLength(100)
  academicRank?: string;

  @ApiPropertyOptional({ enum: LecturerStatus })
  @IsOptional()
  @IsEnum(LecturerStatus)
  status?: LecturerStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeDeleted = false;

  @ApiPropertyOptional({ enum: LecturerSortField, default: LecturerSortField.CODE })
  @IsOptional()
  @IsEnum(LecturerSortField)
  sortBy: LecturerSortField = LecturerSortField.CODE;
}

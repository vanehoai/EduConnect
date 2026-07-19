import { ApiPropertyOptional } from '@nestjs/swagger';
import { SemesterStatus, SemesterTerm } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum SemesterSortField {
  CODE = 'code',
  NAME = 'name',
  START_DATE = 'startDate',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

export class SemesterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  academicYearId?: string;

  @ApiPropertyOptional({ enum: SemesterTerm })
  @IsOptional()
  @IsEnum(SemesterTerm)
  term?: SemesterTerm;

  @ApiPropertyOptional({ enum: SemesterStatus })
  @IsOptional()
  @IsEnum(SemesterStatus)
  status?: SemesterStatus;

  @ApiPropertyOptional({ enum: SemesterSortField, default: SemesterSortField.START_DATE })
  @IsOptional()
  @IsEnum(SemesterSortField)
  sortBy: SemesterSortField = SemesterSortField.START_DATE;
}

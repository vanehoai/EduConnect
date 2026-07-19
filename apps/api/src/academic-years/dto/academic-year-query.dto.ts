import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum AcademicYearSortField {
  CODE = 'code',
  NAME = 'name',
  START_DATE = 'startDate',
  CREATED_AT = 'createdAt',
}

export class AcademicYearQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({ enum: AcademicYearSortField, default: AcademicYearSortField.START_DATE })
  @IsOptional()
  @IsEnum(AcademicYearSortField)
  sortBy: AcademicYearSortField = AcademicYearSortField.START_DATE;
}

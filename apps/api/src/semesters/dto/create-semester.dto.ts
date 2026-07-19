import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SemesterStatus, SemesterTerm } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSemesterDto {
  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty({ example: '2026-2027-HK1' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  code!: string;

  @ApiProperty({ example: 'Học kỳ 1' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ enum: SemesterTerm })
  @IsEnum(SemesterTerm)
  term!: SemesterTerm;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  registrationStartDate!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  registrationEndDate!: Date;

  @ApiPropertyOptional({ default: 24, minimum: 1, maximum: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  maxCredits?: number;

  @ApiPropertyOptional({ enum: SemesterStatus, default: SemesterStatus.PLANNED })
  @IsOptional()
  @IsEnum(SemesterStatus)
  status?: SemesterStatus;
}

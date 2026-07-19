import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { FeeCategory, FeeCalculationMethod } from '@prisma/client';

export class CreateFeeTypeDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(FeeCategory)
  @IsOptional()
  category?: FeeCategory;

  @IsEnum(FeeCalculationMethod)
  @IsOptional()
  calculationMethod?: FeeCalculationMethod;

  @IsNumber()
  @IsOptional()
  defaultAmount?: number;

  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

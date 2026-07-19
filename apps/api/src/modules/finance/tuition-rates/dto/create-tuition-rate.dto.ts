import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateTuitionRateDto {
  @IsString()
  feeTypeId!: string;

  @IsString()
  @IsOptional()
  academicYearId?: string;

  @IsString()
  @IsOptional()
  semesterId?: string;

  @IsNumber()
  @IsOptional()
  amountPerCredit?: number;

  @IsNumber()
  @IsOptional()
  fixedAmount?: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

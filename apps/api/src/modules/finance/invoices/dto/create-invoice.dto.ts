import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @IsString()
  @IsOptional()
  tuitionItemId?: string;

  @IsString()
  @IsOptional()
  feeTypeId?: string;

  @IsString()
  description!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  unitAmount!: number;

  @IsNumber()
  totalAmount!: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  semesterId!: string;

  @IsDateString()
  dueDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items!: InvoiceItemDto[];
}

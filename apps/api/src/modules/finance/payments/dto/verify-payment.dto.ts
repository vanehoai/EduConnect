import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  transactionCode!: string;

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsOptional()
  externalTransactionId?: string;
}

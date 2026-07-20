import { IsNotEmpty, IsString } from 'class-validator';

export class EvaluateRisksDto {
  @IsNotEmpty({ message: 'semesterId là bắt buộc' })
  @IsString()
  semesterId!: string;

  @IsString()
  studentId?: string;
}

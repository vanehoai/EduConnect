import { GradeComponentType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateGradeComponentDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(GradeComponentType)
  type!: GradeComponentType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  weight!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxScore!: number;
}

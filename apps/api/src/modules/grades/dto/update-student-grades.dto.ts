import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateStudentGradeDto {
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  score!: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class BulkUpdateGradesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStudentGradeDto)
  grades!: UpdateStudentGradeDto[];
}

import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  ValidateNested, 
  IsArray, 
  Min
} from 'class-validator';
import { DifficultyLevel, QuestionType } from '@prisma/client';

export class QuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionCode!: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  chapter?: string;

  @IsEnum(DifficultyLevel)
  @IsNotEmpty()
  difficulty!: DifficultyLevel;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type!: QuestionType;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultScore?: number;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  @IsOptional()
  options?: QuestionOptionDto[];
}

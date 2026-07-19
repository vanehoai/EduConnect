import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  IsDate,
  Min
} from 'class-validator';
import { ShowResultMode } from '@prisma/client';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  examCode!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsString()
  @IsNotEmpty()
  classSectionId!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startsAt!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endsAt!: Date;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  durationMinutes!: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxAttempts?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  passScore!: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  questionCount!: number;

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;

  @IsBoolean()
  @IsOptional()
  showResult?: boolean;

  @IsEnum(ShowResultMode)
  @IsOptional()
  showResultMode?: ShowResultMode;

  @IsBoolean()
  @IsOptional()
  allowReview?: boolean;

  @IsBoolean()
  @IsOptional()
  allowLateStart?: boolean;

  @IsBoolean()
  @IsOptional()
  autoSubmit?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  answerPublishAt?: Date;
}

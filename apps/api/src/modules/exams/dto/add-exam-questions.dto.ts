import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ExamQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsNumber()
  @Min(0)
  points!: number;

  @IsNumber()
  displayOrder!: number;
}

export class AddExamQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamQuestionDto)
  questions!: ExamQuestionDto[];
}

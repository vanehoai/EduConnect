import { IsString, IsInt, IsOptional, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { ClassSectionStatus } from '@prisma/client';

export class CreateClassSectionDto {
  @IsString()
  @IsNotEmpty()
  sectionCode!: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsString()
  @IsNotEmpty()
  semesterId!: string;

  @IsString()
  @IsNotEmpty()
  lecturerId!: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsInt()
  @Min(1)
  maxCapacity!: number;
}

export class UpdateClassSectionDto {
  @IsString()
  @IsOptional()
  sectionCode?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  semesterId?: string;

  @IsString()
  @IsOptional()
  lecturerId?: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxCapacity?: number;

  @IsEnum(ClassSectionStatus)
  @IsOptional()
  status?: ClassSectionStatus;
}

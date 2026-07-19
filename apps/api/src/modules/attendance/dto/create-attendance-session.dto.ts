import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceSessionDto {
  @IsNotEmpty()
  @IsString()
  classSectionId!: string;

  @IsNotEmpty()
  @IsDateString()
  sessionDate!: string;

  @IsNotEmpty()
  @IsDateString()
  startTime!: string;

  @IsNotEmpty()
  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

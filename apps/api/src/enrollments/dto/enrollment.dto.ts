import { IsNotEmpty, IsString } from 'class-validator';

export class AdminEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @IsNotEmpty()
  @IsString()
  classSectionId!: string;
}

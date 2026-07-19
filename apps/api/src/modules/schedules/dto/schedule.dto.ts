import { IsString, IsInt, IsOptional, Min, Max, IsDateString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  classSectionId!: string;

  @IsInt()
  @Min(0)
  @Max(6) // 0 (Sunday) to 6 (Saturday)
  dayOfWeek!: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm:ss format',
  })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm:ss format',
  })
  endTime!: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validTo?: string;
}

export class UpdateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsOptional()
  dayOfWeek?: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  @IsOptional()
  startTime?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validTo?: string;
}

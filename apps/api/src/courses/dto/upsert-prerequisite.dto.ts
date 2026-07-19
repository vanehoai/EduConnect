import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddPrerequisiteDto {
  @ApiProperty()
  @IsString()
  prerequisiteCourseId!: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  minimumGrade?: number;
}

export class UpdatePrerequisiteDto {
  @ApiPropertyOptional({ nullable: true, minimum: 0, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  minimumGrade?: number | null;
}

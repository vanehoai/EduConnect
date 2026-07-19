import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutoSaveAnswerDto {
  @ApiProperty({ type: [String], description: 'List of selected option IDs' })
  @IsArray()
  @IsString({ each: true })
  selectedOptionIds!: string[];
}

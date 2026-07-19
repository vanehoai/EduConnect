import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @ApiPropertyOptional({ nullable: true, description: 'Giảng viên thuộc chính khoa này' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  headLecturerId?: string | null;
}

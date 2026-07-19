import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ImportStudentsQueryDto {
  @ApiPropertyOptional({
    default: true,
    description: 'true: có dòng lỗi thì không tạo dữ liệu; false: bỏ qua dòng lỗi',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  atomic = true;
}

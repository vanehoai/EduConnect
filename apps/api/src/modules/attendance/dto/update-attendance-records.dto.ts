import { AttendanceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateAttendanceRecordDto {
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkUpdateAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAttendanceRecordDto)
  records!: UpdateAttendanceRecordDto[];
}

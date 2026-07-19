import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@school.local' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Vui lòng nhập mật khẩu' })
  @MaxLength(128)
  password!: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class DismissAcademicRiskDto {
  @IsNotEmpty({ message: 'Lý do bỏ qua là bắt buộc' })
  @IsString()
  dismissReason!: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class ResolveAcademicRiskDto {
  @IsNotEmpty({ message: 'Ghi chú giải quyết là bắt buộc' })
  @IsString()
  resolutionNote!: string;
}

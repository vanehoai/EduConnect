import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

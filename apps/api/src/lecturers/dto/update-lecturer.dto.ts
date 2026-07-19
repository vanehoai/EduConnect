import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLecturerDto } from './create-lecturer.dto';

export class UpdateLecturerDto extends PartialType(
  OmitType(CreateLecturerDto, ['userId'] as const),
) {}

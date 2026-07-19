import { PartialType } from '@nestjs/swagger';
import { CreateTuitionRateDto } from './create-tuition-rate.dto';

export class UpdateTuitionRateDto extends PartialType(CreateTuitionRateDto) {}

import { Module } from '@nestjs/common';
import { TuitionRatesService } from './tuition-rates.service';
import { TuitionRatesController } from './tuition-rates.controller';

@Module({
  controllers: [TuitionRatesController],
  providers: [TuitionRatesService],
  exports: [TuitionRatesService],
})
export class TuitionRatesModule {}

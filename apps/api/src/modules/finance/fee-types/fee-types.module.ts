import { Module } from '@nestjs/common';
import { FeeTypesService } from './fee-types.service';
import { FeeTypesController } from './fee-types.controller';

@Module({
  controllers: [FeeTypesController],
  providers: [FeeTypesService],
  exports: [FeeTypesService],
})
export class FeeTypesModule {}

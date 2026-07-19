import { Module } from '@nestjs/common';
import { FeeTypesModule } from './fee-types/fee-types.module';
import { TuitionRatesModule } from './tuition-rates/tuition-rates.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';

@Module({
  imports: [FeeTypesModule, TuitionRatesModule, ScholarshipsModule, InvoicesModule, PaymentsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class FinanceModule {}

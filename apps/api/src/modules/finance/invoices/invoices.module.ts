import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoiceCalculationService } from './invoice-calculation.service';
import { InvoicesController } from './invoices.controller';
import { AuditModule } from '../../../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceCalculationService],
  exports: [InvoicesService],
})
export class InvoicesModule {}

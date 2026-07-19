import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Permissions } from '../../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Permissions('invoice.create')
  create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.invoicesService.create(createInvoiceDto, user.id);
  }

  @Post('preview')
  @Permissions('invoice.create')
  preview(@Body('studentId') studentId: string, @Body('semesterId') semesterId: string) {
    return this.invoicesService.previewGeneration(studentId, semesterId);
  }

  @Post('generate')
  @Permissions('invoice.create')
  generate(
    @Body('studentId') studentId: string,
    @Body('semesterId') semesterId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invoicesService.generateInvoice(studentId, semesterId, user.id);
  }

  @Get()
  @Permissions('invoice.read')
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @Permissions('invoice.read')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id/issue')
  @Permissions('invoice.issue')
  issue(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.invoicesService.issue(id, user.id);
  }

  @Patch(':id/cancel')
  @Permissions('invoice.cancel')
  cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invoicesService.cancel(id, reason, user.id);
  }
}

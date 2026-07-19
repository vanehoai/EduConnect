import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Permissions } from '../../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('verify')
  @Permissions('payment.verify')
  verifyPayment(@Body() dto: VerifyPaymentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.verifyPayment(dto, user.id);
  }

  @Post(':id/cancel')
  @Permissions('payment.cancel')
  cancelPayment(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.cancelPayment(id, reason, user.id);
  }

  @Get()
  @Permissions('payment.read')
  findAll() {
    return this.paymentsService.findAll();
  }
}

import { Injectable, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditService } from '../../../audit/audit.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentStatus, InvoiceStatus, NotificationType, ReceiptStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async verifyPayment(dto: VerifyPaymentDto, actorId: string) {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          // Idempotency check: ensure we haven't processed this key before
          const existingTxn = await tx.paymentTransaction.findUnique({
            where: { idempotencyKey: dto.idempotencyKey },
          });

          if (existingTxn) {
            if (existingTxn.status === PaymentStatus.VERIFIED) {
              return existingTxn; // return existing successful result
            }
            throw new ConflictException(
              'Payment with this idempotency key already processed but not verified',
            );
          }

          // Find the transaction by code
          const payment = await tx.paymentTransaction.findUnique({
            where: { transactionCode: dto.transactionCode },
            include: { invoice: true, student: { include: { user: true } } },
          });

          if (!payment) throw new BadRequestException('Transaction not found');
          if (payment.status === PaymentStatus.VERIFIED)
            throw new BadRequestException('Transaction already verified');

          // Update payment transaction
          const updatedPayment = await tx.paymentTransaction.update({
            where: { id: payment.id },
            data: {
              status: PaymentStatus.VERIFIED,
              verifiedAt: new Date(),
              verifiedByUserId: actorId,
              idempotencyKey: dto.idempotencyKey,
              externalTransactionId: dto.externalTransactionId,
              amount: dto.amount,
              completedAt: new Date(),
            },
          });

          // Allocate payment to invoice
          if (payment.invoice) {
            const invoice = payment.invoice;
            const newPaidAmount = new Prisma.Decimal(invoice.paidAmount.toString()).add(
              new Prisma.Decimal(dto.amount.toString()),
            );
            const newBalanceAmount = new Prisma.Decimal(invoice.totalAmount.toString()).sub(
              newPaidAmount,
            );

            let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
            if (newBalanceAmount.lessThanOrEqualTo(0)) {
              newStatus = InvoiceStatus.PAID;
            }

            await tx.invoice.update({
              where: { id: invoice.id },
              data: {
                paidAmount: newPaidAmount,
                balanceAmount: newBalanceAmount,
                status: newStatus,
              },
            });

            await tx.paymentAllocation.create({
              data: {
                paymentTransactionId: updatedPayment.id,
                invoiceId: invoice.id,
                amount: dto.amount,
              },
            });

            // Generate Receipt
            await tx.receipt.create({
              data: {
                receiptNumber: `RCT-${Date.now()}`,
                invoiceId: invoice.id,
                paymentTransactionId: updatedPayment.id,
                amount: dto.amount,
                issuedByUserId: actorId,
                status: ReceiptStatus.ISSUED,
              },
            });

            // Send notification
            if (payment.student && payment.student.userId) {
              await tx.notification.create({
                data: {
                  userId: payment.student.userId,
                  type: NotificationType.PAYMENT_SUCCESS,
                  title: 'Payment Verified',
                  content: `Your payment of ${dto.amount} has been successfully verified for invoice ${invoice.invoiceCode}.`,
                },
              });
            }
          }

          return updatedPayment;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ); // Ensure concurrency safety
    } catch (error) {
      this.logger.error('Error verifying payment', error);
      throw error;
    }
  }

  async cancelPayment(paymentId: string, reason: string, actorId: string) {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const payment = await tx.paymentTransaction.findUnique({
            where: { id: paymentId },
            include: { allocations: true, invoice: true },
          });

          if (!payment) throw new BadRequestException('Payment not found');
          if (payment.status !== PaymentStatus.VERIFIED) {
            throw new BadRequestException('Can only cancel VERIFIED payments');
          }

          // Cancel Payment
          const updatedPayment = await tx.paymentTransaction.update({
            where: { id: paymentId },
            data: { status: PaymentStatus.CANCELLED },
          });

          // Reverse Allocations
          for (const allocation of payment.allocations) {
            const invoice = await tx.invoice.findUnique({ where: { id: allocation.invoiceId } });
            if (invoice) {
              const newPaidAmount = new Prisma.Decimal(invoice.paidAmount.toString()).sub(
                new Prisma.Decimal(allocation.amount.toString()),
              );
              const newBalanceAmount = new Prisma.Decimal(invoice.totalAmount.toString()).sub(
                newPaidAmount,
              );

              let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
              if (newPaidAmount.lessThanOrEqualTo(0)) {
                newStatus = InvoiceStatus.ISSUED; // Revert to ISSUED if fully unpaid
              }

              await tx.invoice.update({
                where: { id: invoice.id },
                data: {
                  paidAmount: newPaidAmount,
                  balanceAmount: newBalanceAmount,
                  status: newStatus,
                },
              });

              // Delete or mark allocation as reversed (if schema supports it, for now delete)
              await tx.paymentAllocation.delete({ where: { id: allocation.id } });
            }
          }

          // Cancel Receipt
          const receipt = await tx.receipt.findFirst({
            where: { paymentTransactionId: paymentId },
          });
          if (receipt) {
            await tx.receipt.update({
              where: { id: receipt.id },
              data: { status: ReceiptStatus.CANCELLED },
            });
          }

          // Audit Log
          await tx.auditLog.create({
            data: {
              actorUserId: actorId,
              action: 'CANCEL_PAYMENT',
              entityType: 'PaymentTransaction',
              entityId: paymentId,
              newValues: { status: PaymentStatus.CANCELLED, reason } as Prisma.InputJsonValue,
              ipAddress: 'system',
              userAgent: 'system',
              createdAt: new Date(),
            },
          });

          return updatedPayment;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      this.logger.error('Error cancelling payment', error);
      throw error;
    }
  }

  findAll() {
    return this.prisma.paymentTransaction.findMany();
  }
}

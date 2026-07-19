import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditService } from '../../../audit/audit.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus, NotificationType, Prisma } from '@prisma/client';
import { InvoiceCalculationService } from './invoice-calculation.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly calculation: InvoiceCalculationService,
  ) {}

  async previewGeneration(studentId: string, semesterId: string) {
    return this.calculation.calculate(studentId, semesterId);
  }

  async generateInvoice(studentId: string, semesterId: string, actorId: string) {
    const preview = await this.calculation.calculate(studentId, semesterId);
    if (!preview.eligibleToGenerate) {
      throw new BadRequestException('Cannot generate invoice: ' + preview.warnings.join(', '));
    }

    return this.prisma.$transaction(
      async (tx) => {
        // 1. Concurrency & duplicate check
        const existing = await tx.invoice.findFirst({
          where: {
            studentId,
            semesterId,
            status: { not: InvoiceStatus.CANCELLED },
          },
        });
        if (existing) {
          throw new BadRequestException(
            'Active invoice already exists for this student and semester.',
          );
        }

        // 2. Create invoice
        const invoiceCode = `INV-${semesterId.substring(0, 4).toUpperCase()}-${Date.now()}`;

        const invoice = await tx.invoice.create({
          data: {
            invoiceCode,
            studentId,
            semesterId,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
            subtotal: preview.subtotal.toString(),
            totalAmount: preview.totalAmount.toString(),
            balanceAmount: preview.totalAmount.toString(),
            status: InvoiceStatus.DRAFT,
            items: {
              create: preview.items.map((item) => ({
                description: `Học phí môn ${item.courseName}`,
                quantity: item.quantity,
                unitAmount: item.unitAmount.toString(),
                totalAmount: item.totalAmount.toString(),
                feeTypeId: item.feeTypeId,
              })),
            },
          },
        });

        await tx.auditLog.create({
          data: {
            actorUserId: actorId,
            action: 'GENERATE_INVOICE',
            entityType: 'Invoice',
            entityId: invoice.id,
            newValues: invoice as unknown as Prisma.InputJsonValue,
            ipAddress: 'system',
            userAgent: 'system',
            createdAt: new Date(),
          },
        });

        return invoice;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async create(dto: CreateInvoiceDto, actorId: string) {
    const subtotal = dto.items.reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const invoiceCode = `INV-${Date.now()}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceCode,
        studentId: dto.studentId,
        semesterId: dto.semesterId,
        dueDate: new Date(dto.dueDate),
        subtotal,
        totalAmount: subtotal,
        balanceAmount: subtotal,
        status: InvoiceStatus.DRAFT,
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: dto.items.map((i: any) => ({
            description: i.description as string,
            quantity: i.quantity as number,
            unitAmount: i.unitAmount as number,
            totalAmount: i.totalAmount as number,
            feeTypeId: i.feeTypeId as string,
            tuitionItemId: i.tuitionItemId as string,
          })),
        },
      },
    });

    await this.audit.record({
      actorUserId: actorId,
      action: 'CREATE_INVOICE',
      entityType: 'Invoice',
      entityId: invoice.id,
      newValues: invoice as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: 'system', userAgent: 'system' },
    });

    return invoice;
  }

  findAll() {
    return this.prisma.invoice.findMany({ include: { items: true } });
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
  }

  async issue(id: string, actorId: string) {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.ISSUED,
        issueDate: new Date(),
        issuedByUserId: actorId,
        issuedAt: new Date(),
      },
      include: { student: true },
    });

    await this.audit.record({
      actorUserId: actorId,
      action: 'ISSUE_INVOICE',
      entityType: 'Invoice',
      entityId: id,
      newValues: { status: InvoiceStatus.ISSUED } as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: 'system', userAgent: 'system' },
    });

    // Notify student
    if (invoice.student && invoice.student.userId) {
      await this.prisma.notification.create({
        data: {
          userId: invoice.student.userId,
          type: NotificationType.INVOICE_CREATED,
          title: 'New Invoice Issued',
          content: `Invoice ${invoice.invoiceCode} has been issued and is due on ${invoice.dueDate.toISOString()}.`,
        },
      });
    }

    return invoice;
  }

  async cancel(id: string, reason: string, actorId: string) {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.CANCELLED,
        cancelledByUserId: actorId,
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });

    await this.audit.record({
      actorUserId: actorId,
      action: 'CANCEL_INVOICE',
      entityType: 'Invoice',
      entityId: id,
      newValues: {
        status: InvoiceStatus.CANCELLED,
        cancelReason: reason,
      } as unknown as Prisma.InputJsonValue,
      metadata: { ipAddress: 'system', userAgent: 'system' },
    });

    return invoice;
  }
}

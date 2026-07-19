import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaymentStatus, InvoiceStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(semesterId: string) {
    // totalInvoiced: sum of totalAmount of all non-cancelled invoices
    const invoices = await this.prisma.invoice.findMany({
      where: {
        semesterId,
        status: { not: InvoiceStatus.CANCELLED },
      },
      select: { totalAmount: true, balanceAmount: true },
    });

    let totalInvoiced = new Prisma.Decimal(0);
    let totalOutstanding = new Prisma.Decimal(0);

    for (const inv of invoices) {
      totalInvoiced = totalInvoiced.add(new Prisma.Decimal(inv.totalAmount.toString()));
      totalOutstanding = totalOutstanding.add(new Prisma.Decimal(inv.balanceAmount.toString()));
    }

    // totalPaid: sum of amount of all VERIFIED payments
    const payments = await this.prisma.paymentTransaction.findMany({
      where: {
        invoice: { semesterId },
        status: PaymentStatus.VERIFIED,
      },
      select: { amount: true },
    });

    let totalPaid = new Prisma.Decimal(0);
    for (const p of payments) {
      totalPaid = totalPaid.add(new Prisma.Decimal(p.amount.toString()));
    }

    let collectionRate = new Prisma.Decimal(0);
    if (!totalInvoiced.equals(0)) {
      collectionRate = totalPaid.div(totalInvoiced).mul(100);
    }

    return {
      semesterId,
      totalInvoiced: totalInvoiced.toString(),
      totalPaid: totalPaid.toString(),
      totalOutstanding: totalOutstanding.toString(),
      collectionRate: collectionRate.toFixed(2),
      currency: 'VND',
    };
  }

  async getOutstanding(semesterId: string) {
    return this.prisma.invoice.findMany({
      where: {
        semesterId,
        status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
        balanceAmount: { gt: 0 },
      },
      include: {
        student: { include: { user: true } },
      },
    });
  }

  escapeCsv(val: unknown): string {
    if (val === null || val === undefined) return '';
    let str = String(val);
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = "'" + str;
    }
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  async exportOutstandingCsv(semesterId: string): Promise<string> {
    const invoices = await this.getOutstanding(semesterId);
    const headers = [
      'Invoice Number',
      'Student Code',
      'Student Name',
      'Total Amount',
      'Balance Amount',
      'Status',
    ];

    const rows = invoices.map((inv) => {
      const anyInv = inv as typeof inv & {
        student?: { studentCode: string; user?: { fullName: string } };
      };
      const studentName = anyInv.student?.user?.fullName || anyInv.student?.studentCode || '';
      return [
        anyInv.invoiceCode || anyInv.id,
        anyInv.student?.studentCode || '',
        studentName,
        anyInv.totalAmount?.toString() || '0',
        anyInv.balanceAmount?.toString() || '0',
        anyInv.status,
      ];
    });

    const csvContent = [
      headers.map(this.escapeCsv).join(','),
      ...rows.map((row) => row.map(this.escapeCsv).join(',')),
    ].join('\n');

    return csvContent;
  }
}

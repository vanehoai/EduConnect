'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService, InvoiceDto } from '@/lib/services/finance.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { CreditCard, Wallet, Receipt, LoaderCircle, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function StudentFinancePage() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: () => FinanceService.getInvoices().then((res) => res.data), // Typically this would be a specific endpoint for the student
  });

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Đã thanh toán',
          className:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        };
      case 'PARTIAL':
        return {
          label: 'Thanh toán 1 phần',
          className:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        };
      case 'UNPAID':
        return {
          label: 'Chưa thanh toán',
          className:
            'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          className:
            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };
      default:
        return { label: status, className: '' };
    }
  };

  const handlePayment = () => {
    // Mock payment processing
    alert(`Đang xử lý thanh toán cho hóa đơn ${selectedInvoice?.invoiceCode}`);
    setIsPaymentOpen(false);
  };

  const totalDebt =
    invoices?.reduce((acc: number, inv: InvoiceDto) => {
      if (inv.status === 'UNPAID' || inv.status === 'PARTIAL') {
        return acc + (inv.balanceAmount || 0);
      }
      return acc;
    }, 0) || 0;

  const totalPaid =
    invoices?.reduce((acc: number, inv: InvoiceDto) => {
      return acc + ((inv.totalAmount || 0) - (inv.balanceAmount || 0));
    }, 0) || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tài chính - Học phí"
        description="Tra cứu hóa đơn học phí và thực hiện thanh toán trực tuyến."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng nợ hiện tại"
          value={`${totalDebt.toLocaleString('vi-VN')} đ`}
          icon={Wallet}
          trend={totalDebt > 0 ? 'down' : 'neutral'}
          trendValue={totalDebt > 0 ? 'Cần thanh toán' : 'Đã hoàn thành'}
          className={totalDebt > 0 ? 'border-destructive/30' : ''}
        />
        <StatCard
          title="Đã thanh toán"
          value={`${totalPaid.toLocaleString('vi-VN')} đ`}
          icon={CheckCircle}
          trend="up"
          trendValue="Lũy kế"
        />
        <StatCard
          title="Số hóa đơn"
          value={invoices?.length || 0}
          icon={Receipt}
          description="Tổng số hóa đơn được phát hành"
        />
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="text-lg">Danh sách hóa đơn</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-slate-500">
                <LoaderCircle className="mb-2 h-6 w-6 animate-spin" />
                Đang tải dữ liệu hóa đơn...
              </div>
            ) : invoices?.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-muted-foreground p-8">
                <Receipt className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium">Không có hóa đơn nào</p>
                <p className="text-sm mt-1">
                  Hiện tại bạn không có hóa đơn học phí nào cần thanh toán.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Mã HĐ / Học kỳ</TableHead>
                    <TableHead className="text-right font-semibold">Tổng tiền</TableHead>
                    <TableHead className="text-right font-semibold">Đã nộp</TableHead>
                    <TableHead className="text-right font-semibold">Còn nợ</TableHead>
                    <TableHead className="text-center font-semibold">Trạng thái</TableHead>
                    <TableHead className="text-right font-semibold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((item: InvoiceDto) => {
                    const statusDisplay = getStatusDisplay(item.status);
                    const canPay = item.status === 'UNPAID' || item.status === 'PARTIAL';

                    return (
                      <TableRow
                        key={item.id}
                        className={cn(
                          'transition-colors',
                          canPay ? 'bg-red-500/5 hover:bg-red-500/10' : '',
                        )}
                      >
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {item.invoiceCode}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.semester?.name}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.totalAmount?.toLocaleString('vi-VN')} đ
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {(item.totalAmount - (item.balanceAmount || 0)).toLocaleString('vi-VN')} đ
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              'font-semibold',
                              canPay
                                ? 'text-destructive'
                                : 'text-emerald-600 dark:text-emerald-400',
                            )}
                          >
                            {item.balanceAmount?.toLocaleString('vi-VN')} đ
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn('font-normal', statusDisplay.className)}
                          >
                            {statusDisplay.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {canPay ? (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => {
                                setSelectedInvoice(item);
                                setIsPaymentOpen(true);
                              }}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Thanh toán
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Hoàn tất
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanh toán hóa đơn</DialogTitle>
            <DialogDescription>
              Thanh toán trực tuyến cho hóa đơn{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedInvoice?.invoiceCode}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
              <span className="text-sm text-muted-foreground mb-1">Số tiền thanh toán</span>
              <span className="text-3xl font-bold text-primary">
                {selectedInvoice?.balanceAmount?.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Phương thức thanh toán</Label>
              <div className="grid gap-3">
                <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="VNPAY"
                      className="h-4 w-4 text-primary"
                      defaultChecked
                    />
                    <div className="font-medium">Cổng thanh toán VNPAY</div>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="MOMO"
                      className="h-4 w-4 text-primary"
                    />
                    <div className="font-medium">Ví điện tử MoMo</div>
                  </div>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="BANK_TRANSFER"
                      className="h-4 w-4 text-primary"
                    />
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                  </div>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handlePayment} className="w-full sm:w-auto">
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

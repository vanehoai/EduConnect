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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

export default function StudentFinancePage() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: () => FinanceService.getInvoices().then((res) => res.data), // Typically this would be a specific endpoint for the student
  });

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500">Đã thanh toán</Badge>;
      case 'PARTIAL':
        return <Badge className="bg-yellow-500">Thanh toán một phần</Badge>;
      case 'UNPAID':
        return <Badge className="bg-red-500">Chưa thanh toán</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tài chính - Học phí</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nợ hiện tại</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalDebt.toLocaleString('vi-VN')} đ
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hóa đơn học phí</CardTitle>
          <CardDescription>Danh sách các hóa đơn học phí của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Đã nộp</TableHead>
                <TableHead>Còn nợ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : invoices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Bạn không có hóa đơn nào
                  </TableCell>
                </TableRow>
              ) : (
                invoices?.map((item: InvoiceDto) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.invoiceCode}</TableCell>
                    <TableCell>{item.semester?.name}</TableCell>
                    <TableCell>{item.totalAmount?.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      {(item.totalAmount - (item.balanceAmount || 0)).toLocaleString('vi-VN')} đ
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      {item.balanceAmount?.toLocaleString('vi-VN')} đ
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      {(item.status === 'UNPAID' || item.status === 'PARTIAL') && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(item);
                            setIsPaymentOpen(true);
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Thanh toán
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanh toán hóa đơn</DialogTitle>
            <DialogDescription>
              Thanh toán cho hóa đơn {selectedInvoice?.invoiceCode}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Số tiền cần thanh toán</label>
              <div className="text-2xl font-bold text-red-600">
                {selectedInvoice?.balanceAmount?.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phương thức thanh toán</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="VNPAY">Cổng thanh toán VNPAY</option>
                <option value="MOMO">Ví MoMo</option>
                <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handlePayment}>Tiến hành thanh toán</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

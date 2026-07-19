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
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => FinanceService.getInvoices().then((res) => res.data),
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hóa đơn học phí</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Tạo hóa đơn
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã HĐ</TableHead>
              <TableHead>Sinh viên</TableHead>
              <TableHead>Học kỳ</TableHead>
              <TableHead>Tổng tiền</TableHead>
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
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              invoices?.map((item: InvoiceDto) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.invoiceCode}</TableCell>
                  <TableCell>
                    {item.student?.user?.fullName} ({item.student?.studentCode})
                  </TableCell>
                  <TableCell>{item.semester?.name}</TableCell>
                  <TableCell>{item.totalAmount?.toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell className="font-semibold text-red-600">
                    {item.balanceAmount?.toLocaleString('vi-VN')} đ
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

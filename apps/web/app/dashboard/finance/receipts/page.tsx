'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService, ReceiptDto } from '@/lib/services/finance.service';
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

export default function ReceiptsPage() {
  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => FinanceService.getReceipts().then((res) => res.data),
  });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Badge variant="outline">Tiền mặt</Badge>;
      case 'BANK_TRANSFER':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Chuyển khoản
          </Badge>
        );
      case 'CREDIT_CARD':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Thẻ tín dụng
          </Badge>
        );
      case 'E_WALLET':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Ví điện tử
          </Badge>
        );
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Phiếu thu</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã PT</TableHead>
              <TableHead>Mã HĐ</TableHead>
              <TableHead>Sinh viên</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Ngày thanh toán</TableHead>
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
            ) : receipts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              receipts?.map((item: ReceiptDto) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.receiptNumber}</TableCell>
                  <TableCell>{item.invoice?.invoiceCode}</TableCell>
                  <TableCell>
                    {item.student?.user?.fullName} ({item.student?.studentCode})
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {item.amount?.toLocaleString('vi-VN')} đ
                  </TableCell>
                  <TableCell>{getMethodBadge(item.paymentMethod)}</TableCell>
                  <TableCell>
                    {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : ''}
                  </TableCell>
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

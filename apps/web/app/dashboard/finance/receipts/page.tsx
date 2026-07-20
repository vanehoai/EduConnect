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
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Eye, LoaderCircle, Receipt, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ReceiptsPage() {
  const [search, setSearch] = useState('');

  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => FinanceService.getReceipts().then((res) => res.data),
  });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'CASH':
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Tiền mặt
          </Badge>
        );
      case 'BANK_TRANSFER':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
          >
            Chuyển khoản
          </Badge>
        );
      case 'CREDIT_CARD':
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
          >
            Thẻ tín dụng
          </Badge>
        );
      case 'E_WALLET':
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
          >
            Ví điện tử
          </Badge>
        );
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Danh sách phiếu thu"
        description="Quản lý và tra cứu thông tin biên lai thu tiền học phí từ sinh viên."
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between bg-muted/20">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã PT, mã HĐ, tên SV..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Mã PT / HĐ</TableHead>
                  <TableHead className="min-w-[200px]">Sinh viên</TableHead>
                  <TableHead className="text-right">Số tiền thu</TableHead>
                  <TableHead className="text-center">Phương thức thanh toán</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      <LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải danh sách phiếu thu...
                    </TableCell>
                  </TableRow>
                ) : receipts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <Receipt className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không tìm thấy phiếu thu nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  receipts?.map((item: ReceiptDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell>
                        <div className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.receiptNumber}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          HĐ: {item.invoice?.invoiceCode || '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {item.student?.user?.fullName || 'Không rõ'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.student?.studentCode || 'Không rõ mã'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.amount?.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell className="text-center">
                        {getMethodBadge(item.paymentMethod)}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {item.paymentDate
                          ? new Date(item.paymentDate).toLocaleDateString('vi-VN')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xem chi tiết"
                          className="text-slate-500 hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

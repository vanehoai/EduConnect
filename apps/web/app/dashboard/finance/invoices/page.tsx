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
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { FileText, LoaderCircle, Eye, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function InvoicesPage() {
  const [search, setSearch] = useState('');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => FinanceService.getInvoices().then((res) => res.data),
  });

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hóa đơn học phí"
        description="Quản lý và theo dõi các khoản thu học phí của sinh viên."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo hóa đơn mới
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between bg-muted/20">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã hóa đơn, tên sinh viên..."
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
                  <TableHead className="w-[140px]">Mã HĐ</TableHead>
                  <TableHead className="min-w-[200px]">Sinh viên</TableHead>
                  <TableHead>Học kỳ</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead className="text-right">Còn nợ</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      <LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải danh sách hóa đơn...
                    </TableCell>
                  </TableRow>
                ) : invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <FileText className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không tìm thấy hóa đơn nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((item: InvoiceDto) => {
                    const statusDisplay = getStatusDisplay(item.status);

                    return (
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                      >
                        <TableCell>
                          <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.invoiceCode}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {item.student?.user?.fullName || 'Không rõ'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.student?.studentCode || 'Không rõ mã'}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {item.semester?.name}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.totalAmount?.toLocaleString('vi-VN')} đ
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              'font-semibold',
                              item.balanceAmount > 0
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
                            className={cn('font-normal border', statusDisplay.className)}
                          >
                            {statusDisplay.label}
                          </Badge>
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

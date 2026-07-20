'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService, TuitionRateDto } from '@/lib/services/finance.service';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Edit2, Trash2, LoaderCircle, Landmark } from 'lucide-react';

export default function TuitionRatesPage() {
  const { data: tuitionRates, isLoading } = useQuery({
    queryKey: ['tuition-rates'],
    queryFn: () => FinanceService.getTuitionRates().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Định mức học phí"
        description="Quản lý và thiết lập mức thu học phí theo tín chỉ cho từng ngành và khóa học."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm định mức
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Năm học</TableHead>
                  <TableHead>Ngành / Khoa</TableHead>
                  <TableHead className="text-right">Mức phí (VND/Tín chỉ)</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                      <LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : tuitionRates?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      <Landmark className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không có định mức học phí nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  tuitionRates?.map((item: TuitionRateDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {item.academicYear?.name || '—'}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {item.department?.name || 'Áp dụng chung (Tất cả)'}
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {item.amountPerCredit?.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Chỉnh sửa"
                            className="text-slate-500 hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xóa"
                            className="text-slate-500 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

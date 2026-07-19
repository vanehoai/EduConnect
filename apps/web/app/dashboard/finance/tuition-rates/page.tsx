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
import { Plus } from 'lucide-react';

export default function TuitionRatesPage() {
  const { data: tuitionRates, isLoading } = useQuery({
    queryKey: ['tuition-rates'],
    queryFn: () => FinanceService.getTuitionRates().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Định mức học phí</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm định mức
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Năm học</TableHead>
              <TableHead>Ngành/Khoa</TableHead>
              <TableHead>Mức phí (VND/Tín chỉ)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : tuitionRates?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              tuitionRates?.map((item: TuitionRateDto) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.academicYear?.name}</TableCell>
                  <TableCell>{item.department?.name || 'Tất cả'}</TableCell>
                  <TableCell>{item.amountPerCredit?.toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Sửa
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Xóa
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

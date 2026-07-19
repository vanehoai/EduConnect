'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService, FeeTypeDto } from '@/lib/services/finance.service';
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

export default function FeeTypesPage() {
  const { data: feeTypes, isLoading } = useQuery({
    queryKey: ['fee-types'],
    queryFn: () => FinanceService.getFeeTypes().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loại học phí</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại học phí
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
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
            ) : feeTypes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              feeTypes?.map((item: FeeTypeDto) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
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

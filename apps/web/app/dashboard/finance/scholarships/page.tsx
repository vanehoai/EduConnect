'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService, ScholarshipDto } from '@/lib/services/finance.service';
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

export default function ScholarshipsPage() {
  const { data: scholarships, isLoading } = useQuery({
    queryKey: ['scholarships'],
    queryFn: () => FinanceService.getScholarships().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Học bổng & Miễn giảm</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm học bổng
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên học bổng/miễn giảm</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : scholarships?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              scholarships?.map((item: ScholarshipDto) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.valueType === 'PERCENTAGE'
                      ? `${item.value}%`
                      : `${item.value?.toLocaleString('vi-VN')} đ`}
                  </TableCell>
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

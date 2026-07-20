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
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Edit2, Trash2, LoaderCircle, Layers } from 'lucide-react';

export default function FeeTypesPage() {
  const { data: feeTypes, isLoading } = useQuery({
    queryKey: ['fee-types'],
    queryFn: () => FinanceService.getFeeTypes().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Danh mục loại học phí"
        description="Quản lý các loại phí và học phí áp dụng trong hệ thống."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại học phí
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Mã loại phí</TableHead>
                  <TableHead className="min-w-[200px]">Tên loại phí</TableHead>
                  <TableHead>Mô tả chi tiết</TableHead>
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
                ) : feeTypes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      <Layers className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không có loại học phí nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  feeTypes?.map((item: FeeTypeDto) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {item.code}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {item.description || '—'}
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

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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Edit2, Trash2, LoaderCircle, Award } from 'lucide-react';

export default function ScholarshipsPage() {
  const { data: scholarships, isLoading } = useQuery({
    queryKey: ['scholarships'],
    queryFn: () => FinanceService.getScholarships().then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Học bổng & Miễn giảm"
        description="Quản lý danh mục học bổng, đối tượng chính sách và các khoản miễn giảm học phí."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm học bổng mới
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Mã HB/MG</TableHead>
                  <TableHead className="min-w-[200px]">Tên học bổng / miễn giảm</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead className="text-right">Giá trị mức hưởng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      <LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : scholarships?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <Award className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không có dữ liệu học bổng/miễn giảm.
                    </TableCell>
                  </TableRow>
                ) : (
                  scholarships?.map((item: ScholarshipDto) => (
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
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal bg-slate-50 dark:bg-slate-900"
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.valueType === 'PERCENTAGE'
                          ? `${item.value}%`
                          : `${item.value?.toLocaleString('vi-VN')} đ`}
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

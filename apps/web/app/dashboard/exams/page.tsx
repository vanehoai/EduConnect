'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { examService } from '@/lib/services/exam.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Search, Plus, LoaderCircle, Settings, Clock, CalendarDays } from 'lucide-react';
// // import { cn } from '@/lib/utils';

export default function ExamsAdminPage() {
  const [courseId] = useState('');
  const [search, setSearch] = useState('');

  const { data: examsResponse, isLoading } = useQuery({
    queryKey: ['exams', courseId, search],
    queryFn: () => examService.getExams({ courseId, search }),
  });

  const exams = examsResponse?.data || [];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
      case 'OPEN':
        return {
          label: 'Đang mở',
          variant: 'default' as const,
          className: 'bg-emerald-500 hover:bg-emerald-600',
        };
      case 'CLOSED':
        return { label: 'Đã đóng', variant: 'secondary' as const, className: '' };
      case 'DRAFT':
        return { label: 'Bản nháp', variant: 'outline' as const, className: '' };
      default:
        return { label: status, variant: 'outline' as const, className: '' };
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'QUIZ':
        return 'Bài trắc nghiệm';
      case 'MIDTERM':
        return 'Thi giữa kỳ';
      case 'FINAL':
        return 'Thi cuối kỳ';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý kỳ thi"
        description="Quản lý danh sách kỳ thi, bài kiểm tra và cấu hình ngân hàng câu hỏi."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo kỳ thi
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm kỳ thi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Thông tin kỳ thi</TableHead>
                <TableHead>Loại kỳ thi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian & Điểm</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
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
              ) : exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy kỳ thi nào.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => {
                  const statusDisplay = getStatusDisplay(exam.status);

                  return (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {exam.title}
                        </div>
                        {exam.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {exam.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal bg-slate-50 dark:bg-slate-900"
                        >
                          {getTypeDisplay(exam.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusDisplay.variant} className={statusDisplay.className}>
                          {statusDisplay.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{exam.durationMinutes} phút</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Tối đa: {exam.maxAttempts} lần</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="hover:text-primary">
                          <Settings className="mr-2 h-4 w-4" />
                          Cấu hình
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

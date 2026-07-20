'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { questionService } from '@/lib/services/question.service';
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
import { Search, Plus, LoaderCircle, Edit2, Import, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuestionBankPage() {
  const [search, setSearch] = useState('');

  const { data: questionsResponse, isLoading } = useQuery({
    queryKey: ['questions', search],
    queryFn: () => questionService.getQuestions({ search }),
  });

  const questions = questionsResponse?.data || [];

  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return {
          label: 'Dễ',
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        };
      case 'MEDIUM':
        return {
          label: 'Trung bình',
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        };
      case 'HARD':
        return { label: 'Khó', className: 'bg-red-500/10 text-red-600 dark:text-red-400' };
      default:
        return { label: difficulty, className: '' };
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return 'Một đáp án';
      case 'MULTIPLE_CHOICE':
        return 'Nhiều đáp án';
      case 'TRUE_FALSE':
        return 'Đúng/Sai';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ngân hàng câu hỏi"
        description="Quản lý và cập nhật câu hỏi cho các kỳ thi."
      >
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Mẫu CSV
          </Button>
          <Button variant="outline">
            <Import className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm câu hỏi
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Nội dung câu hỏi</TableHead>
                <TableHead>Loại câu hỏi</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead className="text-right">Điểm mặc định</TableHead>
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
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy câu hỏi nào.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => {
                  const difficulty = getDifficultyDisplay(q.difficulty);
                  return (
                    <TableRow key={q.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                          {q.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal bg-slate-50 dark:bg-slate-900"
                        >
                          {getTypeDisplay(q.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn('font-normal border-transparent', difficulty.className)}
                        >
                          {difficulty.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">1.0</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Edit2 className="h-4 w-4" />
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

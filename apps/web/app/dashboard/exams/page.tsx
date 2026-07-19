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

export default function ExamsAdminPage() {
  const [courseId] = useState('');
  const [search, setSearch] = useState('');

  const { data: examsResponse, isLoading } = useQuery({
    queryKey: ['exams', courseId, search],
    queryFn: () => examService.getExams({ courseId, search }),
  });

  const exams = examsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý kỳ thi</h1>
        <Button>Tạo kỳ thi mới</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm kiếm kỳ thi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.status}</TableCell>
                  <TableCell>{exam.durationMinutes} phút</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Cấu hình
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

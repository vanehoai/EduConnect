'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { questionService } from '@/lib/services/question.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QuestionBankPage() {
  const [courseId, setCourseId] = useState('');
  const [search, setSearch] = useState('');

  const { data: questionsResponse, isLoading } = useQuery({
    queryKey: ['questions', courseId, search],
    queryFn: () => questionService.getQuestions({ courseId, search }),
  });

  const questions = questionsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ngân hàng câu hỏi</h1>
        <Button>Thêm câu hỏi mới</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input 
          placeholder="Tìm kiếm câu hỏi..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {/* Course select here */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nội dung</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Mức độ</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Đang tải...</TableCell></TableRow>
            ) : questions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center">Không có dữ liệu</TableCell></TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.content.substring(0, 50)}...</TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>{q.difficulty}</TableCell>
                  <TableCell>{q.points}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Sửa</Button>
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

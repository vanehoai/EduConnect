'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examAttemptService } from '@/lib/services/exam-attempt.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: attemptId } = React.use(params);

  const { data: result, isLoading } = useQuery({
    queryKey: ['attempt-result', attemptId],
    queryFn: () => examAttemptService.getAttemptResult(attemptId),
  });

  if (isLoading) return <div className="p-8 text-center">Đang tải kết quả...</div>;
  if (!result) return <div className="p-8 text-center">Không tìm thấy kết quả.</div>;

  const res = result as {
    score?: number;
    totalScore?: number;
    timeSpent?: number;
    isPassed?: boolean;
    correctCount?: number;
    incorrectCount?: number;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Kết quả thi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="py-8">
            <span className="text-6xl font-bold text-blue-600">{res.score || 0}</span>
            <span className="text-xl text-slate-500"> / {res.totalScore || 100}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left border-t pt-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Thời gian làm bài</p>
              <p className="font-semibold">{res.timeSpent || 0} phút</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Trạng thái</p>
              <p className="font-semibold">
                {res.isPassed ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Đạt
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Chưa đạt
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Số câu đúng</p>
              <p className="font-semibold text-green-600">{res.correctCount || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Số câu sai/bỏ qua</p>
              <p className="font-semibold text-red-600">{res.incorrectCount || 0}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center bg-slate-50 p-6">
          <Button onClick={() => router.replace('/dashboard/student/exams')}>
            Quay lại danh sách kỳ thi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

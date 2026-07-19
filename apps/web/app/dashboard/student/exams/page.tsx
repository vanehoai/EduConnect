'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examAttemptService } from '@/lib/services/exam-attempt.service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function StudentExamsPage() {
  const router = useRouter();
  const { data: examsResponse, isLoading } = useQuery({
    queryKey: ['student-exams'],
    queryFn: () => examAttemptService.getStudentExams(),
  });

  const exams = examsResponse?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kỳ thi của tôi</h1>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : exams.length === 0 ? (
        <p>Không có kỳ thi nào.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>
                  {exam.type} - {exam.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>{exam.durationMinutes} phút</span>
                </div>
                <p className="mt-2 text-sm">Điểm qua môn: {exam.passingScore}</p>
                <p className="text-sm">Số lần làm tối đa: {exam.maxAttempts}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push(`/dashboard/student/exam-attempts/new?examId=${exam.id}`)
                  }
                >
                  Vào thi
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

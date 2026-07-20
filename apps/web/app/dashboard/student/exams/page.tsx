'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examAttemptService } from '@/lib/services/exam-attempt.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, CheckCircle, FileText, LoaderCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentExamsPage() {
  const router = useRouter();
  const { data: examsResponse, isLoading } = useQuery({
    queryKey: ['student-exams'],
    queryFn: () => examAttemptService.getStudentExams(),
  });

  const exams = examsResponse?.data || [];

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'QUIZ':
        return 'Bài kiểm tra';
      case 'MIDTERM':
        return 'Thi giữa kỳ';
      case 'FINAL':
        return 'Thi cuối kỳ';
      default:
        return type;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
      case 'OPEN':
        return { label: 'Đang mở', className: 'bg-emerald-500 hover:bg-emerald-600' };
      case 'CLOSED':
        return { label: 'Đã đóng', className: 'bg-slate-500 hover:bg-slate-600' };
      default:
        return { label: status, className: '' };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kỳ thi của tôi"
        description="Danh sách các bài kiểm tra và kỳ thi mà bạn được phân công."
      />

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-slate-500">
          <LoaderCircle className="mb-4 h-8 w-8 animate-spin" />
          Đang tải danh sách kỳ thi...
        </div>
      ) : exams.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">Không có kỳ thi nào</p>
            <p className="text-sm mt-1">Hiện tại bạn chưa được phân công kỳ thi nào.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => {
            const statusDisplay = getStatusDisplay(exam.status);
            const isOpen = exam.status === 'PUBLISHED';

            return (
              <Card
                key={exam.id}
                className={cn(
                  'flex flex-col transition-all hover:shadow-md',
                  !isOpen && 'opacity-75',
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="mb-2 font-normal bg-primary/5 text-primary border-primary/20"
                      >
                        {getTypeDisplay(exam.type)}
                      </Badge>
                      <CardTitle className="text-lg leading-tight line-clamp-2" title={exam.title}>
                        {exam.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="mr-1.5 h-3.5 w-3.5" /> Thời gian
                      </span>
                      <span className="font-semibold">{exam.durationMinutes} phút</span>
                    </div>
                    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="flex items-center text-muted-foreground">
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Điểm qua
                      </span>
                      <span className="font-semibold">{exam.passingScore}/10</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                        Trạng thái:
                      </span>
                      <Badge className={statusDisplay.className}>{statusDisplay.label}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        Số lần làm bài:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        0 / {exam.maxAttempts}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    disabled={!isOpen}
                    onClick={() =>
                      router.push(`/dashboard/student/exam-attempts/new?examId=${exam.id}`)
                    }
                  >
                    {isOpen ? 'Vào thi ngay' : 'Chưa mở'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

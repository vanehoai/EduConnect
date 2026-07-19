'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { examAttemptService } from '@/lib/services/exam-attempt.service';
import { LoaderCircle } from 'lucide-react';

export default function NewAttemptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const startMutation = useMutation({
    mutationFn: (id: string) => examAttemptService.startAttempt(id),
    onSuccess: (data) => {
      router.replace(`/dashboard/student/exam-attempts/${data.attempt.id}`);
    },
    onError: () => {
      alert('Không thể bắt đầu kỳ thi. Vui lòng thử lại.');
      router.replace('/dashboard/student/exams');
    }
  });

  useEffect(() => {
    if (examId) {
      startMutation.mutate(examId);
    } else {
      router.replace('/dashboard/student/exams');
    }
  }, [examId, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-lg font-medium">Đang chuẩn bị đề thi...</p>
    </div>
  );
}

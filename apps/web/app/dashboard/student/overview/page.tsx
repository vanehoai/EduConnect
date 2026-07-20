'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, Target, CalendarDays, Percent, Banknote, AlertCircle } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';

export default function StudentOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-summary'],
    queryFn: () => analyticsService.getStudentSummary(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-slate-500">
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );
  }

  const creditProgress =
    Math.min(100, Math.max(0, (data.passedCredits / data.totalCredits) * 100)) || 0;
  const isDebt = data.tuitionDebt > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan học tập"
        description="Theo dõi tiến độ, kết quả học tập và thông tin tài chính của bạn."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tín chỉ tích lũy"
          value={`${data.passedCredits} / ${data.totalCredits}`}
          icon={BookOpen}
          description={`Đã hoàn thành ${creditProgress.toFixed(1)}%`}
          trend="up"
        />

        <StatCard
          title="GPA Tích lũy"
          value={data.currentGpa.toFixed(2)}
          icon={Target}
          description="Hệ số 4.0"
          trend="up"
          trendValue="Khá"
        />

        <StatCard
          title="Tỷ lệ điểm danh"
          value={`${data.attendanceRate}%`}
          icon={Percent}
          description="Toàn bộ học phần"
          trend={data.attendanceRate < 80 ? 'down' : 'up'}
        />

        <StatCard
          title="Lịch thi sắp tới"
          value={data.upcomingExams}
          icon={CalendarDays}
          description="Trong 30 ngày tới"
        />

        <StatCard
          title="Công nợ học phí"
          value={`${data.tuitionDebt.toLocaleString('vi-VN')} VNĐ`}
          icon={Banknote}
          description={isDebt ? 'Vui lòng hoàn thành học phí sớm' : 'Đã hoàn thành học phí'}
          trend={isDebt ? 'down' : 'neutral'}
          className={isDebt ? 'border-destructive/50' : ''}
        />
      </div>

      {isDebt && (
        <Card className="bg-destructive/10 border-destructive/20 shadow-none">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-sm font-medium text-destructive">
              Cảnh báo tài chính
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              Bạn đang có công nợ học phí. Vui lòng thanh toán để không bị hạn chế đăng ký học phần
              hoặc cấm thi.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

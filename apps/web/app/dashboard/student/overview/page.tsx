'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, CalendarDays, Percent, Banknote, AlertCircle } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { Progress } from '@/components/ui/progress';

export default function StudentOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-summary'],
    queryFn: () => analyticsService.getStudentSummary(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu tổng quan...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>;
  }

  const creditProgress =
    Math.min(100, Math.max(0, (data.passedCredits / data.totalCredits) * 100)) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tổng quan học tập</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tín chỉ tích lũy</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.passedCredits} / {data.totalCredits}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <Progress value={creditProgress} className="h-2" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Đã hoàn thành {creditProgress.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">GPA Tích Lũy</CardTitle>
            <Target className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.currentGpa.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-2">Hệ số 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tỷ lệ điểm danh</CardTitle>
            <Percent className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.attendanceRate}%</div>
            <p className="text-xs text-slate-500 mt-2">Toàn bộ các học phần</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Lịch thi sắp tới</CardTitle>
            <CalendarDays className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.upcomingExams}</div>
            <p className="text-xs text-slate-500 mt-2">Trong 30 ngày tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Công nợ học phí</CardTitle>
            <Banknote className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${data.tuitionDebt > 0 ? 'text-red-600' : 'text-slate-900'}`}
            >
              {data.tuitionDebt.toLocaleString('vi-VN')} VNĐ
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {data.tuitionDebt > 0 ? 'Vui lòng hoàn thành học phí sớm' : 'Đã hoàn thành học phí'}
            </p>
          </CardContent>
        </Card>

        {data.tuitionDebt > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center pb-2 space-y-0 gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-sm font-medium text-red-800">Cảnh báo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                Bạn đang có công nợ học phí. Vui lòng thanh toán để không bị hạn chế đăng ký học
                phần hoặc cấm thi.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

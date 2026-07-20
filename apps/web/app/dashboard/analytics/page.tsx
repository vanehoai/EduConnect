'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Users, BookOpen, GraduationCap, Building, LoaderCircle } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';

const AnalyticsCharts = dynamic(() => import('./charts'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-slate-500">
      <LoaderCircle className="mb-4 h-8 w-8 animate-spin" />
      Đang tải biểu đồ thống kê...
    </div>
  ),
});

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => analyticsService.getAdminSummary(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-slate-500">
        <LoaderCircle className="mb-4 h-8 w-8 animate-spin" />
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-destructive">
        <div className="text-lg font-medium mb-2">Đã xảy ra lỗi</div>
        <div className="text-sm opacity-80">Không thể tải dữ liệu thống kê lúc này.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thống kê & Báo cáo"
        description="Tổng quan về số liệu hoạt động và các chỉ số quan trọng của hệ thống."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng Sinh Viên"
          value={data.totalStudents.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="Đang theo học"
        />
        <StatCard
          title="Tổng Giảng Viên"
          value={data.totalLecturers.toLocaleString()}
          icon={GraduationCap}
          trend="neutral"
          trendValue="Đang giảng dạy"
        />
        <StatCard
          title="Môn Học"
          value={data.totalCourses.toLocaleString()}
          icon={BookOpen}
          trend="neutral"
          trendValue="Đã được duyệt"
        />
        <StatCard
          title="Lớp Học Đang Mở"
          value={data.activeClasses.toLocaleString()}
          icon={Building}
          trend="up"
          trendValue="Học kỳ hiện tại"
        />
      </div>

      <AnalyticsCharts data={data} />
    </div>
  );
}

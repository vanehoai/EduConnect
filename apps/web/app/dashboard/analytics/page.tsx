'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Building } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';

const AnalyticsCharts = dynamic(() => import('./charts'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-500">Đang tải biểu đồ...</div>,
});

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => analyticsService.getAdminSummary(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu thống kê...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Thống kê & Báo cáo</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Sinh Viên</CardTitle>
            <Users className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng Giảng Viên</CardTitle>
            <GraduationCap className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLecturers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Môn Học</CardTitle>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCourses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Lớp Học Đang Mở</CardTitle>
            <Building className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeClasses.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts data={data} />
    </div>
  );
}

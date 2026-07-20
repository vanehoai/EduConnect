'use client';

import { KeyRound, ShieldCheck, UserRound, Bell, Activity } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${user.fullName}!`}
        description="Chào mừng bạn quay trở lại EduConnect - Hệ thống quản lý trường học toàn diện."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Vai trò chính"
          value={user.roles[0] || 'N/A'}
          icon={UserRound}
          description="Vai trò truy cập hệ thống"
        />
        <StatCard
          title="Quyền hạn"
          value={user.permissions.length}
          icon={KeyRound}
          description="Số quyền được cấp phát"
        />
        <StatCard
          title="Trạng thái"
          value={user.status}
          icon={ShieldCheck}
          description="Trạng thái tài khoản"
          trend="up"
          trendValue="Active"
        />
        <StatCard
          title="Phiên bản"
          value="v1.0.0"
          icon={Activity}
          description="Hệ thống vận hành ổn định"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các sự kiện hệ thống ghi nhận gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed text-slate-500">
              <Activity className="h-8 w-8 text-slate-400" />
              <p>Chưa có dữ liệu hoạt động</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Thông báo hệ thống</CardTitle>
            <CardDescription>Cập nhật mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500">
              <Bell className="h-8 w-8 text-slate-400" />
              <p>Không có thông báo mới</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

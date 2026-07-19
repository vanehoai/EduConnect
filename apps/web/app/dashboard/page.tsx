'use client';

import { KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/lib/auth';

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  if (!user) return null;

  const summaries = [
    { label: 'Vai trò hiện tại', value: user.roles.join(', '), icon: UserRound },
    { label: 'Số quyền được cấp', value: String(user.permissions.length), icon: KeyRound },
    { label: 'Trạng thái', value: user.status, icon: ShieldCheck },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-950">Tổng quan tài khoản</h1>
      <p className="mt-2 text-slate-600">
        Phiên đăng nhập được bảo vệ bằng HttpOnly cookie và phân quyền từ máy chủ.
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <Card key={summary.label}>
              <CardContent className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm text-slate-500">{summary.label}</span>
                  <span className="block font-semibold text-slate-950">{summary.value}</span>
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

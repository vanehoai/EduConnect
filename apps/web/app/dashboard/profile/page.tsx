'use client';

import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/api-client';
import { useCurrentUser } from '@/lib/auth';

type Profile = Record<string, unknown> & { department?: { code: string; name: string } };

export default function ProfilePage() {
  const user = useCurrentUser().data;
  const kind = user?.roles.includes('STUDENT')
    ? 'students'
    : user?.roles.includes('LECTURER')
      ? 'lecturers'
      : null;
  const profile = useQuery({
    queryKey: ['profile', kind],
    queryFn: () => apiRequest<Profile>(`/${kind}/me`),
    enabled: Boolean(kind),
  });
  if (!kind)
    return (
      <Card>
        <CardContent>Vai trò hiện tại không có hồ sơ cá nhân học vụ.</CardContent>
      </Card>
    );
  if (profile.isLoading)
    return (
      <p className="flex gap-2">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Đang tải hồ sơ...
      </p>
    );
  if (!profile.data)
    return (
      <Card>
        <CardContent className="text-red-600">Không thể tải hồ sơ cá nhân.</CardContent>
      </Card>
    );
  const hidden = new Set([
    'id',
    'userId',
    'departmentId',
    'admissionAcademicYearId',
    '_count',
    'user',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]);
  return (
    <section>
      <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
      <p className="mt-1 text-slate-600">
        Dữ liệu được lấy theo danh tính trong access token; URL không nhận ID hồ sơ.
      </p>
      <Card className="mt-6">
        <CardContent className="grid gap-4 md:grid-cols-2">
          {Object.entries(profile.data)
            .filter(
              ([key, value]) => !hidden.has(key) && (typeof value !== 'object' || value === null),
            )
            .map(([key, value]) => (
              <div key={key}>
                <span className="block text-sm text-slate-500">{key}</span>
                <strong>{String(value ?? '—')}</strong>
              </div>
            ))}
          <div>
            <span className="block text-sm text-slate-500">Khoa</span>
            <strong>
              {profile.data.department
                ? `${profile.data.department.code} · ${profile.data.department.name}`
                : '—'}
            </strong>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

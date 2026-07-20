'use client';

import { useQuery } from '@tanstack/react-query';
import {
  LoaderCircle,
  User,
  Briefcase,
  GraduationCap,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/api-client';
import { useCurrentUser } from '@/lib/auth';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // import { cn } from '@/lib/utils';

type Profile = Record<string, unknown> & {
  fullName?: string;
  studentCode?: string;
  lecturerCode?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  department?: { code: string; name: string };
};

export default function ProfilePage() {
  const user = useCurrentUser().data;
  const isStudent = user?.roles.includes('STUDENT');
  const isLecturer = user?.roles.includes('LECTURER');
  const kind = isStudent ? 'students' : isLecturer ? 'lecturers' : null;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', kind],
    queryFn: () => apiRequest<Profile>(`/${kind}/me`),
    enabled: Boolean(kind),
  });

  if (!kind) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hồ sơ cá nhân" />
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <User className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">Không có hồ sơ học vụ</p>
            <p className="text-sm mt-1">
              Tài khoản của bạn (Quản trị viên) không liên kết với hồ sơ sinh viên hay giảng viên.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hồ sơ cá nhân" />
        <div className="flex min-h-[400px] flex-col items-center justify-center text-slate-500">
          <LoaderCircle className="mb-4 h-8 w-8 animate-spin text-primary" />
          Đang tải thông tin hồ sơ...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hồ sơ cá nhân" />
        <Card className="border-destructive/30 shadow-none bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-destructive">
            <User className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">Không thể tải hồ sơ</p>
            <p className="text-sm mt-1">
              Đã có lỗi xảy ra khi tải thông tin hồ sơ cá nhân của bạn.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hiddenFields = new Set([
    'id',
    'userId',
    'departmentId',
    'admissionAcademicYearId',
    '_count',
    'user',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'fullName',
    'studentCode',
    'lecturerCode',
    'department',
    'email',
    'phone',
    'address',
    'dateOfBirth',
    'status',
  ]);

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'US';

  const code = profile.studentCode || profile.lecturerCode || 'N/A';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Thông tin cá nhân và học vụ của bạn trên hệ thống."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.fullName || 'Người dùng'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-normal bg-slate-50 dark:bg-slate-900">
                {isStudent ? 'Sinh viên' : 'Giảng viên'}
              </Badge>
              <Badge
                variant="secondary"
                className="font-medium font-mono bg-primary/10 text-primary hover:bg-primary/20"
              >
                {code}
              </Badge>
            </div>

            <div className="w-full mt-6 space-y-4 text-sm text-left">
              {profile.email && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="break-all">{profile.email as string}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{profile.phone as string}</span>
                </div>
              )}
              {profile.dateOfBirth && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{new Date(profile.dateOfBirth as string).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              {profile.address && (
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{profile.address as string}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Thông tin {isStudent ? 'Đào tạo' : 'Công tác'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-b">
                <div className="p-4 sm:p-6 flex flex-col gap-1 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> Đơn vị quản lý
                  </span>
                  <strong className="text-slate-900 dark:text-slate-100 font-medium">
                    {profile.department
                      ? `${profile.department.code} - ${profile.department.name}`
                      : 'Chưa cập nhật'}
                  </strong>
                </div>
                <div className="p-4 sm:p-6 flex flex-col gap-1 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    {isStudent ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : (
                      <Briefcase className="h-4 w-4" />
                    )}
                    Trạng thái
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                    >
                      Đang hoạt động
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Other dynamically rendered fields */}
              {Object.entries(profile).filter(
                ([key, value]) =>
                  !hiddenFields.has(key) && (typeof value !== 'object' || value === null),
              ).length > 0 && (
                <div className="p-4 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(profile)
                    .filter(
                      ([key, value]) =>
                        !hiddenFields.has(key) && (typeof value !== 'object' || value === null),
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {key}
                        </span>
                        <strong className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {String(value ?? '—')}
                        </strong>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { PermissionCode, SystemRole } from '@school/shared-types';
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Users,
  FileQuestion,
  FileText,
  Clock,
  Banknote,
  Receipt,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useLogout } from '@/lib/auth';

interface MenuItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  permission?: PermissionCode;
  roles?: SystemRole[];
}

const roleLabels: Record<SystemRole, string> = {
  ADMIN: 'Quản trị viên',
  TRAINING_STAFF: 'Phòng đào tạo',
  FINANCE_STAFF: 'Phòng tài chính',
  LECTURER: 'Giảng viên',
  STUDENT: 'Sinh viên',
};

const menuItems: MenuItem[] = [
  { label: 'Tổng quan', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: 'Hồ sơ của tôi',
    icon: Users,
    href: '/dashboard/profile',
    roles: ['LECTURER', 'STUDENT'],
  },
  { label: 'Khoa', icon: Building2, href: '/dashboard/departments', permission: 'department.read' },
  {
    label: 'Giảng viên',
    icon: Users,
    href: '/dashboard/lecturers',
    permission: 'lecturer.read',
    roles: ['ADMIN', 'TRAINING_STAFF'],
  },
  {
    label: 'Sinh viên',
    icon: GraduationCap,
    href: '/dashboard/students',
    permission: 'student.read',
    roles: ['ADMIN', 'TRAINING_STAFF', 'FINANCE_STAFF'],
  },
  {
    label: 'Năm học',
    icon: CalendarDays,
    href: '/dashboard/academic-years',
    permission: 'academic-year.read',
  },
  {
    label: 'Học kỳ',
    icon: CalendarDays,
    href: '/dashboard/semesters',
    permission: 'semester.read',
  },
  { label: 'Môn học', icon: BookOpenCheck, href: '/dashboard/courses', permission: 'course.read' },
  {
    label: 'Lớp học phần',
    icon: BookOpenCheck,
    href: '/dashboard/class-sections',
    permission: 'class-section.read',
    roles: ['ADMIN', 'TRAINING_STAFF'],
  },
  {
    label: 'Đăng ký học phần',
    icon: BookOpenCheck,
    href: '/dashboard/enrollments',
    roles: ['ADMIN', 'TRAINING_STAFF'],
  },
  {
    label: 'Lớp của tôi',
    icon: BookOpenCheck,
    href: '/dashboard/my-classes',
    roles: ['LECTURER'],
  },
  {
    label: 'Lịch trình của tôi',
    icon: CalendarDays,
    href: '/dashboard/my-schedule',
    roles: ['LECTURER'],
  },
  {
    label: 'Lớp học phần (SV)',
    icon: BookOpenCheck,
    href: '/dashboard/student/class-sections',
    roles: ['STUDENT'],
  },
  {
    label: 'Lịch sử đăng ký',
    icon: BookOpenCheck,
    href: '/dashboard/student/enrollments',
    roles: ['STUDENT'],
  },
  {
    label: 'Kết quả học tập',
    icon: BookOpenCheck,
    href: '/dashboard/student/academic-results',
    roles: ['STUDENT'],
  },
  {
    label: 'Quản lý điểm',
    icon: BookOpenCheck,
    href: '/dashboard/grades',
    roles: ['ADMIN', 'TRAINING_STAFF'],
  },
  {
    label: 'Điểm danh toàn trường',
    icon: BookOpenCheck,
    href: '/dashboard/attendance',
    roles: ['ADMIN', 'TRAINING_STAFF'],
  },
  {
    label: 'Ngân hàng câu hỏi',
    icon: FileQuestion,
    href: '/dashboard/question-bank',
    roles: ['ADMIN', 'TRAINING_STAFF', 'LECTURER'],
  },
  {
    label: 'Kỳ thi',
    icon: FileText,
    href: '/dashboard/exams',
    roles: ['ADMIN', 'TRAINING_STAFF', 'LECTURER'],
    permission: 'exam.manage',
  },
  {
    label: 'Kỳ thi trực tuyến',
    icon: Clock,
    href: '/dashboard/student/exams',
    roles: ['STUDENT'],
  },
  {
    label: 'Loại học phí',
    icon: Banknote,
    href: '/dashboard/finance/fee-types',
    roles: ['ADMIN', 'FINANCE_STAFF'],
  },
  {
    label: 'Định mức học phí',
    icon: Banknote,
    href: '/dashboard/finance/tuition-rates',
    roles: ['ADMIN', 'FINANCE_STAFF'],
  },
  {
    label: 'Học bổng',
    icon: Banknote,
    href: '/dashboard/finance/scholarships',
    roles: ['ADMIN', 'FINANCE_STAFF'],
  },
  {
    label: 'Hóa đơn học phí',
    icon: Receipt,
    href: '/dashboard/finance/invoices',
    roles: ['ADMIN', 'FINANCE_STAFF'],
  },
  {
    label: 'Phiếu thu',
    icon: Receipt,
    href: '/dashboard/finance/receipts',
    roles: ['ADMIN', 'FINANCE_STAFF'],
  },
  {
    label: 'Tài chính - Học phí',
    icon: CreditCard,
    href: '/dashboard/student/finance',
    roles: ['STUDENT'],
  },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const logout = useLogout();

  useEffect(() => {
    if (currentUser.isError) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [currentUser.isError, pathname, router]);

  if (currentUser.isLoading || !currentUser.data) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">
        <span className="flex items-center gap-2">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Đang xác thực phiên đăng nhập...
        </span>
      </main>
    );
  }

  const user = currentUser.data;
  const primaryRole = user.roles[0] ?? 'STUDENT';
  const visibleMenus = menuItems.filter(
    (item) =>
      (!item.permission || user.permissions.includes(item.permission)) &&
      (!item.roles || item.roles.some((role) => user.roles.includes(role))),
  );

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r bg-slate-950 px-4 py-6 text-slate-100">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold">EduConnect</span>
        </Link>
        <nav className="grid gap-1">
          {visibleMenus.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-20 items-center justify-between border-b bg-white px-6">
          <div>
            <p className="font-semibold text-slate-950">{user.fullName}</p>
            <p className="text-sm text-slate-500">
              {user.email} · {roleLabels[primaryRole]}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
            {logout.isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Đăng xuất
          </Button>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

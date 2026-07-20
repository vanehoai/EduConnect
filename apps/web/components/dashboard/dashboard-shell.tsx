'use client';

import type { PermissionCode, SystemRole } from '@school/shared-types';
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  Users,
  FileQuestion,
  FileText,
  Clock,
  Banknote,
  Receipt,
  CreditCard,
  PieChart,
  AlertTriangle,
  Menu,
  Bell,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useLogout } from '@/lib/auth';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface MenuItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  permission?: PermissionCode;
  roles?: SystemRole[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const roleLabels: Record<SystemRole, string> = {
  ADMIN: 'Quản trị viên',
  TRAINING_STAFF: 'Phòng đào tạo',
  FINANCE_STAFF: 'Phòng tài chính',
  LECTURER: 'Giảng viên',
  STUDENT: 'Sinh viên',
};

const menuSections: MenuSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Tổng quan', icon: LayoutDashboard, href: '/dashboard' },
      {
        label: 'Tổng quan SV',
        icon: LayoutDashboard,
        href: '/dashboard/student/overview',
        roles: ['STUDENT'],
      },
      {
        label: 'Thống kê (Analytics)',
        icon: PieChart,
        href: '/dashboard/analytics',
        roles: ['ADMIN', 'TRAINING_STAFF'],
      },
      {
        label: 'Cảnh báo học vụ',
        icon: AlertTriangle,
        href: '/dashboard/academic-risks',
        roles: ['ADMIN', 'TRAINING_STAFF'],
      },
      {
        label: 'Cảnh báo học vụ SV',
        icon: AlertTriangle,
        href: '/dashboard/student/academic-risks',
        roles: ['STUDENT'],
      },
    ],
  },
  {
    title: 'Đào tạo',
    items: [
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
      {
        label: 'Khoa',
        icon: Building2,
        href: '/dashboard/departments',
        permission: 'department.read',
      },
      {
        label: 'Môn học',
        icon: BookOpenCheck,
        href: '/dashboard/courses',
        permission: 'course.read',
      },
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
    ],
  },
  {
    title: 'Nhân sự',
    items: [
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
        label: 'Hồ sơ của tôi',
        icon: Users,
        href: '/dashboard/profile',
        roles: ['LECTURER', 'STUDENT'],
      },
    ],
  },
  {
    title: 'Khảo thí & Điểm',
    items: [
      {
        label: 'Điểm danh',
        icon: BookOpenCheck,
        href: '/dashboard/attendance',
        roles: ['ADMIN', 'TRAINING_STAFF'],
      },
      {
        label: 'Quản lý điểm',
        icon: BookOpenCheck,
        href: '/dashboard/grades',
        roles: ['ADMIN', 'TRAINING_STAFF'],
      },
      {
        label: 'Kết quả học tập',
        icon: BookOpenCheck,
        href: '/dashboard/student/academic-results',
        roles: ['STUDENT'],
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
    ],
  },
  {
    title: 'Tài chính',
    items: [
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
        label: 'Tài chính cá nhân',
        icon: CreditCard,
        href: '/dashboard/student/finance',
        roles: ['STUDENT'],
      },
    ],
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
          Đang tải dữ liệu phiên bản...
        </span>
      </main>
    );
  }

  const user = currentUser.data;
  const primaryRole = user.roles[0] ?? 'STUDENT';

  const filterMenus = (items: MenuItem[]) => {
    return items.filter(
      (item) =>
        (!item.permission || user.permissions.includes(item.permission)) &&
        (!item.roles || item.roles.some((role) => user.roles.includes(role))),
    );
  };

  const activeSections = menuSections
    .map((section) => ({
      ...section,
      items: filterMenus(section.items),
    }))
    .filter((section) => section.items.length > 0);

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return (
        (parts[0]?.charAt(0) || '') + (parts[parts.length - 1]?.charAt(0) || '')
      ).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const NavContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          EduConnect
        </span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-2">
        <nav className="flex flex-col gap-6">
          {activeSections.map((section, index) => (
            <div key={index}>
              <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </h4>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? 'text-primary dark:text-primary-foreground' : 'text-slate-400'}`}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] flex-col border-r bg-white dark:bg-slate-950 md:flex">
        <NavContent />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-4 backdrop-blur-md dark:bg-slate-950/80 sm:px-6">
          {/* Mobile Sidebar Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <NavContent />
            </SheetContent>
          </Sheet>

          {/* Search Bar (UI only for now) */}
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-full bg-white pl-8 shadow-none dark:bg-slate-950 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>

            <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-slate-500">{roleLabels[primaryRole]}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

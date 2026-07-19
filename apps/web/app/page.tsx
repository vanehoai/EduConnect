import { ArrowRight, BookOpenCheck, GraduationCap, Landmark, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { SystemStatus } from '@/components/system-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const modules = [
  {
    icon: GraduationCap,
    title: 'Quản lý đào tạo',
    description: 'Sinh viên, giảng viên, lớp học phần, lịch học, điểm danh và kết quả học tập.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: BookOpenCheck,
    title: 'Thi trắc nghiệm',
    description: 'Ngân hàng câu hỏi, kỳ thi trực tuyến, tự động lưu bài và chấm điểm.',
    color: 'bg-violet-50 text-violet-700',
  },
  {
    icon: Landmark,
    title: 'Học phí trực tuyến',
    description: 'Hóa đơn, công nợ, thanh toán an toàn và biên lai điện tử minh bạch.',
    color: 'bg-emerald-50 text-emerald-700',
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(circle_at_top_left,hsl(216_100%_96%),transparent_42%),radial-gradient(circle_at_top_right,hsl(258_100%_97%),transparent_38%)]" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-blue-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">EduConnect</p>
            <p className="text-xs text-muted-foreground">School Management System</p>
          </div>
        </div>
        <SystemStatus />
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-sm text-blue-700 backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Nền tảng thống nhất cho nhà trường
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
            Vận hành giáo dục
            <span className="block text-primary">liền mạch và minh bạch.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Kết nối quản lý đào tạo, thi trực tuyến và học phí trong một hệ thống an toàn, hiện đại,
            dễ mở rộng.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/login">
                Đăng nhập hệ thống
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="http://localhost:4000/api/docs" target="_blank" rel="noreferrer">
                Xem tài liệu API
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.title}
                className="bg-white/85 backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <CardContent className="flex gap-4">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${module.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-950">{module.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{module.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}

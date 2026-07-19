import { ShieldX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <ShieldX className="mx-auto h-14 w-14 text-amber-600" />
        <p className="mt-5 text-sm font-semibold text-amber-700">Lỗi 403</p>
        <h1 className="mt-2 text-3xl font-bold">Bạn không có quyền truy cập</h1>
        <p className="mt-3 text-slate-600">Hãy liên hệ quản trị viên nếu bạn cần thêm quyền.</p>
        <Button className="mt-6" asChild>
          <Link href="/dashboard">Quay lại dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

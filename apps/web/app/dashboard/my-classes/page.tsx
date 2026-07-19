'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequestEnvelope } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyClassesPage() {
  // Assuming there's a backend endpoint for my classes
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-classes'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => apiRequestEnvelope<any[]>('/class-sections/my-classes'),
  });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Lớp giảng dạy của tôi</h1>
      <p className="text-slate-600">Danh sách các lớp học phần bạn đang phụ trách.</p>

      {isLoading ? (
        <div className="py-10 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>
      ) : !data?.data?.length ? (
        <div className="py-10 text-center text-slate-500">Bạn chưa được phân công lớp nào.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((cls) => (
            <Link key={cls.id} href={`/dashboard/my-classes/${cls.id}`}>
              <Card className="hover:border-blue-500 hover:shadow-md transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Mã lớp:</strong> {cls.code}
                  </p>
                  <p>
                    <strong>Môn học:</strong> {cls.course?.name}
                  </p>
                  <p>
                    <strong>Sĩ số:</strong> {cls.enrolled} / {cls.capacity}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {cls.status}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

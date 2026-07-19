'use client';

import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '@/lib/services/enrollment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, BookCheck } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function StudentEnrollmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Lịch sử đăng ký học phần</h1>
      <p className="text-slate-600">Danh sách các môn học bạn đã đăng ký và trạng thái hiện tại.</p>

      {isLoading ? (
        <div className="py-10 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>
      ) : !data?.data?.length ? (
        <div className="py-10 text-center text-slate-500">Bạn chưa đăng ký lớp học phần nào.</div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <BookCheck className="h-5 w-5" />
              </div>
              <CardTitle>Danh sách đăng ký</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Mã lớp</th>
                    <th className="px-4 py-3">Môn học</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {enrollment.classSection?.code}
                      </td>
                      <td className="px-4 py-3">{enrollment.classSection?.name}</td>
                      <td className="px-4 py-3">
                        {enrollment.status === 'ENROLLED' ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            Đã đăng ký
                          </span>
                        ) : enrollment.status === 'CANCELLED' ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            Đã hủy
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            {enrollment.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {enrollment.enrollmentDate
                          ? format(new Date(enrollment.enrollmentDate), 'dd/MM/yyyy HH:mm', {
                              locale: vi,
                            })
                          : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

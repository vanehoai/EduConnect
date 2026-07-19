'use client';

import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '@/lib/services/enrollment.service';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

export default function AdminEnrollmentsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-enrollments', debouncedSearch],
    queryFn: () => enrollmentService.getAllEnrollments({ search: debouncedSearch }),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Quản lý Đăng ký học phần</h1>
          <p className="text-slate-600">
            Xem, tìm kiếm và quản lý đăng ký lớp học phần của sinh viên.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/enrollments/new">
            <Button className="bg-blue-600 hover:bg-blue-700">Đăng ký thay SV</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đăng ký</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên, lớp..."
              className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setDebouncedSearch(search);
                }
              }}
              onBlur={() => setDebouncedSearch(search)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
            </div>
          ) : isError ? (
            <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>
          ) : !data?.data?.length ? (
            <div className="py-10 text-center text-slate-500">Không tìm thấy đăng ký nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Mã SV</th>
                    <th className="px-4 py-3">Họ tên SV</th>
                    <th className="px-4 py-3">Lớp học phần</th>
                    <th className="px-4 py-3">Môn học</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Ngày đăng ký</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {enrollment.student?.studentCode}
                      </td>
                      <td className="px-4 py-3">{enrollment.student?.fullName}</td>
                      <td className="px-4 py-3">{enrollment.classSection?.code}</td>
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
                      <td className="px-4 py-3 text-right">
                        <Link href={`/dashboard/enrollments/${enrollment.id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            <FileText className="mr-2 h-4 w-4" />
                            Chi tiết
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

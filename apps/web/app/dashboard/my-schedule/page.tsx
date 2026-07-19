'use client';
import { useQuery } from '@tanstack/react-query';
import { apiRequestEnvelope } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderCircle, Calendar as CalendarIcon } from 'lucide-react';

export default function MySchedulePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-schedule'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => apiRequestEnvelope<any[]>('/lecturers/me/schedule'),
  });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Lịch trình của tôi</h1>
      <p className="text-slate-600">Lịch giảng dạy các lớp học phần trong tuần.</p>

      {isLoading ? (
        <div className="py-10 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>
      ) : !data?.data?.length ? (
        <div className="py-10 text-center text-slate-500">Bạn chưa có lịch học nào.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="p-6 flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{schedule.classSection?.name || 'Lớp học phần'}</h3>
                  <p className="text-sm text-slate-600">
                    Thứ {Number(schedule.dayOfWeek) + 1} · {schedule.startTime?.substring(11, 16)} -{' '}
                    {schedule.endTime?.substring(11, 16)}
                  </p>
                  <p className="text-sm text-slate-600">Phòng: {schedule.room || 'Chưa xếp'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

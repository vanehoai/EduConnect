'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequestEnvelope } from '@/lib/api-client';

export default function ClassSectionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['class-section', id],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => apiRequestEnvelope<any>(`/class-sections/${id}`),
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  if (!data?.data)
    return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin.</div>;

  const section = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/class-sections">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {section.code} - {section.name}
          </h1>
          <p className="text-slate-600">Trạng thái: {section.status}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Môn học:</strong> {section.course?.name} ({section.course?.courseCode})
            </p>
            <p>
              <strong>Học kỳ:</strong> {section.semester?.name}
            </p>
            <p>
              <strong>Giảng viên:</strong> {section.lecturer?.fullName || 'Chưa phân công'}
            </p>
            <p>
              <strong>Sĩ số:</strong> {section.enrolled} / {section.capacity}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch trình & Lịch học</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/dashboard/class-sections/${id}/schedules`}>
                <Calendar className="mr-2 h-4 w-4" />
                Quản lý lịch học
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

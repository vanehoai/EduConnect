'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Calendar, UserCheck, Percent, GraduationCap } from 'lucide-react';
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
    queryFn: () => apiRequestEnvelope<any>(`/lecturers/me/class-sections/${id}`),
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  if (!data?.data)
    return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin.</div>;

  const section = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/my-classes">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Môn học:</strong> {section.course?.name} ({section.course?.courseCode})
              </p>
              <p>
                <strong>Học kỳ:</strong> {section.semester?.name}
              </p>
            </div>
            <div>
              <p>
                <strong>Giảng viên:</strong> {section.lecturer?.fullName || 'Chưa phân công'}
              </p>
              <p>
                <strong>Sĩ số:</strong> {section.enrolled} / {section.capacity}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch học</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/dashboard/my-classes/${id}/schedules`}>
                <Calendar className="mr-2 h-4 w-4" />
                Quản lý lịch học
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Điểm danh</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/dashboard/my-classes/${id}/attendance`}>
                <UserCheck className="mr-2 h-4 w-4" />
                Điểm danh sinh viên
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cấu hình điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/dashboard/my-classes/${id}/grade-components`}>
                <Percent className="mr-2 h-4 w-4" />
                Thành phần điểm
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="default">
              <Link href={`/dashboard/my-classes/${id}/grades`}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Nhập điểm & Công bố
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

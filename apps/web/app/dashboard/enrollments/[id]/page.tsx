/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '@/lib/services/enrollment.service';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, FileText, ArrowLeft, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminEnrollmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-enrollment', id],
    queryFn: () =>
      enrollmentService.getAllEnrollments({ id }).then((res: any) => ({
        data: res.data.find((e: any) => e.id === id) || res.data[0],
      })),
  });

  const cancelMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      return enrollmentService.cancelEnrollment(enrollmentId);
    },
    onSuccess: () => {
      toast.success('Hủy đăng ký thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-enrollment', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
      setIsCancelConfirmOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể hủy đăng ký');
      setIsCancelConfirmOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return <div className="text-red-500">Có lỗi xảy ra hoặc không tìm thấy dữ liệu.</div>;
  }

  const enrollment = data.data;
  const canCancel = enrollment.status === 'ENROLLED' || enrollment.status === 'PENDING';

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Chi tiết Đăng ký học phần</h1>
          <p className="text-slate-600">
            Xem thông tin và quản lý trạng thái đăng ký của sinh viên.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Thông tin đăng ký</CardTitle>
            </div>
            {enrollment.status === 'ENROLLED' ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                Đã đăng ký
              </span>
            ) : enrollment.status === 'CANCELLED' ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                Đã hủy
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                {enrollment.status}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Mã sinh viên</p>
              <p className="font-semibold text-slate-900">{enrollment.student?.studentCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Họ và tên</p>
              <p className="font-semibold text-slate-900">{enrollment.student?.fullName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Mã lớp học phần</p>
              <p className="font-semibold text-slate-900">{enrollment.classSection?.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tên lớp</p>
              <p className="font-semibold text-slate-900">{enrollment.classSection?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Môn học</p>
              <p className="font-semibold text-slate-900">
                {enrollment.classSection?.course?.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tín chỉ</p>
              <p className="font-semibold text-slate-900">
                {enrollment.classSection?.course?.credits}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Thời gian đăng ký</p>
            <p className="font-semibold text-slate-900">
              {enrollment.enrollmentDate
                ? format(new Date(enrollment.enrollmentDate), 'dd/MM/yyyy HH:mm:ss', {
                    locale: vi,
                  })
                : 'N/A'}
            </p>
          </div>
        </CardContent>
        {canCancel && (
          <CardFooter className="bg-slate-50 pt-4 rounded-b-xl border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setIsCancelConfirmOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hủy thay sinh viên
            </Button>
          </CardFooter>
        )}
      </Card>

      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Xác nhận hủy đăng ký</h2>
            <p className="text-slate-600">
              Bạn có chắc chắn muốn hủy đăng ký lớp học phần{' '}
              <strong>{enrollment.classSection?.code}</strong> cho sinh viên{' '}
              <strong>
                {enrollment.student?.fullName} ({enrollment.student?.studentCode})
              </strong>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCancelConfirmOpen(false)}>
                Đóng
              </Button>
              <Button
                variant="destructive"
                onClick={() => cancelMutation.mutate(enrollment.id)}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Xác nhận hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

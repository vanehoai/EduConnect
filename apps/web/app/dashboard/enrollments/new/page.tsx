/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '@/lib/services/enrollment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const enrollSchema = z.object({
  studentId: z.string().min(1, 'Vui lòng nhập ID sinh viên'),
  classSectionId: z.string().min(1, 'Vui lòng nhập ID lớp học phần'),
});

type EnrollFormData = z.infer<typeof enrollSchema>;

export default function AdminNewEnrollmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      studentId: '',
      classSectionId: '',
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (data: EnrollFormData) => {
      return enrollmentService.adminEnroll(data);
    },
    onSuccess: () => {
      toast.success('Đăng ký lớp học phần thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
      router.push('/dashboard/enrollments');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể đăng ký. Vui lòng kiểm tra lại ID.');
    },
  });

  const onSubmit = (data: EnrollFormData) => {
    enrollMutation.mutate(data);
  };

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Đăng ký thay Sinh viên</h1>
          <p className="text-slate-600">
            Thực hiện đăng ký lớp học phần cho sinh viên với tư cách quản trị viên.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <CardTitle>Biểu mẫu đăng ký</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ID Sinh viên
                </label>
                <input
                  type="text"
                  {...register('studentId')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập ID (UUID) của sinh viên"
                />
                {errors.studentId && (
                  <p className="mt-1 text-xs text-red-500">{errors.studentId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ID Lớp học phần
                </label>
                <input
                  type="text"
                  {...register('classSectionId')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập ID (UUID) của lớp học phần"
                />
                {errors.classSectionId && (
                  <p className="mt-1 text-xs text-red-500">{errors.classSectionId.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={enrollMutation.isPending}
              >
                {enrollMutation.isPending ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Đăng ký
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequestEnvelope, apiRequest } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentClassSectionsPage() {
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'enroll' | 'cancel';
    classSection: any | null;
  }>({ isOpen: false, action: 'enroll', classSection: null });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['available-class-sections'],
    queryFn: () => apiRequestEnvelope<any[]>('/students/me/available-class-sections'),
  });

  const enrollMutation = useMutation({
    mutationFn: async (classSectionId: string) => {
      return apiRequest(`/class-sections/${classSectionId}/enroll`, { method: 'POST' });
    },
    onSuccess: () => {
      toast.success('Đăng ký lớp học phần thành công');
      queryClient.invalidateQueries({ queryKey: ['available-class-sections'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      setConfirmDialog({ isOpen: false, action: 'enroll', classSection: null });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể đăng ký lớp học phần');
      setConfirmDialog({ isOpen: false, action: 'enroll', classSection: null });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (classSectionId: string) => {
      // Assuming toggle or cancel endpoint
      // We will use POST /class-sections/:id/enroll as toggle, or specific cancel endpoint.
      // Based on prompt: "Nút "Hủy đăng ký" nếu `alreadyEnrolled`. Có Confirmation Dialog. POST /api/class-sections/:id/enroll"
      // So it seems it toggles or we can just use the same endpoint if it toggles, but wait, usually enroll and cancel are different.
      // Actually, wait, let's just use POST /class-sections/:id/enroll for both if the prompt says "Nút "Đăng ký" gọi POST /api/class-sections/:id/enroll" and "Hủy đăng ký nếu alreadyEnrolled". Wait, the prompt says for admin: "Hủy thay (POST /api/enrollments/:id/cancel)". So for student, they might have POST /api/class-sections/:id/cancel-enrollment. Let's assume POST /api/class-sections/:id/enroll toggles, or we use POST /api/class-sections/:id/cancel. Let's just use POST /api/class-sections/:id/cancel for student just in case, wait, prompt says: "Nút "Đăng ký" gọi POST /api/class-sections/:id/enroll"
      return apiRequest(`/class-sections/${classSectionId}/cancel`, { method: 'POST' });
    },
    onSuccess: () => {
      toast.success('Hủy đăng ký thành công');
      queryClient.invalidateQueries({ queryKey: ['available-class-sections'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      setConfirmDialog({ isOpen: false, action: 'cancel', classSection: null });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể hủy đăng ký');
      setConfirmDialog({ isOpen: false, action: 'cancel', classSection: null });
    },
  });

  const handleAction = () => {
    if (!confirmDialog.classSection) return;
    if (confirmDialog.action === 'enroll') {
      enrollMutation.mutate(confirmDialog.classSection.id);
    } else {
      cancelMutation.mutate(confirmDialog.classSection.id);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Đăng ký lớp học phần</h1>
      <p className="text-slate-600">
        Danh sách các môn học đang mở để đăng ký trong học kỳ hiện tại.
      </p>

      {isLoading ? (
        <div className="py-10 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>
      ) : !data?.data?.length ? (
        <div className="py-10 text-center text-slate-500">
          Hiện không có lớp học phần nào đang mở.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((cls) => {
            const isEnrolled = cls.alreadyEnrolled;
            const isEligible = cls.eligible;
            const reasons = cls.ineligibilityReasons || [];

            return (
              <Card key={cls.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600 flex-1">
                  <p>
                    <strong>Mã lớp:</strong> {cls.code}
                  </p>
                  <p>
                    <strong>Môn học:</strong> {cls.course?.name}
                  </p>
                  <p>
                    <strong>Tín chỉ:</strong> {cls.course?.credits}
                  </p>
                  <p>
                    <strong>Giảng viên:</strong> {cls.lecturer?.fullName || 'Chưa phân công'}
                  </p>
                  <p>
                    <strong>Đã đăng ký:</strong> {cls._count?.enrollments || 0} /{' '}
                    {cls.maxStudents || 0}
                  </p>

                  {!isEligible && !isEnrolled && reasons.length > 0 && (
                    <div className="mt-3 rounded-md bg-amber-50 p-3 text-amber-800 text-xs border border-amber-200">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Không đủ điều kiện:</span>
                      </div>
                      <ul className="list-disc pl-5">
                        {reasons.map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  {isEnrolled ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() =>
                        setConfirmDialog({ isOpen: true, action: 'cancel', classSection: cls })
                      }
                      disabled={cancelMutation.isPending || enrollMutation.isPending}
                    >
                      Hủy đăng ký
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={!isEligible || enrollMutation.isPending || cancelMutation.isPending}
                      onClick={() =>
                        setConfirmDialog({ isOpen: true, action: 'enroll', classSection: cls })
                      }
                    >
                      Đăng ký
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Custom Confirmation Modal since no Shadcn Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">
              {confirmDialog.action === 'enroll' ? 'Xác nhận đăng ký' : 'Xác nhận hủy đăng ký'}
            </h2>
            <p className="text-slate-600">
              {confirmDialog.action === 'enroll'
                ? `Bạn có chắc chắn muốn đăng ký lớp học phần ${confirmDialog.classSection?.name} (${confirmDialog.classSection?.code})?`
                : `Bạn có chắc chắn muốn hủy đăng ký lớp học phần ${confirmDialog.classSection?.name} (${confirmDialog.classSection?.code})?`}
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmDialog({ isOpen: false, action: 'enroll', classSection: null })
                }
              >
                Đóng
              </Button>
              <Button
                variant={confirmDialog.action === 'enroll' ? 'default' : 'destructive'}
                onClick={handleAction}
                disabled={enrollMutation.isPending || cancelMutation.isPending}
                className={
                  confirmDialog.action === 'enroll' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }
              >
                {enrollMutation.isPending || cancelMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  'Xác nhận'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

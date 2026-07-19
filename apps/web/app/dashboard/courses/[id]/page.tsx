'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, LoaderCircle, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiClientError, apiRequest, apiRequestEnvelope } from '@/lib/api-client';
import { useCurrentUser } from '@/lib/auth';

interface CourseSummary {
  id: string;
  courseCode: string;
  name: string;
  status: string;
}
interface Prerequisite {
  prerequisiteCourseId: string;
  minimumGrade: string | null;
  prerequisiteCourse: CourseSummary & { credits: number };
}
interface CourseDetail extends CourseSummary {
  credits: number;
  prerequisites: Prerequisite[];
}

const addSchema = z.object({
  prerequisiteCourseId: z.string().min(1, 'Vui lòng chọn môn tiên quyết'),
  minimumGrade: z
    .string()
    .refine(
      (value) => !value || (Number(value) >= 0 && Number(value) <= 10),
      'Điểm phải từ 0 đến 10',
    ),
});
type AddValues = z.infer<typeof addSchema>;

function message(error: unknown) {
  return error instanceof ApiClientError ? error.message : 'Không thể hoàn tất thao tác';
}

export default function CoursePrerequisitesPage() {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser().data;
  const queryClient = useQueryClient();
  const canManage = Boolean(user?.permissions.includes('course-prerequisite.manage'));
  const courseQuery = useQuery({
    queryKey: ['course', id],
    queryFn: () => apiRequest<CourseDetail>(`/courses/${id}`),
    enabled: Boolean(id && user?.permissions.includes('course.read')),
  });
  const optionsQuery = useQuery({
    queryKey: ['course-options'],
    queryFn: () =>
      apiRequestEnvelope<CourseSummary[]>(
        '/courses?limit=100&status=ACTIVE&sortBy=courseCode&sortOrder=asc',
      ),
    enabled: canManage,
  });
  const form = useForm<AddValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { prerequisiteCourseId: '', minimumGrade: '' },
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['course', id] });
  const add = useMutation({
    mutationFn: (values: AddValues) =>
      apiRequest(`/courses/${id}/prerequisites`, {
        method: 'POST',
        body: JSON.stringify({
          prerequisiteCourseId: values.prerequisiteCourseId,
          ...(values.minimumGrade ? { minimumGrade: Number(values.minimumGrade) } : {}),
        }),
      }),
    onSuccess: () => {
      toast.success('Đã thêm môn tiên quyết');
      form.reset();
      void invalidate();
    },
    onError: (error) => toast.error(message(error)),
  });
  if (!user?.permissions.includes('course.read'))
    return (
      <Card>
        <CardContent>Không có quyền xem môn học.</CardContent>
      </Card>
    );
  if (courseQuery.isLoading)
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Đang tải...
      </div>
    );
  if (!courseQuery.data)
    return (
      <Card>
        <CardContent className="text-red-600">{message(courseQuery.error)}</CardContent>
      </Card>
    );
  const course = courseQuery.data;
  const used = new Set(course.prerequisites.map((item) => item.prerequisiteCourseId));
  const options = (optionsQuery.data?.data ?? []).filter(
    (option) => option.id !== id && !used.has(option.id),
  );

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/dashboard/courses"
          className="mb-3 inline-flex items-center text-sm text-blue-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Danh sách môn học
        </Link>
        <h1 className="text-2xl font-bold">
          {course.courseCode} · {course.name}
        </h1>
        <p className="mt-1 text-slate-600">
          Quản lý đồ thị môn tiên quyết. Máy chủ sẽ chặn tự tham chiếu và mọi vòng lặp nhiều cấp.
        </p>
      </div>
      {canManage ? (
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold">Thêm môn tiên quyết</h2>
            <form
              className="flex flex-wrap items-start gap-3"
              onSubmit={form.handleSubmit((values) => add.mutate(values))}
            >
              <label className="min-w-64 flex-1">
                <select
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  {...form.register('prerequisiteCourseId')}
                >
                  <option value="">-- Chọn môn --</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.courseCode} · {option.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.prerequisiteCourseId ? (
                  <span className="text-sm text-red-600">
                    {form.formState.errors.prerequisiteCourseId.message}
                  </span>
                ) : null}
              </label>
              <label>
                <input
                  className="h-10 w-40 rounded-md border px-3 text-sm"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="Điểm tối thiểu"
                  {...form.register('minimumGrade')}
                />
                {form.formState.errors.minimumGrade ? (
                  <span className="block text-sm text-red-600">
                    {form.formState.errors.minimumGrade.message}
                  </span>
                ) : null}
              </label>
              <Button type="submit" disabled={add.isPending}>
                {add.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}Thêm
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold">
            Danh sách môn tiên quyết ({course.prerequisites.length})
          </h2>
          {course.prerequisites.length ? (
            <div className="divide-y rounded-lg border">
              {course.prerequisites.map((item) => (
                <PrerequisiteRow
                  key={item.prerequisiteCourseId}
                  courseId={id}
                  item={item}
                  canManage={canManage}
                  onChanged={invalidate}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-slate-500">
              Môn học chưa có điều kiện tiên quyết.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function PrerequisiteRow({
  courseId,
  item,
  canManage,
  onChanged,
}: {
  courseId: string;
  item: Prerequisite;
  canManage: boolean;
  onChanged: () => Promise<unknown>;
}) {
  const [grade, setGrade] = useState(item.minimumGrade ?? '');
  const update = useMutation({
    mutationFn: () =>
      apiRequest(`/courses/${courseId}/prerequisites/${item.prerequisiteCourseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ minimumGrade: grade === '' ? null : Number(grade) }),
      }),
    onSuccess: () => {
      toast.success('Đã cập nhật điểm tối thiểu');
      void onChanged();
    },
    onError: (error) => toast.error(message(error)),
  });
  const remove = useMutation({
    mutationFn: () =>
      apiRequest(`/courses/${courseId}/prerequisites/${item.prerequisiteCourseId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('Đã xóa môn tiên quyết');
      void onChanged();
    },
    onError: (error) => toast.error(message(error)),
  });
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-60 flex-1">
        <strong>{item.prerequisiteCourse.courseCode}</strong>
        <p className="text-sm text-slate-600">
          {item.prerequisiteCourse.name} · {item.prerequisiteCourse.credits} tín chỉ
        </p>
      </div>
      {canManage ? (
        <>
          <input
            aria-label="Điểm tối thiểu"
            className="h-9 w-28 rounded-md border px-2 text-sm"
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
          />
          <Button variant="outline" onClick={() => update.mutate()} disabled={update.isPending}>
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Xóa điều kiện tiên quyết này?')) remove.mutate();
            }}
            disabled={remove.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </>
      ) : (
        <span>Điểm tối thiểu: {item.minimumGrade ?? 'Không yêu cầu'}</span>
      )}
    </div>
  );
}

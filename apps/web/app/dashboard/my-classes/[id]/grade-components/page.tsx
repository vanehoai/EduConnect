'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { apiRequestEnvelope, apiRequest } from '@/lib/api-client';
import { toast } from 'sonner';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GradeComponent {
  id?: string;
  name: string;
  type: string;
  weight: number;
  maxScore: number;
}

const componentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Bắt buộc'),
  type: z.string().min(1, 'Bắt buộc'),
  weight: z.coerce.number().min(0).max(100),
  maxScore: z.coerce.number().min(1),
});

const formSchema = z.object({
  components: z.array(componentSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function GradeComponentsPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['class-section-grade-components', id],
    queryFn: () =>
      apiRequestEnvelope<GradeComponent[]>(
        `/lecturers/me/class-sections/${id}/grade-components`,
      ).catch(() => ({ data: [] })),
  });

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      components: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'components',
  });

  // Update form when data loads
  useMemo(() => {
    if (data?.data && data.data.length > 0) {
      form.reset({ components: data.data });
    } else if (data?.data && data.data.length === 0 && fields.length === 0) {
      form.reset({
        components: [
          { name: 'Chuyên cần', type: 'ATTENDANCE', weight: 10, maxScore: 10 },
          { name: 'Giữa kỳ', type: 'MIDTERM', weight: 30, maxScore: 10 },
          { name: 'Cuối kỳ', type: 'FINAL', weight: 60, maxScore: 10 },
        ],
      });
    }
  }, [data?.data, form, fields.length]);

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiRequest(`/lecturers/me/class-sections/${id}/grade-components`, {
        method: 'PUT',
        body: JSON.stringify(values.components),
      }),
    onSuccess: () => {
      toast.success('Lưu cấu hình thành công');
      queryClient.invalidateQueries({ queryKey: ['class-section-grade-components', id] });
    },
    onError: () => toast.error('Lỗi khi lưu cấu hình'),
  });

  const onSubmit = (values: FormValues) => {
    const totalWeight = values.components.reduce((sum, comp) => sum + comp.weight, 0);
    if (totalWeight !== 100) {
      toast.error('Tổng trọng số phải bằng 100%');
      return;
    }
    saveMutation.mutate(values);
  };

  const watchComponents = form.watch('components');
  const totalWeight = watchComponents.reduce((sum, comp) => sum + (Number(comp.weight) || 0), 0);

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cấu hình thành phần điểm</h1>
      </div>

      {totalWeight !== 100 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cảnh báo</AlertTitle>
          <AlertDescription>
            Tổng trọng số hiện tại là {totalWeight}%. Tổng trọng số phải đúng bằng 100%.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thành phần điểm</CardTitle>
          <CardDescription>Thiết lập các cột điểm và trọng số cho lớp học phần.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên cột điểm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="w-[150px]">Trọng số (%)</TableHead>
                    <TableHead className="w-[150px]">Điểm tối đa</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control as never}
                          name={`components.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="VD: Giữa kỳ" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control as never}
                          name={`components.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ATTENDANCE">Chuyên cần</SelectItem>
                                  <SelectItem value="ASSIGNMENT">Bài tập</SelectItem>
                                  <SelectItem value="MIDTERM">Giữa kỳ</SelectItem>
                                  <SelectItem value="FINAL">Cuối kỳ</SelectItem>
                                  <SelectItem value="OTHER">Khác</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control as never}
                          name={`components.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control as never}
                          name={`components.${index}.maxScore`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: '', type: 'OTHER', weight: 0, maxScore: 10 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm cột điểm
                </Button>

                <div className="flex items-center gap-4">
                  <span className="font-medium">Tổng: {totalWeight}%</span>
                  <Button type="submit" disabled={saveMutation.isPending || totalWeight !== 100}>
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

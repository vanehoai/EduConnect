'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  cancelAnnouncement,
  type CreateAnnouncementInput,
} from '@/lib/services/announcement.service';
import type { AnnouncementDto, AnnouncementStatus } from '@school/shared-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { toast } from 'sonner';
import {
  Plus,
  Eye,
  Send,
  X,
  Loader2,
  Bell,
  Megaphone,
  CheckCircle2,
  Info,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề bắt buộc').max(200),
  content: z.string().min(1, 'Nội dung bắt buộc'),
  summary: z.string().optional(),
  category: z.enum([
    'GENERAL',
    'ACADEMIC',
    'EXAM',
    'ATTENDANCE',
    'FINANCE',
    'SCHOLARSHIP',
    'SYSTEM',
    'EVENT',
    'OTHER',
  ]),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  publishAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type AnnouncementPriority = FormValues['priority'];
const STATUS_CONFIG: Record<
  AnnouncementStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: 'Bản nháp',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: FileText,
  },
  SCHEDULED: {
    label: 'Đã lên lịch',
    className:
      'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Bell,
  },
  PUBLISHED: {
    label: 'Đã phát hành',
    className:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  EXPIRED: {
    label: 'Hết hạn',
    className:
      'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500 border-slate-200 dark:border-slate-800',
    icon: Info,
  },
  CANCELLED: {
    label: 'Đã hủy',
    className:
      'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    icon: X,
  },
};

const PRIORITY_CONFIG: Record<
  AnnouncementPriority,
  { label: string; className: string; icon: React.ElementType }
> = {
  LOW: { label: 'Thấp', className: 'text-slate-500', icon: Info },
  NORMAL: { label: 'Bình thường', className: 'text-blue-500', icon: Info },
  HIGH: { label: 'Cao', className: 'text-amber-500', icon: AlertTriangle },
  URGENT: { label: 'Khẩn cấp', className: 'text-red-500', icon: Megaphone },
};

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<AnnouncementStatus | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementDto | null>(null);
  const [cancelDialog, setCancelDialog] = useState<AnnouncementDto | null>(null);
  const [publishDialog, setPublishDialog] = useState<AnnouncementDto | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements', filterStatus],
    queryFn: () => getAnnouncements(filterStatus !== 'ALL' ? { status: filterStatus } : {}),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      category: 'GENERAL',
      priority: 'NORMAL',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementInput) => createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowForm(false);
      form.reset();
      toast.success('Đã tạo thông báo thành công');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAnnouncementInput> }) =>
      updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowForm(false);
      setEditItem(null);
      form.reset();
      toast.success('Đã cập nhật thông báo thành công');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setPublishDialog(null);
      toast.success('Đã phát hành thông báo');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelAnnouncement(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setCancelDialog(null);
      setCancelReason('');
      toast.success('Đã hủy thông báo');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEdit(item: AnnouncementDto) {
    setEditItem(item);
    form.reset({
      title: item.title,
      content: item.content,
      summary: item.summary ?? '',
      category: item.category,
      priority: item.priority,
      publishAt: item.publishAt ?? '',
      expiresAt: item.expiresAt ?? '',
    });
    setShowForm(true);
  }

  function onSubmit(values: FormValues) {
    const payload: CreateAnnouncementInput = {
      title: values.title,
      content: values.content,
      summary: values.summary,
      category: values.category,
      priority: values.priority,
      publishAt: values.publishAt || undefined,
      expiresAt: values.expiresAt || undefined,
    };
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý thông báo"
        description="Soạn thảo, phát hành và quản lý các thông báo trên toàn hệ thống."
      >
        <Button
          onClick={() => {
            setEditItem(null);
            form.reset();
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo thông báo
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 overflow-x-auto border-b p-4 scrollbar-none">
            {(['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'CANCELLED'] as const).map(
              (s) => {
                const config =
                  s === 'ALL' ? { label: 'Tất cả' } : STATUS_CONFIG[s as AnnouncementStatus];
                return (
                  <Button
                    key={s}
                    variant={filterStatus === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(s)}
                    className={cn(
                      'whitespace-nowrap rounded-full transition-all',
                      filterStatus === s ? 'shadow-sm' : 'bg-transparent',
                    )}
                  >
                    {config.label}
                  </Button>
                );
              },
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">Thông báo</TableHead>
                  <TableHead className="w-[120px]">Ưu tiên</TableHead>
                  <TableHead className="w-[140px]">Trạng thái</TableHead>
                  <TableHead className="w-[140px]">Ngày tạo</TableHead>
                  <TableHead className="w-[120px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải danh sách thông báo...
                    </TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <Bell className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không có thông báo nào phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((a) => {
                    const statusConfig = STATUS_CONFIG[a.status];
                    const priorityConfig =
                      PRIORITY_CONFIG[a.priority as AnnouncementPriority] ?? PRIORITY_CONFIG.NORMAL;
                    const StatusIcon = statusConfig.icon;
                    const PriorityIcon = priorityConfig.icon;

                    return (
                      <TableRow
                        key={a.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                      >
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span
                              className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1"
                              title={a.title}
                            >
                              {a.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-normal uppercase bg-slate-50 dark:bg-slate-900"
                              >
                                {a.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {a.summary}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <PriorityIcon className={cn('h-4 w-4', priorityConfig.className)} />
                            <span className={priorityConfig.className}>{priorityConfig.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-normal flex w-fit items-center gap-1.5',
                              statusConfig?.className,
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                          {format(new Date(a.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(a)}
                              title="Xem chi tiết / Chỉnh sửa"
                              className="text-slate-500 hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(a.status === 'DRAFT' || a.status === 'SCHEDULED') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPublishDialog(a)}
                                title="Phát hành ngay"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            {(a.status === 'DRAFT' ||
                              a.status === 'SCHEDULED' ||
                              a.status === 'PUBLISHED') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCancelDialog(a)}
                                title="Hủy thông báo"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editItem ? 'Cập nhật thông báo' : 'Soạn thông báo mới'}
            </DialogTitle>
          </DialogHeader>
          <form
            id="announcement-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề thông báo..."
                {...form.register('title')}
                className={cn(form.formState.errors.title && 'border-destructive')}
              />
              {form.formState.errors.title && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh mục phân loại</Label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(v) => form.setValue('category', v as FormValues['category'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { val: 'GENERAL', label: 'Chung' },
                      { val: 'ACADEMIC', label: 'Học vụ' },
                      { val: 'EXAM', label: 'Thi cử' },
                      { val: 'ATTENDANCE', label: 'Điểm danh' },
                      { val: 'FINANCE', label: 'Tài chính - Học phí' },
                      { val: 'SCHOLARSHIP', label: 'Học bổng' },
                      { val: 'SYSTEM', label: 'Hệ thống' },
                      { val: 'EVENT', label: 'Sự kiện' },
                      { val: 'OTHER', label: 'Khác' },
                    ].map((c) => (
                      <SelectItem key={c.val} value={c.val}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mức độ ưu tiên</Label>
                <Select
                  value={form.watch('priority')}
                  onValueChange={(v) => form.setValue('priority', v as FormValues['priority'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const).map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_CONFIG[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt nội dung (hiển thị ở dạng rút gọn)</Label>
              <Input
                id="summary"
                placeholder="Mô tả ngắn gọn về thông báo này..."
                {...form.register('summary')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Nội dung chi tiết <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                rows={8}
                placeholder="Nhập nội dung chi tiết của thông báo..."
                className={cn('resize-y', form.formState.errors.content && 'border-destructive')}
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <Label htmlFor="publishAt" className="text-sm">
                  Thời gian phát hành (tùy chọn)
                </Label>
                <Input id="publishAt" type="datetime-local" {...form.register('publishAt')} />
                <p className="text-xs text-muted-foreground">
                  Để trống nếu muốn phát hành thủ công
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="text-sm">
                  Thời gian hết hạn (tùy chọn)
                </Label>
                <Input id="expiresAt" type="datetime-local" {...form.register('expiresAt')} />
                <p className="text-xs text-muted-foreground">
                  Thông báo sẽ tự động ẩn sau thời gian này
                </p>
              </div>
            </div>
          </form>
          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
                form.reset();
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="announcement-form"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editItem ? 'Lưu cập nhật' : 'Tạo bản nháp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!publishDialog} onOpenChange={(o) => !o && setPublishDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phát hành thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chuẩn bị phát hành thông báo{' '}
              <span className="font-medium text-foreground">
                &quot;{publishDialog?.title}&quot;
              </span>
              . Mọi người dùng thuộc đối tượng nhận sẽ có thể xem thông báo này ngay lập tức. Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => publishDialog && publishMutation.mutate(publishDialog.id)}
              disabled={publishMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {publishMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Phát hành ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đang hủy thông báo{' '}
              <span className="font-medium text-foreground">&quot;{cancelDialog?.title}&quot;</span>
              . Vui lòng cung cấp lý do hủy để lưu lại lịch sử.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label className="sr-only">Lý do hủy</Label>
            <Textarea
              placeholder="Nhập lý do hủy thông báo..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelReason('')}>Đóng</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                cancelDialog &&
                cancelReason.trim() &&
                cancelMutation.mutate({ id: cancelDialog.id, reason: cancelReason })
              }
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

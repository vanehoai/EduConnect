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
import { toast } from 'sonner';
import { Plus, Eye, Send, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

const STATUS_LABELS: Record<AnnouncementStatus, string> = {
  DRAFT: 'Bản nháp',
  SCHEDULED: 'Đã lên lịch',
  PUBLISHED: 'Đã phát hành',
  EXPIRED: 'Hết hạn',
  CANCELLED: 'Đã hủy',
};

const STATUS_VARIANT: Record<
  AnnouncementStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  DRAFT: 'secondary',
  SCHEDULED: 'outline',
  PUBLISHED: 'default',
  EXPIRED: 'secondary',
  CANCELLED: 'destructive',
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
      toast.success('Đã tạo thông báo');
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
      toast.success('Đã cập nhật thông báo');
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý thông báo</h1>
          <p className="text-muted-foreground">Tạo, phát hành và quản lý thông báo nội bộ</p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            form.reset();
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo thông báo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'CANCELLED'] as const).map((s) => (
          <Button
            key={s}
            variant={filterStatus === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(s)}
          >
            {s === 'ALL' ? 'Tất cả' : STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Ưu tiên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Chưa có thông báo nào
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                  <TableCell>{a.category}</TableCell>
                  <TableCell>{a.priority}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABELS[a.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(a.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(a)}
                        title="Xem / Sửa"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(a.status === 'DRAFT' || a.status === 'SCHEDULED') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPublishDialog(a)}
                          title="Phát hành"
                          className="text-green-600 hover:text-green-700"
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
                          title="Hủy"
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input id="title" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt</Label>
              <Input id="summary" {...form.register('summary')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung *</Label>
              <Textarea id="content" rows={6} {...form.register('content')} />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(v) => form.setValue('category', v as FormValues['category'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'GENERAL',
                      'ACADEMIC',
                      'EXAM',
                      'ATTENDANCE',
                      'FINANCE',
                      'SCHOLARSHIP',
                      'SYSTEM',
                      'EVENT',
                      'OTHER',
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ưu tiên</Label>
                <Select
                  value={form.watch('priority')}
                  onValueChange={(v) => form.setValue('priority', v as FormValues['priority'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishAt">Ngày phát hành (tuỳ chọn)</Label>
                <Input id="publishAt" type="datetime-local" {...form.register('publishAt')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Ngày hết hạn (tuỳ chọn)</Label>
                <Input id="expiresAt" type="datetime-local" {...form.register('expiresAt')} />
              </div>
            </div>
            <DialogFooter>
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editItem ? 'Cập nhật' : 'Tạo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <AlertDialog open={!!publishDialog} onOpenChange={(o) => !o && setPublishDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phát hành thông báo?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông báo &quot;{publishDialog?.title}&quot; sẽ được phát hành ngay lập tức. Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => publishDialog && publishMutation.mutate(publishDialog.id)}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Phát hành
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy thông báo?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông báo &quot;{cancelDialog?.title}&quot; sẽ bị hủy. Vui lòng nhập lý do.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 py-2">
            <Textarea
              placeholder="Lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
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

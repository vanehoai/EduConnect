'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { use, useState } from 'react';
import {
  getServiceRequestById,
  getServiceRequestComments,
  addServiceRequestComment,
  assignServiceRequest,
  resolveServiceRequest,
  cancelServiceRequest,
  closeServiceRequest,
} from '@/lib/services/service-request.service';
import type { ServiceRequestStatus } from '@school/shared-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  OPEN: 'Mở',
  ASSIGNED: 'Đã phân công',
  IN_PROGRESS: 'Đang xử lý',
  WAITING_FOR_STUDENT: 'Chờ sinh viên',
  RESOLVED: 'Đã giải quyết',
  CLOSED: 'Đã đóng',
  CANCELLED: 'Đã hủy',
  REOPENED: 'Đã mở lại',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [commentVisibility, setCommentVisibility] = useState<'PUBLIC' | 'INTERNAL'>('PUBLIC');
  const [assignUserId, setAssignUserId] = useState('');
  const [resolveText, setResolveText] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const { data: request, isLoading } = useQuery({
    queryKey: ['service-request', id],
    queryFn: () => getServiceRequestById(id),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['service-request-comments', id],
    queryFn: () => getServiceRequestComments(id),
    enabled: !!request,
  });

  const commentMutation = useMutation({
    mutationFn: () => addServiceRequestComment(id, commentText, commentVisibility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-comments', id] });
      setCommentText('');
      toast.success('Đã thêm bình luận');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const assignMutation = useMutation({
    mutationFn: () => assignServiceRequest(id, assignUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request', id] });
      setShowAssign(false);
      setAssignUserId('');
      toast.success('Đã phân công');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resolveMutation = useMutation({
    mutationFn: () => resolveServiceRequest(id, resolveText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request', id] });
      setShowResolve(false);
      setResolveText('');
      toast.success('Đã giải quyết');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelServiceRequest(id, cancelText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request', id] });
      setShowCancel(false);
      setCancelText('');
      toast.success('Đã hủy yêu cầu');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const closeMutation = useMutation({
    mutationFn: () => closeServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request', id] });
      toast.success('Đã đóng yêu cầu');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!request) {
    return <div className="p-6 text-muted-foreground">Không tìm thấy yêu cầu.</div>;
  }

  const canAssign = ['OPEN', 'REOPENED'].includes(request.status);
  const canResolve = ['ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_STUDENT'].includes(request.status);
  const canClose = request.status === 'RESOLVED';
  const canCancel = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(request.status);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/service-requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Yêu cầu #{request.requestNumber}</h1>
          <Badge variant="outline">{STATUS_LABELS[request.status]}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{request.subject}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Danh mục: </span>
              {request.category?.name ?? '—'}
            </div>
            <div>
              <span className="text-muted-foreground">Ưu tiên: </span>
              {request.priority}
            </div>
            <div>
              <span className="text-muted-foreground">Tạo lúc: </span>
              {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </div>
            <div>
              <span className="text-muted-foreground">Hạn xử lý: </span>
              {request.dueAt
                ? format(new Date(request.dueAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                : '—'}
            </div>
            {request.assignedToUserId && (
              <div>
                <span className="text-muted-foreground">Phụ trách: </span>
                {request.assignedToUserId}
              </div>
            )}
            {request.resolutionSummary && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Giải pháp: </span>
                {request.resolutionSummary}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap pt-2 border-t">
            {canAssign && (
              <Button variant="outline" size="sm" onClick={() => setShowAssign(true)}>
                Phân công
              </Button>
            )}
            {canResolve && (
              <Button
                variant="outline"
                size="sm"
                className="text-green-600"
                onClick={() => setShowResolve(true)}
              >
                Giải quyết
              </Button>
            )}
            {canClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending}
              >
                {closeMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Đóng yêu cầu
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setShowCancel(true)}
              >
                Hủy yêu cầu
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trao đổi ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-lg text-sm border ${
                    c.visibility === 'INTERNAL'
                      ? 'border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                    <span className="font-medium">{c.authorUserId}</span>
                    <span>·</span>
                    <span>{format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                    {c.visibility === 'INTERNAL' && (
                      <Badge variant="outline" className="text-amber-600 border-amber-400 ml-auto">
                        Nội bộ
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          {!['CLOSED', 'CANCELLED'].includes(request.status) && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex gap-2 items-center">
                <Label className="shrink-0 text-sm">Loại:</Label>
                <Select
                  value={commentVisibility}
                  onValueChange={(v) => setCommentVisibility(v as 'PUBLIC' | 'INTERNAL')}
                >
                  <SelectTrigger className="w-36 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Công khai</SelectItem>
                    <SelectItem value="INTERNAL">Nội bộ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Nhập bình luận..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => commentMutation.mutate()}
                disabled={!commentText.trim() || commentMutation.isPending}
              >
                {commentMutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Gửi bình luận
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân công xử lý</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>ID Nhân viên phụ trách</Label>
            <Input
              placeholder="Nhập User ID..."
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssign(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => assignMutation.mutate()}
              disabled={!assignUserId || assignMutation.isPending}
            >
              {assignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Phân công
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolve} onOpenChange={setShowResolve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giải quyết yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Tóm tắt giải pháp *</Label>
            <Textarea
              rows={4}
              value={resolveText}
              onChange={(e) => setResolveText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolve(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => resolveMutation.mutate()}
              disabled={!resolveText.trim() || resolveMutation.isPending}
            >
              {resolveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Lý do hủy *</Label>
            <Textarea rows={3} value={cancelText} onChange={(e) => setCancelText(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancel(false)}>
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={!cancelText.trim() || cancelMutation.isPending}
            >
              {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

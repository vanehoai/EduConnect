'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getServiceRequests,
  resolveServiceRequest,
  cancelServiceRequest,
  closeServiceRequest,
  exportServiceRequests,
  getServiceRequestReport,
} from '@/lib/services/service-request.service';
import type {
  ServiceRequestDto,
  ServiceRequestStatus,
  ServiceRequestPriority,
} from '@school/shared-types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Eye, Loader2, CheckCircle, XCircle, Lock } from 'lucide-react';
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

const PRIORITY_COLORS: Record<ServiceRequestPriority, string> = {
  LOW: 'text-slate-500',
  NORMAL: 'text-blue-600',
  HIGH: 'text-orange-600',
  URGENT: 'text-red-600 font-bold',
};

export default function ServiceRequestsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<ServiceRequestStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [resolveDialog, setResolveDialog] = useState<ServiceRequestDto | null>(null);
  const [cancelDialog, setCancelDialog] = useState<ServiceRequestDto | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [cancelReasonText, setCancelReasonText] = useState('');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['service-requests', filterStatus, search],
    queryFn: () =>
      getServiceRequests({
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        search: search || undefined,
      }),
  });

  const { data: report } = useQuery({
    queryKey: ['service-requests-report'],
    queryFn: getServiceRequestReport,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      resolveServiceRequest(id, summary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['service-requests-report'] });
      setResolveDialog(null);
      setResolutionText('');
      toast.success('Đã giải quyết yêu cầu');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelServiceRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['service-requests-report'] });
      setCancelDialog(null);
      setCancelReasonText('');
      toast.success('Đã hủy yêu cầu');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => closeServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast.success('Đã đóng yêu cầu');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yêu cầu dịch vụ</h1>
          <p className="text-muted-foreground">Quản lý và xử lý yêu cầu từ sinh viên</p>
        </div>
        <Button
          variant="outline"
          onClick={() => exportServiceRequests().catch((e: Error) => toast.error(e.message))}
        >
          <Download className="mr-2 h-4 w-4" /> Xuất CSV
        </Button>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Tổng', value: report.total },
            { label: 'Mở', value: report.open },
            { label: 'Đang xử lý', value: report.inProgress },
            { label: 'Đã giải quyết', value: report.resolved },
            { label: 'Đã hủy', value: report.cancelled },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardHeader className="pb-1 pt-4">
                <CardTitle className="text-xs text-muted-foreground font-normal">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Tìm kiếm mã, tiêu đề..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as ServiceRequestStatus | 'ALL')}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            {(Object.keys(STATUS_LABELS) as ServiceRequestStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã yêu cầu</TableHead>
              <TableHead>Chủ đề</TableHead>
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
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Không có yêu cầu nào
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.requestNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.subject}</TableCell>
                  <TableCell className="text-sm">{r.category?.name ?? '—'}</TableCell>
                  <TableCell className={`text-sm ${PRIORITY_COLORS[r.priority]}`}>
                    {r.priority}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{STATUS_LABELS[r.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(r.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Xem chi tiết">
                        <Link href={`/dashboard/service-requests/${r.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {(r.status === 'ASSIGNED' ||
                        r.status === 'IN_PROGRESS' ||
                        r.status === 'WAITING_FOR_STUDENT') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Giải quyết"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => setResolveDialog(r)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {r.status === 'RESOLVED' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Đóng yêu cầu"
                          onClick={() => closeMutation.mutate(r.id)}
                          disabled={closeMutation.isPending}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      {(r.status === 'OPEN' ||
                        r.status === 'ASSIGNED' ||
                        r.status === 'IN_PROGRESS') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hủy"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setCancelDialog(r)}
                        >
                          <XCircle className="h-4 w-4" />
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

      {/* Resolve Dialog */}
      <Dialog open={!!resolveDialog} onOpenChange={(o) => !o && setResolveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giải quyết yêu cầu #{resolveDialog?.requestNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tóm tắt giải quyết *</Label>
              <Textarea
                placeholder="Mô tả cách đã giải quyết..."
                rows={4}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)}>
              Hủy
            </Button>
            <Button
              onClick={() =>
                resolveDialog &&
                resolveMutation.mutate({ id: resolveDialog.id, summary: resolutionText })
              }
              disabled={!resolutionText.trim() || resolveMutation.isPending}
            >
              {resolveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận giải quyết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy yêu cầu #{cancelDialog?.requestNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Lý do hủy *</Label>
              <Textarea
                placeholder="Nhập lý do hủy..."
                rows={3}
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(null)}>
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                cancelDialog &&
                cancelMutation.mutate({ id: cancelDialog.id, reason: cancelReasonText })
              }
              disabled={!cancelReasonText.trim() || cancelMutation.isPending}
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

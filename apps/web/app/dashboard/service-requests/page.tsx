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
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { toast } from 'sonner';
import {
  Download,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  Lock,
  Search,
  FileText,
  AlertCircle,
  Clock,
  Inbox,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  ServiceRequestStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  OPEN: {
    label: 'Mở',
    className:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: Inbox,
  },
  ASSIGNED: {
    label: 'Đã phân công',
    className:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: ShieldCheck,
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    className:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  WAITING_FOR_STUDENT: {
    label: 'Chờ sinh viên',
    className:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    icon: HelpCircle,
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    className:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  CLOSED: {
    label: 'Đã đóng',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: Lock,
  },
  CANCELLED: {
    label: 'Đã hủy',
    className:
      'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    icon: XCircle,
  },
  REOPENED: {
    label: 'Đã mở lại',
    className:
      'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    icon: AlertCircle,
  },
};

const PRIORITY_CONFIG: Record<ServiceRequestPriority, { label: string; className: string }> = {
  LOW: { label: 'Thấp', className: 'text-slate-500' },
  NORMAL: { label: 'Bình thường', className: 'text-blue-600' },
  HIGH: { label: 'Cao', className: 'text-orange-600' },
  URGENT: { label: 'Khẩn cấp', className: 'text-red-600 font-bold' },
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
    <div className="space-y-6">
      <PageHeader
        title="Yêu cầu dịch vụ"
        description="Tiếp nhận, quản lý và xử lý các yêu cầu hỗ trợ từ sinh viên."
      >
        <Button
          variant="outline"
          onClick={() => exportServiceRequests().catch((e: Error) => toast.error(e.message))}
        >
          <Download className="mr-2 h-4 w-4" /> Xuất báo cáo CSV
        </Button>
      </PageHeader>

      {report && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <StatCard title="Tổng yêu cầu" value={report.total} icon={FileText} />
          <StatCard
            title="Mới mở"
            value={report.open}
            icon={Inbox}
            trend="neutral"
            className="border-emerald-200 dark:border-emerald-900"
          />
          <StatCard
            title="Đang xử lý"
            value={report.inProgress}
            icon={Clock}
            trend="neutral"
            className="border-amber-200 dark:border-amber-900"
          />
          <StatCard title="Đã giải quyết" value={report.resolved} icon={CheckCircle} trend="up" />
          <StatCard
            title="Đã hủy"
            value={report.cancelled}
            icon={XCircle}
            trend="down"
            className="hidden xl:block"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm mã, tiêu đề..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as ServiceRequestStatus | 'ALL')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  {(Object.keys(STATUS_CONFIG) as ServiceRequestStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã YC</TableHead>
                  <TableHead className="min-w-[250px]">Chủ đề</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải danh sách yêu cầu...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <FileText className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không tìm thấy yêu cầu nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((r) => {
                    const statusConfig = STATUS_CONFIG[r.status];
                    const priorityConfig = PRIORITY_CONFIG[r.priority];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow
                        key={r.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                      >
                        <TableCell>
                          <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {r.requestNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div
                            className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1"
                            title={r.subject}
                          >
                            {r.subject}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {r.category?.name ?? '—'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn('text-sm', priorityConfig.className)}>
                            {priorityConfig.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-normal flex w-fit items-center gap-1.5',
                              statusConfig.className,
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                          {format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Xem chi tiết"
                              className="text-slate-500 hover:text-primary"
                            >
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
                                title="Giải quyết yêu cầu"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                onClick={() => setResolveDialog(r)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {r.status === 'RESOLVED' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Đóng yêu cầu vĩnh viễn"
                                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                                title="Hủy yêu cầu"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setCancelDialog(r)}
                              >
                                <XCircle className="h-4 w-4" />
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

      <Dialog open={!!resolveDialog} onOpenChange={(o) => !o && setResolveDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Giải quyết yêu cầu{' '}
              <span className="text-primary">#{resolveDialog?.requestNumber}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>
                Nội dung giải quyết <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Mô tả chi tiết phương án và kết quả đã xử lý cho sinh viên..."
                rows={5}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="resize-y"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
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

      <Dialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Hủy yêu cầu <span className="text-primary">#{cancelDialog?.requestNumber}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>
                Lý do hủy <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Vui lòng cho biết lý do từ chối/hủy yêu cầu này..."
                rows={4}
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
                className="resize-y"
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

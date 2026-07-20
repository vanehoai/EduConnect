'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  academicRiskService,
  type AcademicRisk,
  type AcademicRiskSeverity,
  type AcademicRiskStatus,
} from '@/lib/services/academic-risk.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  ShieldAlert,
  XCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const SEVERITY_CONFIG: Record<
  AcademicRiskSeverity,
  { label: string; className: string; icon: React.ElementType }
> = {
  LOW: {
    label: 'Thấp',
    className: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  MEDIUM: {
    label: 'Trung bình',
    className: 'text-amber-600 bg-amber-500/10 dark:text-amber-400',
    icon: AlertTriangle,
  },
  HIGH: {
    label: 'Cao',
    className: 'text-orange-600 bg-orange-500/10 dark:text-orange-400',
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'Nghiêm trọng',
    className: 'text-destructive bg-destructive/10',
    icon: ShieldAlert,
  },
};

const STATUS_CONFIG: Record<AcademicRiskStatus, { label: string; className: string }> = {
  OPEN: {
    label: 'Đang mở',
    className:
      'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-900/30',
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    className:
      'border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/30',
  },
  DISMISSED: {
    label: 'Đã bỏ qua',
    className:
      'border-slate-200 text-slate-700 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800',
  },
};

export default function AcademicRisksPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<AcademicRiskStatus | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<AcademicRiskSeverity | 'ALL'>('ALL');

  const [selectedRisk, setSelectedRisk] = useState<AcademicRisk | null>(null);
  const [dialogMode, setDialogMode] = useState<'RESOLVE' | 'DISMISS' | null>(null);
  const [note, setNote] = useState('');

  const { data: risks = [], isLoading } = useQuery({
    queryKey: ['academic-risks', statusFilter, severityFilter],
    queryFn: () =>
      academicRiskService.getRisks({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        severity: severityFilter === 'ALL' ? undefined : severityFilter,
      }),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      academicRiskService.resolveRisk(id, note),
    onSuccess: () => {
      toast.success('Đã ghi nhận giải quyết cảnh báo học vụ');
      queryClient.invalidateQueries({ queryKey: ['academic-risks'] });
      closeDialog();
    },
    onError: () => {
      toast.error('Không thể giải quyết cảnh báo');
    },
  });

  const dismissMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      academicRiskService.dismissRisk(id, reason),
    onSuccess: () => {
      toast.success('Đã bỏ qua cảnh báo học vụ');
      queryClient.invalidateQueries({ queryKey: ['academic-risks'] });
      closeDialog();
    },
    onError: () => {
      toast.error('Không thể bỏ qua cảnh báo');
    },
  });

  const openDialog = (risk: AcademicRisk, mode: 'RESOLVE' | 'DISMISS') => {
    setSelectedRisk(risk);
    setDialogMode(mode);
    setNote('');
  };

  const closeDialog = () => {
    setSelectedRisk(null);
    setDialogMode(null);
    setNote('');
  };

  const handleSubmit = () => {
    if (!selectedRisk || !dialogMode || !note) return;
    if (dialogMode === 'RESOLVE') {
      resolveMutation.mutate({ id: selectedRisk.id, note });
    } else {
      dismissMutation.mutate({ id: selectedRisk.id, reason: note });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cảnh báo học vụ"
        description="Theo dõi và xử lý các trường hợp sinh viên có nguy cơ vi phạm quy chế hoặc kết quả học tập kém."
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:justify-between bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-[250px] hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm theo tên, mã SV..." className="pl-9 bg-background" />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as AcademicRiskStatus | 'ALL')}
              >
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="OPEN">Đang mở</SelectItem>
                  <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
                  <SelectItem value="DISMISSED">Đã bỏ qua</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={severityFilter}
                onValueChange={(val) => setSeverityFilter(val as AcademicRiskSeverity | 'ALL')}
              >
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <SelectValue placeholder="Mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả mức độ</SelectItem>
                  <SelectItem value="LOW">Thấp</SelectItem>
                  <SelectItem value="MEDIUM">Trung bình</SelectItem>
                  <SelectItem value="HIGH">Cao</SelectItem>
                  <SelectItem value="CRITICAL">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Sinh viên</TableHead>
                  <TableHead>Mô tả cảnh báo</TableHead>
                  <TableHead className="w-[150px]">Mức độ</TableHead>
                  <TableHead className="w-[140px]">Trạng thái</TableHead>
                  <TableHead className="text-right w-[120px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      Đang tải dữ liệu cảnh báo...
                    </TableCell>
                  </TableRow>
                ) : risks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <ShieldAlert className="mx-auto mb-2 h-8 w-8 opacity-20" />
                      Không có cảnh báo học vụ nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  risks.map((risk) => {
                    const severityConfig = SEVERITY_CONFIG[risk.severity];
                    const statusConfig = STATUS_CONFIG[risk.status];
                    const SeverityIcon = severityConfig.icon;

                    return (
                      <TableRow
                        key={risk.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                      >
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {risk.studentName}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {risk.studentCode}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="text-sm line-clamp-2 max-w-[400px]"
                            title={risk.description}
                          >
                            {risk.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                              severityConfig.className,
                            )}
                          >
                            <SeverityIcon className="h-3.5 w-3.5" />
                            {severityConfig.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('font-normal border', statusConfig.className)}
                          >
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {risk.status === 'OPEN' && (
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Giải quyết"
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                onClick={() => openDialog(risk, 'RESOLVE')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Bỏ qua"
                                className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => openDialog(risk, 'DISMISS')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
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

      <Dialog open={!!dialogMode} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'RESOLVE' ? 'Giải quyết cảnh báo' : 'Bỏ qua cảnh báo'}
            </DialogTitle>
            <DialogDescription>
              Sinh viên:{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedRisk?.studentName}
              </span>{' '}
              ({selectedRisk?.studentCode})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <Label>
                {dialogMode === 'RESOLVE' ? 'Ghi chú giải quyết' : 'Lý do bỏ qua'}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  dialogMode === 'RESOLVE' ? 'Nhập chi tiết hướng xử lý...' : 'Nhập lý do bỏ qua...'
                }
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Hủy bỏ
            </Button>
            <Button
              className={
                dialogMode === 'RESOLVE'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary'
              }
              onClick={handleSubmit}
              disabled={!note.trim() || resolveMutation.isPending || dismissMutation.isPending}
            >
              {(resolveMutation.isPending || dismissMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

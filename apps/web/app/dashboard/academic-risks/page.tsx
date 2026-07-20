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
import { toast } from 'sonner';

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
      toast.success('Đã giải quyết cảnh báo học vụ');
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cảnh báo học vụ</h1>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as AcademicRiskStatus | 'ALL')}
          >
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Tên Sinh Viên</TableHead>
                <TableHead>Mô tả cảnh báo</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : risks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Không có dữ liệu cảnh báo học vụ.
                  </TableCell>
                </TableRow>
              ) : (
                risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.studentCode}</TableCell>
                    <TableCell>{risk.studentName}</TableCell>
                    <TableCell>{risk.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          risk.severity === 'CRITICAL'
                            ? 'destructive'
                            : risk.severity === 'HIGH'
                              ? 'destructive'
                              : risk.severity === 'MEDIUM'
                                ? 'default'
                                : 'secondary'
                        }
                      >
                        {risk.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          risk.status === 'OPEN'
                            ? 'border-orange-500 text-orange-600'
                            : risk.status === 'RESOLVED'
                              ? 'border-green-500 text-green-600'
                              : 'border-slate-500 text-slate-600'
                        }
                      >
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {risk.status === 'OPEN' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => openDialog(risk, 'RESOLVE')}
                          >
                            Giải quyết
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-slate-600"
                            onClick={() => openDialog(risk, 'DISMISS')}
                          >
                            Bỏ qua
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!dialogMode} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'RESOLVE' ? 'Giải quyết cảnh báo' : 'Bỏ qua cảnh báo'}
            </DialogTitle>
            <DialogDescription>
              Hành động này áp dụng cho sinh viên {selectedRisk?.studentName} (
              {selectedRisk?.studentCode}).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {dialogMode === 'RESOLVE' ? 'Ghi chú giải quyết' : 'Lý do bỏ qua'}
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú chi tiết..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!note.trim() || resolveMutation.isPending || dismissMutation.isPending}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

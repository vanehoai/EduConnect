'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequestEnvelope, apiRequest } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Edit2, LoaderCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface ClassSection {
  id: string;
  sectionCode: string;
  name: string;
  course: { name: string };
}

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
}

interface AttendanceSession {
  id: string;
  sessionDate: string;
}

interface AttendanceRecord {
  id: string;
  attendanceSessionId: string;
  studentId: string;
  status: AttendanceStatus;
}

export default function TrainingAttendancePage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    sessionId: string;
    studentId: string;
    status: AttendanceStatus;
    reason: string;
  } | null>(null);

  const { data: classesData } = useQuery({
    queryKey: ['admin-class-sections'],
    queryFn: () =>
      apiRequestEnvelope<ClassSection[]>('/admin/class-sections').catch(() => ({ data: [] })),
  });

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['admin-class-students', selectedClassId],
    queryFn: () =>
      apiRequestEnvelope<Student[]>(`/admin/class-sections/${selectedClassId}/students`).catch(
        () => ({ data: [] }),
      ),
    enabled: !!selectedClassId,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['admin-class-attendance-sessions', selectedClassId],
    queryFn: () =>
      apiRequestEnvelope<AttendanceSession[]>(
        `/admin/class-sections/${selectedClassId}/attendance-sessions`,
      ).catch(() => ({ data: [] })),
    enabled: !!selectedClassId,
  });

  const { data: recordsData } = useQuery({
    queryKey: ['admin-class-attendance-records', selectedClassId],
    queryFn: () =>
      apiRequestEnvelope<AttendanceRecord[]>(
        `/admin/class-sections/${selectedClassId}/attendance-records`,
      ).catch(() => ({ data: [] })),
    enabled: !!selectedClassId,
  });

  const updateRecordMutation = useMutation({
    mutationFn: (data: {
      sessionId: string;
      studentId: string;
      status: AttendanceStatus;
      reason: string;
    }) =>
      apiRequest(`/admin/class-sections/${selectedClassId}/attendance-records`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Cập nhật điểm danh thành công');
      setEditModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['admin-class-attendance-records', selectedClassId],
      });
    },
    onError: () => toast.error('Lỗi cập nhật'),
  });

  const handleEditClick = (
    sessionId: string,
    studentId: string,
    currentStatus: AttendanceStatus,
  ) => {
    setEditingRecord({ sessionId, studentId, status: currentStatus, reason: '' });
    setEditModalOpen(true);
  };

  const handleSaveRecord = () => {
    if (!editingRecord) return;
    if (!editingRecord.reason) return toast.error('Vui lòng nhập lý do');

    updateRecordMutation.mutate(editingRecord);
  };

  const classes = classesData?.data || [];
  const students = studentsData?.data || [];
  const sessions = sessionsData?.data || [];
  const records = recordsData?.data || [];

  const getStatusDisplay = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return {
          label: 'Có mặt',
          color:
            'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        };
      case 'ABSENT':
        return {
          label: 'Vắng mặt',
          color:
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        };
      case 'LATE':
        return {
          label: 'Đi trễ',
          color:
            'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        };
      case 'EXCUSED':
        return {
          label: 'Có phép',
          color:
            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        };
      default:
        return {
          label: '-',
          color:
            'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý điểm danh"
        description="Quản lý và điều chỉnh trạng thái điểm danh của sinh viên theo lớp học phần."
      />

      <Card>
        <CardContent className="p-4">
          <div className="w-full sm:w-[350px]">
            <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Chọn lớp học phần
            </Label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn lớp học phần --" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.sectionCode} - {cls.course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && (
        <Card>
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg">Bảng điểm danh</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loadingStudents ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center text-slate-500">
                  <LoaderCircle className="mb-2 h-6 w-6 animate-spin" />
                  Đang tải dữ liệu...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] font-semibold">MSSV</TableHead>
                      <TableHead className="min-w-[200px] font-semibold">Họ và tên</TableHead>
                      {sessions.map((session) => (
                        <TableHead key={session.id} className="min-w-[140px] font-semibold">
                          {new Date(session.sessionDate).toLocaleDateString('vi-VN')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={sessions.length + 2}
                          className="h-32 text-center text-slate-500"
                        >
                          Lớp học phần này chưa có sinh viên.
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                            {student.studentCode}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                            {student.fullName}
                          </TableCell>
                          {sessions.map((session) => {
                            const record = records.find(
                              (r) =>
                                r.attendanceSessionId === session.id && r.studentId === student.id,
                            );
                            const status = record?.status || 'PRESENT';
                            const display = getStatusDisplay(status);

                            return (
                              <TableCell key={session.id}>
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={cn(
                                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                      display.color,
                                    )}
                                  >
                                    {display.label}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-slate-400 hover:text-primary"
                                    onClick={() => handleEditClick(session.id, student.id, status)}
                                    title="Chỉnh sửa điểm danh"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Điều chỉnh điểm danh</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Trạng thái mới</Label>
              <Select
                value={editingRecord?.status}
                onValueChange={(val) =>
                  setEditingRecord((prev) =>
                    prev ? { ...prev, status: val as AttendanceStatus } : null,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">Có mặt</SelectItem>
                  <SelectItem value="ABSENT">Vắng mặt</SelectItem>
                  <SelectItem value="LATE">Đi trễ</SelectItem>
                  <SelectItem value="EXCUSED">Có phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>
                Lý do thay đổi <span className="text-destructive">*</span>
              </Label>
              <Input
                value={editingRecord?.reason || ''}
                onChange={(e) =>
                  setEditingRecord((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                }
                placeholder="Ví dụ: Sinh viên nộp giấy khám bệnh..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveRecord}
              disabled={updateRecordMutation.isPending || !editingRecord?.reason}
            >
              {updateRecordMutation.isPending && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

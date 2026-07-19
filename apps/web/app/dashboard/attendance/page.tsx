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
import { Edit2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý điểm danh (Đào tạo)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-[300px]">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp học phần" />
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
          <CardHeader>
            <CardTitle>Bảng điểm danh</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loadingStudents ? (
              <div className="text-center p-4">Đang tải dữ liệu...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">MSSV</TableHead>
                    <TableHead className="w-[200px]">Họ tên</TableHead>
                    {sessions.map((session) => (
                      <TableHead key={session.id} className="min-w-[120px]">
                        {new Date(session.sessionDate).toLocaleDateString('vi-VN')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={sessions.length + 2} className="text-center">
                        Không có sinh viên
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.studentCode}</TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        {sessions.map((session) => {
                          const record = records.find(
                            (r) =>
                              r.attendanceSessionId === session.id && r.studentId === student.id,
                          );
                          const status = record?.status || 'PRESENT';

                          let statusText = '-';
                          if (status === 'PRESENT') statusText = 'Có mặt';
                          else if (status === 'ABSENT') statusText = 'Vắng';
                          else if (status === 'LATE') statusText = 'Trễ';
                          else if (status === 'EXCUSED') statusText = 'Có phép';

                          return (
                            <TableCell key={session.id}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{statusText}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleEditClick(session.id, student.id, status)}
                                >
                                  <Edit2 className="h-3 w-3" />
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
          </CardContent>
        </Card>
      )}

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa điểm danh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái mới</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Lý do thay đổi (Bắt buộc)</label>
              <Input
                value={editingRecord?.reason || ''}
                onChange={(e) =>
                  setEditingRecord((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                }
                placeholder="Ví dụ: Sinh viên bổ sung giấy phép"
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
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { apiRequestEnvelope, apiRequest, apiDownload } from '@/lib/api-client';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
}

interface AttendanceSession {
  id: string;
  sessionDate: string;
  topic?: string;
}

interface AttendanceRecord {
  id: string;
  attendanceSessionId: string;
  studentId: string;
  status: AttendanceStatus;
}

export default function ClassAttendancePage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['class-section-students', id],
    queryFn: () =>
      apiRequestEnvelope<Student[]>(`/lecturers/me/class-sections/${id}/students`).catch(() => ({
        data: [],
      })),
  });

  const { data: sessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ['class-section-attendance-sessions', id],
    queryFn: () =>
      apiRequestEnvelope<AttendanceSession[]>(
        `/lecturers/me/class-sections/${id}/attendance-sessions`,
      ).catch(() => ({ data: [] })),
  });

  const { data: recordsData, isLoading: loadingRecords } = useQuery({
    queryKey: ['class-section-attendance-records', id],
    queryFn: () =>
      apiRequestEnvelope<AttendanceRecord[]>(
        `/lecturers/me/class-sections/${id}/attendance-records`,
      ).catch(() => ({ data: [] })),
  });

  const [newSessionDate, setNewSessionDate] = useState('');

  const createSessionMutation = useMutation({
    mutationFn: (date: string) =>
      apiRequest(`/lecturers/me/class-sections/${id}/attendance-sessions`, {
        method: 'POST',
        body: JSON.stringify({ sessionDate: date, startTime: '00:00:00', endTime: '23:59:59' }),
      }),
    onSuccess: () => {
      toast.success('Tạo buổi điểm danh thành công');
      queryClient.invalidateQueries({ queryKey: ['class-section-attendance-sessions', id] });
    },
    onError: () => toast.error('Lỗi khi tạo buổi điểm danh'),
  });

  const updateRecordMutation = useMutation({
    mutationFn: (data: { sessionId: string; studentId: string; status: AttendanceStatus }) =>
      apiRequest(`/lecturers/me/class-sections/${id}/attendance-records`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['class-section-attendance-records', id] });
    },
    onError: () => toast.error('Lỗi cập nhật'),
  });

  const handleCreateSession = () => {
    if (!newSessionDate) return toast.error('Vui lòng chọn ngày');
    createSessionMutation.mutate(newSessionDate);
  };

  const handleStatusChange = (sessionId: string, studentId: string, status: AttendanceStatus) => {
    updateRecordMutation.mutate({ sessionId, studentId, status });
  };

  const handleExport = () => {
    apiDownload(`/class-sections/${id}/attendance/export`, `attendance-${id}.csv`);
  };

  if (loadingStudents || loadingSessions || loadingRecords)
    return <div className="p-8">Đang tải...</div>;

  const students = studentsData?.data || [];
  const sessions = sessionsData?.data || [];
  const records = recordsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Điểm danh sinh viên</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tạo buổi điểm danh mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={newSessionDate}
              onChange={(e) => setNewSessionDate(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleCreateSession} disabled={createSessionMutation.isPending}>
              Tạo buổi học
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bảng điểm danh</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">MSSV</TableHead>
                <TableHead className="w-[200px]">Họ tên</TableHead>
                {sessions.map((session) => (
                  <TableHead key={session.id} className="min-w-[150px]">
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
                        (r) => r.attendanceSessionId === session.id && r.studentId === student.id,
                      );
                      return (
                        <TableCell key={session.id}>
                          <Select
                            value={record?.status || ''}
                            onValueChange={(val) =>
                              handleStatusChange(session.id, student.id, val as AttendanceStatus)
                            }
                          >
                            <SelectTrigger className="w-full h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRESENT">Có mặt</SelectItem>
                              <SelectItem value="ABSENT">Vắng mặt</SelectItem>
                              <SelectItem value="LATE">Đi trễ</SelectItem>
                              <SelectItem value="EXCUSED">Có phép</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

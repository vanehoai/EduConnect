'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiRequestEnvelope } from '@/lib/api-client';
import { Progress } from '@/components/ui/progress';

interface AttendanceSummary {
  classSectionId: string;
  courseCode: string;
  courseName: string;
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

export default function StudentAttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-attendance-summary'],
    queryFn: () =>
      apiRequestEnvelope<AttendanceSummary[]>('/students/me/attendance-summary').catch(() => ({
        data: [],
      })),
  });

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  const summaries = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Điểm danh & Chuyên cần</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tỷ lệ chuyên cần các môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Môn học</TableHead>
                <TableHead>Tổng số buổi</TableHead>
                <TableHead className="text-green-600">Có mặt</TableHead>
                <TableHead className="text-red-600">Vắng</TableHead>
                <TableHead className="text-orange-600">Đi trễ</TableHead>
                <TableHead className="text-blue-600">Có phép</TableHead>
                <TableHead className="w-[200px]">Tỷ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Chưa có dữ liệu điểm danh
                  </TableCell>
                </TableRow>
              ) : (
                summaries.map((summary) => (
                  <TableRow key={summary.classSectionId}>
                    <TableCell>
                      <div className="font-medium">{summary.courseName}</div>
                      <div className="text-sm text-muted-foreground">{summary.courseCode}</div>
                    </TableCell>
                    <TableCell>{summary.totalSessions}</TableCell>
                    <TableCell>{summary.present}</TableCell>
                    <TableCell>{summary.absent}</TableCell>
                    <TableCell>{summary.late}</TableCell>
                    <TableCell>{summary.excused}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={summary.attendanceRate} className="w-[100px]" />
                        <span className="text-sm font-medium">
                          {summary.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
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

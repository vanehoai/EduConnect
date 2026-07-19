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

interface ClassSection {
  id: string;
  sectionCode: string;
  name: string;
  course: { name: string };
}

interface GradeComponent {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface StudentGrade {
  studentId: string;
  gradeComponentId: string;
  score: number;
}

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
}

export default function TrainingGradesPage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    componentId: string;
    oldScore: number;
    newScore: string;
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

  const { data: componentsData } = useQuery({
    queryKey: ['admin-class-grade-components', selectedClassId],
    queryFn: () =>
      apiRequestEnvelope<GradeComponent[]>(
        `/admin/class-sections/${selectedClassId}/grade-components`,
      ).catch(() => ({ data: [] })),
    enabled: !!selectedClassId,
  });

  const { data: gradesData } = useQuery({
    queryKey: ['admin-class-grades', selectedClassId],
    queryFn: () =>
      apiRequestEnvelope<StudentGrade[]>(`/admin/class-sections/${selectedClassId}/grades`).catch(
        () => ({ data: [] }),
      ),
    enabled: !!selectedClassId,
  });

  const updateGradeMutation = useMutation({
    mutationFn: (data: { studentId: string; componentId: string; score: number; reason: string }) =>
      apiRequest(`/admin/class-sections/${selectedClassId}/grades`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Cập nhật điểm thành công');
      setEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-class-grades', selectedClassId] });
    },
    onError: () => toast.error('Lỗi khi cập nhật điểm'),
  });

  const handleEditClick = (studentId: string, componentId: string, score: number) => {
    setEditingGrade({
      studentId,
      componentId,
      oldScore: score,
      newScore: score.toString(),
      reason: '',
    });
    setEditModalOpen(true);
  };

  const handleSaveGrade = () => {
    if (!editingGrade) return;
    if (!editingGrade.reason) return toast.error('Vui lòng nhập lý do sửa điểm');

    updateGradeMutation.mutate({
      studentId: editingGrade.studentId,
      componentId: editingGrade.componentId,
      score: parseFloat(editingGrade.newScore) || 0,
      reason: editingGrade.reason,
    });
  };

  const classes = classesData?.data || [];
  const students = studentsData?.data || [];
  const components = componentsData?.data || [];
  const grades = gradesData?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý điểm (Đào tạo)</h1>

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
            <CardTitle>Bảng điểm</CardTitle>
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
                    {components.map((comp) => (
                      <TableHead key={comp.id}>
                        {comp.name} ({comp.weight}%)
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={components.length + 2} className="text-center">
                        Không có sinh viên
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.studentCode}</TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        {components.map((comp) => {
                          const grade = grades.find(
                            (g) => g.studentId === student.id && g.gradeComponentId === comp.id,
                          );
                          const score = grade?.score ?? 0;
                          return (
                            <TableCell key={comp.id}>
                              <div className="flex items-center gap-2">
                                <span>{score}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleEditClick(student.id, comp.id, score)}
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
            <DialogTitle>Sửa điểm sinh viên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Điểm mới</label>
              <Input
                type="number"
                value={editingGrade?.newScore || ''}
                onChange={(e) =>
                  setEditingGrade((prev) => (prev ? { ...prev, newScore: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lý do thay đổi (Bắt buộc)</label>
              <Input
                value={editingGrade?.reason || ''}
                onChange={(e) =>
                  setEditingGrade((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                }
                placeholder="Ví dụ: Phúc khảo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveGrade}
              disabled={updateGradeMutation.isPending || !editingGrade?.reason}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

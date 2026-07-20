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
      <PageHeader
        title="Quản lý điểm số"
        description="Theo dõi và điều chỉnh điểm số của sinh viên trong các lớp học phần."
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
            <CardTitle className="text-lg">Bảng điểm</CardTitle>
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
                      <TableHead className="min-w-[200px] font-semibold">Họ tên</TableHead>
                      {components.map((comp) => (
                        <TableHead key={comp.id} className="font-semibold text-right">
                          <div className="flex flex-col items-end">
                            <span>{comp.name}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              Trọng số: {comp.weight}%
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={components.length + 2}
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
                          {components.map((comp) => {
                            const grade = grades.find(
                              (g) => g.studentId === student.id && g.gradeComponentId === comp.id,
                            );
                            const score = grade?.score ?? 0;
                            return (
                              <TableCell key={comp.id} className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-semibold text-primary">
                                    {score.toFixed(1)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-slate-400 hover:text-primary"
                                    onClick={() => handleEditClick(student.id, comp.id, score)}
                                    title="Điều chỉnh điểm"
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
            <DialogTitle>Điều chỉnh điểm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>
                Điểm mới <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={editingGrade?.newScore || ''}
                onChange={(e) =>
                  setEditingGrade((prev) => (prev ? { ...prev, newScore: e.target.value } : null))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Lý do thay đổi <span className="text-destructive">*</span>
              </Label>
              <Input
                value={editingGrade?.reason || ''}
                onChange={(e) =>
                  setEditingGrade((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                }
                placeholder="Ví dụ: Phúc khảo thành công..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveGrade}
              disabled={
                updateGradeMutation.isPending || !editingGrade?.reason || !editingGrade?.newScore
              }
            >
              {updateGradeMutation.isPending && (
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

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
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
import { apiRequestEnvelope, apiRequest, apiDownload } from '@/lib/api-client';
import { toast } from 'sonner';
import { Upload, CheckCircle, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
}

interface GradeComponent {
  id: string;
  name: string;
  type: string;
  weight: number;
  maxScore: number;
}

interface StudentGrade {
  studentId: string;
  gradeComponentId: string;
  score: number;
}

export default function ClassGradesPage() {
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

  const { data: componentsData, isLoading: loadingComponents } = useQuery({
    queryKey: ['class-section-grade-components', id],
    queryFn: () =>
      apiRequestEnvelope<GradeComponent[]>(
        `/lecturers/me/class-sections/${id}/grade-components`,
      ).catch(() => ({ data: [] })),
  });

  const { data: gradesData, isLoading: loadingGrades } = useQuery({
    queryKey: ['class-section-grades', id],
    queryFn: () =>
      apiRequestEnvelope<StudentGrade[]>(`/lecturers/me/class-sections/${id}/grades`).catch(() => ({
        data: [],
      })),
  });

  const [localGrades, setLocalGrades] = useState<StudentGrade[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize local grades from remote data
  useMemo(() => {
    if (gradesData?.data && !isEditing) {
      setLocalGrades(gradesData.data);
    }
  }, [gradesData?.data, isEditing]);

  const saveGradesMutation = useMutation({
    mutationFn: (grades: StudentGrade[]) =>
      apiRequest(`/lecturers/me/class-sections/${id}/grades`, {
        method: 'PUT',
        body: JSON.stringify({ grades }),
      }),
    onSuccess: () => {
      toast.success('Lưu điểm thành công');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['class-section-grades', id] });
    },
    onError: () => toast.error('Lỗi khi lưu điểm'),
  });

  const publishMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/lecturers/me/class-sections/${id}/publish-grades`, { method: 'POST' }),
    onSuccess: () => toast.success('Đã công bố điểm cho lớp'),
    onError: () => toast.error('Lỗi khi công bố điểm'),
  });

  const handleScoreChange = (studentId: string, componentId: string, value: string) => {
    setIsEditing(true);
    const numValue = parseFloat(value);

    setLocalGrades((prev) => {
      const existingIdx = prev.findIndex(
        (g) => g.studentId === studentId && g.gradeComponentId === componentId,
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        const current = next[existingIdx]!;
        next[existingIdx] = { ...current, score: isNaN(numValue) ? 0 : numValue };
        return next;
      }
      return [
        ...prev,
        { studentId, gradeComponentId: componentId, score: isNaN(numValue) ? 0 : numValue },
      ];
    });
  };

  const handleSave = () => {
    saveGradesMutation.mutate(localGrades);
  };

  const handleExport = () => {
    apiDownload(`/class-sections/${id}/grades/export-csv`, `grades-${id}.csv`);
  };

  const handleImport = async () => {
    if (!selectedFile) return toast.error('Vui lòng chọn file');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await apiRequest(`/class-sections/${id}/grades/import-csv`, {
        method: 'POST',
        body: formData,
      });
      toast.success('Import thành công');
      setImportModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['class-section-grades', id] });
    } catch {
      toast.error('Lỗi khi import');
    }
  };

  const calculateTotal = (studentId: string) => {
    if (!componentsData?.data) return 0;

    let total = 0;
    for (const comp of componentsData.data) {
      const grade = localGrades.find(
        (g) => g.studentId === studentId && g.gradeComponentId === comp.id,
      );
      if (grade) {
        total += (grade.score / comp.maxScore) * comp.weight;
      }
    }
    return (total / 10).toFixed(2); // Assuming max total is 10
  };

  if (loadingStudents || loadingComponents || loadingGrades)
    return <div className="p-8">Đang tải...</div>;

  const students = studentsData?.data || [];
  const components = componentsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý điểm</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="default"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Công bố kết quả lớp
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bảng điểm sinh viên</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto space-y-4">
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
                <TableHead className="font-bold text-primary">Tổng kết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={components.length + 3} className="text-center">
                    Không có sinh viên
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentCode}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    {components.map((comp) => {
                      const grade = localGrades.find(
                        (g) => g.studentId === student.id && g.gradeComponentId === comp.id,
                      );
                      return (
                        <TableCell key={comp.id}>
                          <Input
                            type="number"
                            min="0"
                            max={comp.maxScore}
                            step="0.1"
                            value={grade?.score ?? ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleScoreChange(student.id, comp.id, e.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell className="font-bold">{calculateTotal(student.id)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saveGradesMutation.isPending}>
                Lưu điểm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import điểm CSV</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

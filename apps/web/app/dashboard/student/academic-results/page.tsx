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
import { Badge } from '@/components/ui/badge';

interface GradeComponent {
  id: string;
  name: string;
  weight: number;
}

interface CourseGrades {
  classSectionId: string;
  courseCode: string;
  courseName: string;
  components: GradeComponent[];
  scores: Record<string, number>;
  finalScore?: number;
  letterGrade?: string;
  passed?: boolean;
}

interface GPAInfo {
  semesterGpa: number;
  cumulativeGpa: number;
}

export default function StudentAcademicResultsPage() {
  const { data: gradesData, isLoading: loadingGrades } = useQuery({
    queryKey: ['student-grades'],
    queryFn: () =>
      apiRequestEnvelope<CourseGrades[]>('/students/me/grades').catch(() => ({ data: [] })),
  });

  const { data: gpaData, isLoading: loadingGpa } = useQuery({
    queryKey: ['student-gpa'],
    queryFn: () => apiRequestEnvelope<GPAInfo>('/students/me/gpa').catch(() => ({ data: null })),
  });

  if (loadingGrades || loadingGpa) return <div className="p-8">Đang tải...</div>;

  const courses = gradesData?.data || [];
  const gpa = gpaData?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kết quả học tập</h1>

      {gpa && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Điểm trung bình học kỳ (GPA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gpa.semesterGpa.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Điểm trung bình tích lũy (CPA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gpa.cumulativeGpa.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Chưa có điểm được công bố.
          </CardContent>
        </Card>
      ) : (
        courses.map((course) => (
          <Card key={course.classSectionId}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>{course.courseName}</CardTitle>
                <div className="text-sm text-muted-foreground">{course.courseCode}</div>
              </div>
              {course.passed !== undefined && (
                <Badge variant={course.passed ? 'default' : 'destructive'}>
                  {course.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thành phần điểm</TableHead>
                    <TableHead>Trọng số</TableHead>
                    <TableHead>Điểm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.components.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell>{comp.name}</TableCell>
                      <TableCell>{comp.weight}%</TableCell>
                      <TableCell className="font-medium">
                        {course.scores[comp.id] !== undefined ? course.scores[comp.id] : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(course.finalScore !== undefined || course.letterGrade) && (
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2} className="text-right">
                        Tổng kết:
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {course.finalScore !== undefined && (
                            <span>Hệ 10: {course.finalScore}</span>
                          )}
                          {course.letterGrade && <span>Điểm chữ: {course.letterGrade}</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

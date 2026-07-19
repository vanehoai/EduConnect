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
  scores: Record<string, number>; // componentId -> score
  finalScore?: number;
  letterGrade?: string;
  passed?: boolean;
}

export default function StudentGradesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-grades'],
    queryFn: () =>
      apiRequestEnvelope<CourseGrades[]>('/students/me/grades').catch(() => ({ data: [] })),
  });

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  const courses = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kết quả học tập</h1>

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

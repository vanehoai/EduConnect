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
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Target, TrendingUp, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  if (loadingGrades || loadingGpa) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-slate-500">
        <LoaderCircle className="mb-4 h-8 w-8 animate-spin" />
        Đang tải kết quả học tập...
      </div>
    );
  }

  const courses = gradesData?.data || [];
  const gpa = gpaData?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kết quả học tập"
        description="Xem điểm tổng kết, điểm thành phần và điểm trung bình tích lũy của bạn."
      />

      {gpa && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Điểm trung bình học kỳ (GPA)"
            value={gpa.semesterGpa.toFixed(2)}
            icon={TrendingUp}
            description="Hệ số 4.0 - Học kỳ hiện tại"
            trend="neutral"
          />
          <StatCard
            title="Điểm trung bình tích lũy (CPA)"
            value={gpa.cumulativeGpa.toFixed(2)}
            icon={Target}
            description="Hệ số 4.0 - Toàn khoá học"
            trend="up"
            trendValue="Tốt"
          />
        </div>
      )}

      {courses.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Target className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">Chưa có kết quả học tập</p>
            <p className="text-sm">Hiện tại chưa có điểm môn học nào được công bố.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Card
              key={course.classSectionId}
              className={cn(
                'overflow-hidden transition-all hover:shadow-md',
                course.passed === false && 'border-destructive/30',
              )}
            >
              <CardHeader
                className={cn(
                  'border-b p-4',
                  course.passed === true
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                    : course.passed === false
                      ? 'bg-destructive/5'
                      : 'bg-muted/20',
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base line-clamp-1" title={course.courseName}>
                      {course.courseName}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">{course.courseCode}</div>
                  </div>
                  {course.passed !== undefined && (
                    <Badge
                      variant={course.passed ? 'default' : 'destructive'}
                      className={cn(course.passed ? 'bg-emerald-500 hover:bg-emerald-600' : '')}
                    >
                      {course.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-2 px-4 h-auto">Thành phần</TableHead>
                      <TableHead className="py-2 px-4 h-auto text-right w-[80px]">
                        Trọng số
                      </TableHead>
                      <TableHead className="py-2 px-4 h-auto text-right w-[80px]">Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.components.map((comp) => (
                      <TableRow key={comp.id} className="border-b-0 hover:bg-transparent">
                        <TableCell className="py-2 px-4 text-slate-600 dark:text-slate-400">
                          {comp.name}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-right text-muted-foreground">
                          {comp.weight}%
                        </TableCell>
                        <TableCell className="py-2 px-4 text-right font-medium">
                          {course.scores[comp.id] !== undefined ? (
                            <span className="text-slate-900 dark:text-slate-100">
                              {course.scores[comp.id]}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(course.finalScore !== undefined || course.letterGrade) && (
                      <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-t">
                        <TableCell
                          colSpan={2}
                          className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300"
                        >
                          Tổng kết:
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            {course.finalScore !== undefined && (
                              <span className="text-lg font-bold text-primary leading-none">
                                {course.finalScore.toFixed(1)}
                              </span>
                            )}
                            {course.letterGrade && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {course.letterGrade}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

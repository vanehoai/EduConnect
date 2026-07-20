'use client';

import { useQuery } from '@tanstack/react-query';
import { academicRiskService } from '@/lib/services/academic-risk.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentAcademicRisksPage() {
  const { data: risks = [], isLoading } = useQuery({
    queryKey: ['my-academic-risks'],
    queryFn: () => academicRiskService.getMyRisks(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu cảnh báo...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Cảnh báo học vụ của tôi</h1>
        <p className="text-slate-500">
          Danh sách các cảnh báo học vụ liên quan đến kết quả học tập, điểm danh và học phí.
        </p>
      </div>

      {risks.length === 0 ? (
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-700 mb-2">Tuyệt vời!</h2>
            <p className="text-green-600/80 max-w-md">
              Bạn hiện không có cảnh báo học vụ nào. Hãy tiếp tục duy trì thành tích học tập tốt!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {risks.map((risk) => (
            <Card
              key={risk.id}
              className={
                risk.status === 'OPEN'
                  ? risk.severity === 'CRITICAL'
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-orange-200 bg-orange-50/30'
                  : 'bg-slate-50/50'
              }
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {risk.status === 'OPEN' ? (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Info className="w-5 h-5 text-slate-500" />
                      )}
                      {risk.description}
                    </CardTitle>
                    <CardDescription>
                      Phát sinh ngày: {format(new Date(risk.createdAt), 'dd/MM/yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        risk.severity === 'CRITICAL'
                          ? 'destructive'
                          : risk.severity === 'HIGH'
                            ? 'destructive'
                            : risk.severity === 'MEDIUM'
                              ? 'default'
                              : 'secondary'
                      }
                    >
                      {risk.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        risk.status === 'OPEN'
                          ? 'border-orange-500 text-orange-600 bg-white'
                          : risk.status === 'RESOLVED'
                            ? 'border-green-500 text-green-600 bg-white'
                            : 'border-slate-500 text-slate-600 bg-white'
                      }
                    >
                      {risk.status === 'OPEN'
                        ? 'Cần xử lý'
                        : risk.status === 'RESOLVED'
                          ? 'Đã giải quyết'
                          : 'Đã bỏ qua'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Loại cảnh báo:</span> {risk.type}
                  </p>
                  {risk.status === 'RESOLVED' && risk.resolutionNote && (
                    <p className="mt-2 text-green-700 bg-green-50 p-2 rounded-md">
                      <span className="font-medium">Ghi chú giải quyết:</span> {risk.resolutionNote}
                    </p>
                  )}
                  {risk.status === 'DISMISSED' && risk.dismissReason && (
                    <p className="mt-2 text-slate-700 bg-slate-100 p-2 rounded-md">
                      <span className="font-medium">Lý do bỏ qua:</span> {risk.dismissReason}
                    </p>
                  )}
                  {risk.status === 'OPEN' && (
                    <p className="mt-3 text-slate-600 italic">
                      Vui lòng liên hệ Phòng Đào Tạo hoặc Cố vấn học tập để được hướng dẫn giải
                      quyết.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  getServiceRequestById,
  getServiceRequestComments,
  addServiceRequestComment,
} from '@/lib/services/service-request.service';
import type { ServiceRequestCommentDto } from '@school/shared-types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { User, Clock } from 'lucide-react';

export default function StudentServiceRequestDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const {
    data: request,
    isLoading: requestLoading,
    isError: requestError,
  } = useQuery({
    queryKey: ['service-request-student', id],
    queryFn: () => getServiceRequestById(id),
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<ServiceRequestCommentDto[]>({
    queryKey: ['service-request-comments-student', id],
    queryFn: () => getServiceRequestComments(id),
    enabled: !!request,
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => addServiceRequestComment(id, content, 'PUBLIC'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-comments-student', id] });
      setCommentText('');
      toast.success('Đã gửi phản hồi');
    },
    onError: () => {
      toast.error('Không thể gửi phản hồi');
    },
  });

  if (requestLoading) return <div className="p-6">Đang tải...</div>;
  if (requestError || !request)
    return <div className="p-6 text-red-500">Không tìm thấy yêu cầu.</div>;

  // Filter out internal comments for student view - only show PUBLIC
  const publicComments = comments.filter(
    (c: ServiceRequestCommentDto) => c.visibility === 'PUBLIC',
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{request.subject}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Mã: {request.requestNumber}</span>
            <span>
              Tạo lúc: {format(new Date(request.createdAt), 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
        </div>
        <Badge
          variant={request.status === 'OPEN' ? 'default' : 'outline'}
          className="text-sm py-1 px-3"
        >
          {request.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả yêu cầu</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{request.description}</CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trao đổi công khai</h3>
            {commentsLoading ? (
              <p>Đang tải...</p>
            ) : publicComments.length === 0 ? (
              <p className="text-muted-foreground">Chưa có trao đổi nào.</p>
            ) : (
              <div className="space-y-4">
                {publicComments.map((comment: ServiceRequestCommentDto) => (
                  <Card key={comment.id} className="bg-muted/30">
                    <CardHeader className="py-3 px-4 flex flex-row items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{comment.authorUserId}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm whitespace-pre-wrap">
                      {comment.content}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!['CLOSED', 'CANCELLED', 'RESOLVED'].includes(request.status) && (
              <div className="mt-6">
                <Textarea
                  placeholder="Nhập phản hồi của bạn..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                  rows={4}
                />
                <Button
                  onClick={() => commentMutation.mutate(commentText)}
                  disabled={!commentText.trim() || commentMutation.isPending}
                >
                  {commentMutation.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block">Danh mục</span>
                <span className="font-medium">{request.category?.name ?? '—'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Trạng thái</span>
                <span className="font-medium">{request.status.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Ưu tiên</span>
                <span className="font-medium">{request.priority}</span>
              </div>
              {request.dueAt && (
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" /> Hạn xử lý
                  </span>
                  <span className="font-medium text-sm">
                    {format(new Date(request.dueAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </span>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground block">Cập nhật lúc</span>
                <span className="text-sm">
                  {format(new Date(request.updatedAt), 'dd/MM/yyyy', { locale: vi })}
                </span>
              </div>
              {request.resolutionSummary && (
                <div>
                  <span className="text-xs text-muted-foreground block">Giải pháp</span>
                  <span className="text-sm">{request.resolutionSummary}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

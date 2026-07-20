'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudentAnnouncements,
  markAnnouncementAsRead,
} from '@/lib/services/announcement.service';
import type { AnnouncementDto } from '@school/shared-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function StudentAnnouncementsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-announcements'],
    queryFn: () => getStudentAnnouncements(),
  });

  const announcements = (data ?? []) as AnnouncementDto[];

  const markAsRead = useMutation({
    mutationFn: markAnnouncementAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-announcements'] });
    },
  });

  if (isLoading) {
    return <div className="p-6">Đang tải thông báo...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Không thể tải thông báo.</div>;
  }

  // Backend returns announcements; unread = not yet published via read receipt (publishedAt present = published, no receipt = unread)
  const unreadCount = (announcements as AnnouncementDto[]).filter((a) => !a.publishedAt).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thông báo</h1>
          <p className="text-muted-foreground">Cập nhật thông tin mới nhất từ nhà trường.</p>
        </div>
        <Badge variant={unreadCount > 0 ? 'destructive' : 'secondary'}>
          {unreadCount} chưa đọc
        </Badge>
      </div>

      <div className="space-y-4">
        {(announcements as AnnouncementDto[]).length === 0 ? (
          <p className="text-muted-foreground">Không có thông báo nào.</p>
        ) : (
          (announcements as AnnouncementDto[]).map((announcement) => (
            <Card
              key={announcement.id}
              className={!announcement.publishedAt ? 'border-primary' : ''}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {announcement.title}
                    <Badge variant="outline" className="text-xs">
                      {announcement.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(announcement.createdAt), 'PPP p', { locale: vi })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => markAsRead.mutate(announcement.id)}
                  disabled={markAsRead.isPending}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Đã đọc
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{announcement.content}</p>
                {announcement.summary && (
                  <p className="text-xs text-muted-foreground mt-2">{announcement.summary}</p>
                )}
                <div className="mt-4 flex gap-2">
                  {(announcement.audiences?.map((a) => a.audienceType) ?? []).map((audience) => (
                    <Badge key={audience} variant="outline" className="text-xs">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

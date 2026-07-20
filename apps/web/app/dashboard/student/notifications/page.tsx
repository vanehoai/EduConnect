'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/services/notification.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const getIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'ERROR':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function StudentNotificationsPage() {
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['student-notifications'],
    queryFn: () => getNotifications({ limit: 50 }),
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  if (isLoading) return <div className="p-6">Loading notifications...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load notifications.</div>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Your personal alerts and updates.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={unreadCount > 0 ? 'default' : 'secondary'}>{unreadCount} unread</Badge>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">You have no notifications.</p>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.isRead ? 'opacity-75 bg-muted/20' : 'border-primary/50'}
            >
              <div className="p-4 flex gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), 'PPP p')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => markReadMutation.mutate(notification.id)}
                        title="Mark as read"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 pt-1">{notification.message}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationPreferences,
  updateNotificationPreference,
} from '@/lib/services/notification-preference.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {} from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { NotificationPreferenceDto } from '@school/shared-types';

export default function StudentNotificationSettingsPage() {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NotificationPreferenceDto> }) =>
      updateNotificationPreference(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast.success('Preferences updated successfully');
    },
    onError: () => {
      toast.error('Failed to update preferences');
    },
  });

  const handleToggle = (
    id: string,
    field: 'inAppEnabled' | 'emailEnabled',
    currentValue: boolean,
  ) => {
    updateMutation.mutate({ id, data: { [field]: !currentValue } });
  };

  if (isLoading) return <div className="p-6">Loading preferences...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground">Manage how you receive alerts and updates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Choose your preferred notification channels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences?.length === 0 ? (
              <p className="text-muted-foreground">No preferences available.</p>
            ) : (
              preferences?.map((pref) => (
                <div
                  key={pref.id}
                  className="grid grid-cols-3 gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="col-span-3 md:col-span-1">
                    <h3 className="font-medium">{pref.category.replace(/_/g, ' ')}</h3>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={pref.inAppEnabled}
                        onCheckedChange={() =>
                          handleToggle(pref.id, 'inAppEnabled', pref.inAppEnabled)
                        }
                        disabled={updateMutation.isPending}
                      />
                      <span>In-App</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={pref.emailEnabled}
                        onCheckedChange={() =>
                          handleToggle(pref.id, 'emailEnabled', pref.emailEnabled)
                        }
                        disabled={updateMutation.isPending}
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

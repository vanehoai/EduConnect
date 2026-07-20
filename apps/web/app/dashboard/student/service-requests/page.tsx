'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentServiceRequests } from '@/lib/services/service-request.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function StudentServiceRequestsPage() {
  const {
    data: requests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['student-service-requests'],
    queryFn: getStudentServiceRequests,
  });

  if (isLoading) {
    return <div className="p-6">Loading service requests...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load service requests.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">Manage your support tickets and requests.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student/service-requests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {requests?.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            You have not created any service requests yet.
          </p>
        ) : (
          requests?.map(
            (request: {
              id: string;
              subject: string;
              requestNumber: string;
              status: string;
              priority: string;
              createdAt: string;
              expectedSla?: string;
              category?: { name: string };
            }) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/dashboard/student/service-requests/${request.id}`}
                        className="hover:underline flex items-center gap-2"
                      >
                        {request.subject}
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Created on {format(new Date(request.createdAt), 'PPP')}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      request.status === 'OPEN'
                        ? 'default'
                        : request.status === 'CLOSED'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {request.status.replace('_', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground block mb-1">ID</span>
                      <span className="font-medium">{request.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Category</span>
                      <span className="font-medium">
                        {request.category?.name?.replace('_', ' ') || 'General'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">Expected SLA</span>
                      <span className="font-medium">
                        {request.expectedSla
                          ? format(new Date(request.expectedSla), 'PPP p')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )
        )}
      </div>
    </div>
  );
}

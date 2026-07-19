'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, HealthStatus } from '@school/shared-types';
import { CheckCircle2, LoaderCircle, ServerCrash } from 'lucide-react';
import { cn } from '@/lib/utils';

async function getHealth(): Promise<HealthStatus> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
  const response = await fetch(`${apiUrl}/health`);
  if (!response.ok) {
    throw new Error('API chưa sẵn sàng');
  }

  const payload = (await response.json()) as ApiResponse<HealthStatus>;
  return payload.data;
}

export function SystemStatus() {
  const healthQuery = useQuery({ queryKey: ['system-health'], queryFn: getHealth });
  const isReady = healthQuery.data?.status === 'ok';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium',
        isReady && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        healthQuery.isLoading && 'border-slate-200 bg-slate-50 text-slate-600',
        healthQuery.isError && 'border-amber-200 bg-amber-50 text-amber-700',
      )}
    >
      {isReady ? <CheckCircle2 className="h-4 w-4" /> : null}
      {healthQuery.isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {healthQuery.isError ? <ServerCrash className="h-4 w-4" /> : null}
      {isReady ? 'Hệ thống đã sẵn sàng' : null}
      {healthQuery.isLoading ? 'Đang kiểm tra hệ thống' : null}
      {healthQuery.isError ? 'API đang khởi động' : null}
    </div>
  );
}

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {value}
              </h3>
              {trend && trendValue && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend === 'up' && 'text-success',
                    trend === 'down' && 'text-destructive',
                    trend === 'neutral' && 'text-slate-500',
                  )}
                >
                  {trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

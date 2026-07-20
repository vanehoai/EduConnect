'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsCharts({
  data,
}: {
  data: {
    studentStatusStats: Array<{ status: string; count: number }>;
    revenueByMonth: Array<{ month: string; amount: number }>;
  };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Trạng thái sinh viên</CardTitle>
          <CardDescription>Phân bố trạng thái của sinh viên trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.studentStatusStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {data.studentStatusStats.map(
                    (entry: { status: string; count: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Doanh thu học phí</CardTitle>
          <CardDescription>Thống kê theo các tháng gần nhất (VNĐ)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: unknown) =>
                    typeof value === 'number'
                      ? value.toLocaleString('vi-VN')
                      : (value as React.ReactNode)
                  }
                />
                <Legend />
                <Bar dataKey="amount" fill="#3b82f6" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

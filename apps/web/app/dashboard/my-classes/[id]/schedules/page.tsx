'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ResourcePage, type ResourcePageConfig } from '@/components/academic/resource-page';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SchedulesPage() {
  const params = useParams();
  const id = params.id as string;

  const config = useMemo<ResourcePageConfig>(
    () => ({
      title: 'Lịch học',
      description: 'Quản lý lịch học cho lớp học phần này.',
      endpoint: `/class-sections/${id}/schedules`,
      entityLabel: 'lịch học',
      readPermission: 'class-section.read',
      createPermission: 'schedule.manage',
      updatePermission: 'schedule.manage',
      deletePermission: 'schedule.manage',
      columns: [
        { key: 'dayOfWeek', label: 'Thứ', format: (v) => `Thứ ${Number(v) + 1}` },
        { key: 'startTime', label: 'Bắt đầu' },
        { key: 'endTime', label: 'Kết thúc' },
        { key: 'room.name', label: 'Phòng học' },
        { key: 'type', label: 'Loại' },
      ],
      fields: [
        {
          name: 'dayOfWeek',
          label: 'Thứ',
          type: 'select',
          options: [
            { value: '1', label: 'Thứ 2' },
            { value: '2', label: 'Thứ 3' },
            { value: '3', label: 'Thứ 4' },
            { value: '4', label: 'Thứ 5' },
            { value: '5', label: 'Thứ 6' },
            { value: '6', label: 'Thứ 7' },
            { value: '0', label: 'Chủ nhật' },
          ],
          required: true,
        },
        {
          name: 'startTime',
          label: 'Giờ bắt đầu',
          type: 'text',
          placeholder: 'VD: 07:00',
          required: true,
        },
        {
          name: 'endTime',
          label: 'Giờ kết thúc',
          type: 'text',
          placeholder: 'VD: 09:30',
          required: true,
        },
        {
          name: 'roomId',
          label: 'Phòng học',
          type: 'text', // Assuming we just enter room id for now, or lookup. Wait, we don't have room lookup in config yet.
          required: true,
        },
        {
          name: 'type',
          label: 'Loại hình',
          type: 'select',
          options: [
            { value: 'THEORY', label: 'Lý thuyết' },
            { value: 'PRACTICE', label: 'Thực hành' },
            { value: 'EXAM', label: 'Thi' },
          ],
          required: true,
        },
      ],
      sortOptions: [
        { value: 'dayOfWeek', label: 'Thứ' },
        { value: 'startTime', label: 'Giờ bắt đầu' },
      ],
      defaultSort: 'dayOfWeek',
      extraActions: (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/class-sections/${id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại lớp học
          </Link>
        </Button>
      ),
    }),
    [id],
  );

  return <ResourcePage config={config} />;
}

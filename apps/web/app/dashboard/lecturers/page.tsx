'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { lecturerConfig } from '@/lib/academic-configs';
export default function LecturersPage() {
  return <ResourcePage config={lecturerConfig} />;
}

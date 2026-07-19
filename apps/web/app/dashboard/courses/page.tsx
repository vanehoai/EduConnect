'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { courseConfig } from '@/lib/academic-configs';
export default function CoursesPage() {
  return <ResourcePage config={courseConfig} />;
}

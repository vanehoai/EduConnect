'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { academicYearConfig } from '@/lib/academic-configs';
export default function AcademicYearsPage() {
  return <ResourcePage config={academicYearConfig} />;
}

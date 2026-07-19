'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { semesterConfig } from '@/lib/academic-configs';
export default function SemestersPage() {
  return <ResourcePage config={semesterConfig} />;
}

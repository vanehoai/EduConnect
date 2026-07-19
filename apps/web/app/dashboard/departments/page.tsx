'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { departmentConfig } from '@/lib/academic-configs';
export default function DepartmentsPage() {
  return <ResourcePage config={departmentConfig} />;
}

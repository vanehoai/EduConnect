'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { classSectionConfig } from '@/lib/academic-configs';

export default function ClassSectionsPage() {
  return <ResourcePage config={classSectionConfig} />;
}

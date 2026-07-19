'use client';
import { ResourcePage } from '@/components/academic/resource-page';
import { StudentImportActions } from '@/components/academic/student-import-actions';
import { studentConfig } from '@/lib/academic-configs';
export default function StudentsPage() {
  return <ResourcePage config={{ ...studentConfig, extraActions: <StudentImportActions /> }} />;
}

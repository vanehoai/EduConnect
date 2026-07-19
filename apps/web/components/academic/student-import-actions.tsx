'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Download, LoaderCircle, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ApiClientError, apiDownload, apiRequest } from '@/lib/api-client';
import { useCurrentUser } from '@/lib/auth';

interface ImportError {
  row: number;
  code: string;
  message: string;
}
interface ImportResult {
  imported: number;
  errors: ImportError[];
  atomic: boolean;
}

export function StudentImportActions() {
  const user = useCurrentUser().data;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [atomic, setAtomic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const canImport = user?.permissions.includes('student.import');
  const canExport = user?.permissions.includes('student.export');

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setErrors([]);
    const form = new FormData();
    form.append('file', file);
    try {
      const result = await apiRequest<ImportResult>(`/students/import?atomic=${atomic}`, {
        method: 'POST',
        body: form,
      });
      setErrors(result.errors);
      toast.success(
        `Đã import ${result.imported} sinh viên${result.errors.length ? `, ${result.errors.length} dòng lỗi` : ''}`,
      );
      await queryClient.invalidateQueries({ queryKey: ['resource', '/students'] });
    } catch (error) {
      if (error instanceof ApiClientError && Array.isArray(error.details)) {
        setErrors(error.details as ImportError[]);
      }
      toast.error(error instanceof ApiClientError ? error.message : 'Không thể import sinh viên');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      {canImport ? (
        <label className="flex items-center gap-2 rounded-md border bg-white px-3 text-sm">
          <input
            type="checkbox"
            checked={atomic}
            onChange={(event) => setAtomic(event.target.checked)}
          />
          Atomic
        </label>
      ) : null}
      {canImport ? (
        <Button
          variant="outline"
          onClick={() =>
            void apiDownload('/students/import-template', 'students-import-template.csv')
          }
        >
          <Download className="mr-2 h-4 w-4" />
          File mẫu
        </Button>
      ) : null}
      {canExport ? (
        <Button
          variant="outline"
          onClick={() =>
            void apiDownload('/students/export', 'students.csv').catch((error) =>
              toast.error(error instanceof Error ? error.message : 'Không thể export'),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      ) : null}
      {canImport ? (
        <>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <Button variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import CSV
          </Button>
        </>
      ) : null}
      {errors.length ? (
        <div className="fixed bottom-5 right-5 z-40 max-h-72 w-[420px] overflow-auto rounded-xl border bg-white p-4 shadow-xl">
          <div className="mb-2 flex justify-between">
            <strong>Lỗi import theo dòng</strong>
            <button onClick={() => setErrors([])}>Đóng</button>
          </div>
          <ul className="space-y-2 text-sm">
            {errors.map((error) => (
              <li key={`${error.row}-${error.code}`} className="rounded bg-red-50 p-2 text-red-700">
                Dòng {error.row}: {error.message} ({error.code})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

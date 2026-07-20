'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service securely
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Đã xảy ra lỗi không mong muốn</h1>

        <p className="mb-8 text-gray-600">
          Hệ thống gặp sự cố trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau hoặc liên
          hệ bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.
        </p>

        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Tải lại trang
          </Button>
          <Button onClick={() => reset()}>Thử lại</Button>
        </div>
      </div>
    </div>
  );
}

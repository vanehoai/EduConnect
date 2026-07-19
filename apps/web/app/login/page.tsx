'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiClientError } from '@/lib/api-client';
import { useCurrentUser, useLogin } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const currentUser = useCurrentUser();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (currentUser.data) router.replace('/dashboard');
  }, [currentUser.data, router]);

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    router.replace('/dashboard');
  });

  const errorMessage =
    login.error instanceof ApiClientError
      ? login.error.message
      : login.error
        ? 'Không thể đăng nhập. Vui lòng thử lại.'
        : null;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-8">
          <div className="mb-7 text-center">
            <p className="text-xl font-bold text-primary">EduConnect</p>
            <h1 className="mt-4 text-2xl font-bold text-slate-950">Đăng nhập hệ thống</h1>
            <p className="mt-2 text-sm text-slate-600">Sử dụng tài khoản do nhà trường cấp.</p>
          </div>
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className="h-11 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="admin@school.local"
                {...register('email')}
              />
              {errors.email ? (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 w-full rounded-md border bg-white px-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              ) : null}
            </div>
            {errorMessage ? (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}
            <Button className="w-full" size="lg" type="submit" disabled={login.isPending}>
              {login.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

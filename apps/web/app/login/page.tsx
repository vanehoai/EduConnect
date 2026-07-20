'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle, GraduationCap, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <GraduationCap className="h-8 w-8" />
          EduConnect
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <Quote className="h-10 w-10 text-primary-foreground/40 mb-4" />
            <p className="text-xl font-medium leading-relaxed">
              &ldquo;Nền tảng quản lý trường học toàn diện giúp kết nối nhà trường, giảng viên và
              sinh viên một cách hiệu quả, minh bạch và chuyên nghiệp.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/80 mt-4">
              Hệ thống quản lý giáo dục 4.0
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center gap-2 mb-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">EduConnect</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập hệ thống</h1>
            <p className="text-sm text-muted-foreground">
              Nhập email và mật khẩu của bạn để truy cập
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={onSubmit} noValidate>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="admin@school.local"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      aria-invalid={Boolean(errors.password)}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 grid h-full w-10 place-items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {errorMessage && (
                  <div
                    className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
                    role="alert"
                    aria-live="assertive"
                  >
                    {errorMessage}
                  </div>
                )}

                <Button disabled={login.isPending} className="mt-2 w-full">
                  {login.isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {login.isPending ? 'Đang xác thực...' : 'Đăng nhập'}
                </Button>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}

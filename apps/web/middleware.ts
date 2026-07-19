import { type NextRequest, NextResponse } from 'next/server';

const ACCESS_COOKIE = 'educonnect_access';

export function middleware(request: NextRequest) {
  const hasAccessCookie = request.cookies.has(ACCESS_COOKIE);
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isLogin = request.nextUrl.pathname === '/login';

  if (isDashboard && !hasAccessCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isLogin && hasAccessCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};

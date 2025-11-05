import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('testology_token')?.value;

  // اگر در مسیر dashboard هست و توکن نداره، به لاگین هدایت کن
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      // بررسی اعتبار توکن
      const decoded = verify(token, process.env.NEXTAUTH_SECRET!);
      
      // اضافه کردن اطلاعات کاربر به header
      const response = NextResponse.next();
      response.headers.set('x-user-id', (decoded as any).id);
      response.headers.set('x-user-email', (decoded as any).email);
      response.headers.set('x-user-role', (decoded as any).role);
      
      return response;
    } catch (error) {
      // توکن نامعتبر، به لاگین هدایت کن
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};

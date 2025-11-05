import { NextRequest, NextResponse } from 'next/server'

export async function checkProfileCompletion(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // فقط برای صفحات داشبورد کاربر بررسی کن
  if (!pathname.startsWith('/dashboard') || pathname === '/dashboard/settings') {
    return NextResponse.next()
  }

  try {
    // بررسی وجود ایمیل در localStorage (این کار در client-side انجام می‌شود)
    // در اینجا فقط middleware را برای redirect آماده می‌کنیم
    return NextResponse.next()
  } catch (error) {
    console.error('Error checking profile completion:', error)
    return NextResponse.next()
  }
}







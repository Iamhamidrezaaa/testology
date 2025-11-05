import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 Toggling user status (authentication temporarily disabled)')

    const userId = params.id
    const { isActive } = await req.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }
    
    // Protect admin user
    if (user.email === 'admin@testology.me') {
      return NextResponse.json(
        { error: 'نمی‌توانید وضعیت مدیر کل را تغییر دهید' },
        { status: 403 }
      )
    }

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    })

    return NextResponse.json({
      success: true,
      message: `کاربر ${isActive ? 'فعال' : 'غیرفعال'} شد`,
      data: { id: userId, isActive }
    })

  } catch (error) {
    console.error('Error toggling user status:', error)
    return NextResponse.json(
      { error: 'خطا در تغییر وضعیت کاربر' },
      { status: 500 }
    )
  }
}










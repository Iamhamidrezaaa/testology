import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await req.json()
    
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'تمام فیلدها مورد نیاز است' },
        { status: 400 }
      )
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // بررسی رمز عبور فعلی
    if (user.password) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'رمز عبور فعلی نادرست است' },
          { status: 400 }
        )
      }
    }

    // هش کردن رمز عبور جدید
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // بروزرسانی رمز عبور
    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد'
    })
    
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در تغییر رمز عبور' },
      { status: 500 }
    )
  }
}







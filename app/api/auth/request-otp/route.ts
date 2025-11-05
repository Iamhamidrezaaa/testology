import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sign } from 'jsonwebtoken'
import { addMinutes } from 'date-fns'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, mode } = body

    if (!identifier || !mode) {
      return NextResponse.json(
        { success: false, message: 'شناسه و نوع ارسال الزامی است' },
        { status: 400 }
      )
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    })

    // اگر کاربر وجود نداشت، یک کاربر جدید ایجاد می‌کنیم
    let userId: string | undefined
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email: mode === 'email' ? identifier : null,
          phone: mode === 'sms' ? identifier : null,
        }
      })
      userId = newUser.id
    } else {
      userId = user.id
    }

    // تولید کد OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = addMinutes(new Date(), 5)

    // ذخیره کد OTP
    await prisma.oTP.create({
      data: {
        identifier,
        code: otpCode,
        mode,
        expiresAt,
        userId
      }
    })

    // در محیط توسعه، کد را برمی‌گردانیم
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'کد با موفقیت ارسال شد',
        code: otpCode // فقط در محیط توسعه
      })
    }

    // در محیط تولید، کد را از طریق ایمیل یا پیامک ارسال می‌کنیم
    if (mode === 'email') {
      // TODO: ارسال ایمیل
      console.log('ارسال ایمیل به:', identifier, 'با کد:', otpCode)
    } else {
      // TODO: ارسال پیامک
      console.log('ارسال پیامک به:', identifier, 'با کد:', otpCode)
    }

    return NextResponse.json({
      success: true,
      message: 'کد با موفقیت ارسال شد'
    })
  } catch (error) {
    console.error('خطا در ارسال کد:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال کد' },
      { status: 500 }
    )
  }
} 

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // دریافت تنظیمات شخصی (در اینجا mock data برمی‌گردانیم)
    const preferences = {
      theme: 'dark',
      language: 'fa',
      timezone: 'Asia/Tehran',
      dateFormat: 'persian',
      measurementUnit: 'metric'
    }

    return NextResponse.json({
      success: true,
      preferences
    })
    
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت تنظیمات شخصی' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, preferences } = await req.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // ذخیره تنظیمات شخصی (در اینجا فقط موفقیت برمی‌گردانیم)
    return NextResponse.json({
      success: true,
      message: 'تنظیمات شخصی با موفقیت ذخیره شد',
      preferences
    })
    
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ذخیره تنظیمات شخصی' },
      { status: 500 }
    )
  }
}







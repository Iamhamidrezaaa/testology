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

    // دریافت تنظیمات اعلان‌ها (در اینجا mock data برمی‌گردانیم)
    const notificationSettings = {
      emailNotifications: true,
      testReminders: true,
      learningReminders: true,
      securityAlerts: true,
      marketingEmails: false
    }

    return NextResponse.json({
      success: true,
      settings: notificationSettings
    })
    
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت تنظیمات اعلان‌ها' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, settings } = await req.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // ذخیره تنظیمات اعلان‌ها (در اینجا فقط موفقیت برمی‌گردانیم)
    return NextResponse.json({
      success: true,
      message: 'تنظیمات اعلان‌ها با موفقیت ذخیره شد',
      settings
    })
    
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ذخیره تنظیمات اعلان‌ها' },
      { status: 500 }
    )
  }
}







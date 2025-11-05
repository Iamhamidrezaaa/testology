import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // بازگردانی تنظیمات به حالت پیش‌فرض
    const defaultSettings = {
      logoUrl: '',
      welcomeMsg: 'به Testology خوش آمدید!',
      gptModel: 'gpt-3.5-turbo',
      font: 'Vazir',
      chatbotOn: true,
      registerOn: true
    }

    const setting = await (prisma as any).siteSetting.upsert({
      where: { id: 'singleton-id' },
      update: defaultSettings,
      create: {
        id: 'singleton-id',
        ...defaultSettings
      }
    })

    return NextResponse.json({ setting })

  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















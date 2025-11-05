import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت تنظیمات سایت
    let setting = await (prisma as any).siteSetting.findFirst()
    
    // اگر تنظیمات وجود ندارد، یک تنظیمات پیش‌فرض ایجاد کن
    if (!setting) {
      setting = await (prisma as any).siteSetting.create({
        data: {
          logoUrl: '',
          welcomeMsg: 'به Testology خوش آمدید!',
          gptModel: 'gpt-3.5-turbo',
          font: 'Vazir',
          chatbotOn: true,
          registerOn: true
        }
      })
    }

    return NextResponse.json(setting)

  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // به‌روزرسانی یا ایجاد تنظیمات
    const setting = await (prisma as any).siteSetting.upsert({
      where: { id: data.id || 'singleton-id' },
      update: {
        logoUrl: data.logoUrl,
        welcomeMsg: data.welcomeMsg,
        gptModel: data.gptModel,
        font: data.font,
        chatbotOn: data.chatbotOn,
        registerOn: data.registerOn,
        updatedAt: new Date()
      },
      create: {
        id: 'singleton-id',
        logoUrl: data.logoUrl || '',
        welcomeMsg: data.welcomeMsg || 'به Testology خوش آمدید!',
        gptModel: data.gptModel || 'gpt-3.5-turbo',
        font: data.font || 'Vazir',
        chatbotOn: data.chatbotOn !== undefined ? data.chatbotOn : true,
        registerOn: data.registerOn !== undefined ? data.registerOn : true
      }
    })

    return NextResponse.json(setting)

  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

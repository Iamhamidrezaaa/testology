import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // دریافت تنظیمات UI
    let uiSettings = await (prisma as any).uiSettings.findFirst()
    
    // اگر تنظیمات وجود ندارد، یک تنظیمات پیش‌فرض ایجاد کن
    if (!uiSettings) {
      uiSettings = await (prisma as any).uiSettings.create({
        data: {
          theme: 'light',
          primaryColor: '#3b82f6',
          secondaryColor: '#6366f1',
          fontFamily: 'Vazir',
          fontSize: 'medium',
          sidebarCollapsed: false,
          animationsEnabled: true,
          darkMode: false,
          rtl: true,
          language: 'fa'
        }
      })
    }

    return NextResponse.json(uiSettings)

  } catch (error) {
    console.error('Error fetching UI settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await req.json()

    // به‌روزرسانی یا ایجاد تنظیمات UI
    const uiSettings = await (prisma as any).uiSettings.upsert({
      where: { id: data.id || 'singleton-ui-settings' },
      update: {
        theme: data.theme,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        sidebarCollapsed: data.sidebarCollapsed,
        animationsEnabled: data.animationsEnabled,
        darkMode: data.darkMode,
        rtl: data.rtl,
        language: data.language,
        updatedAt: new Date()
      },
      create: {
        id: 'singleton-ui-settings',
        theme: data.theme || 'light',
        primaryColor: data.primaryColor || '#3b82f6',
        secondaryColor: data.secondaryColor || '#6366f1',
        fontFamily: data.fontFamily || 'Vazir',
        fontSize: data.fontSize || 'medium',
        sidebarCollapsed: data.sidebarCollapsed !== undefined ? data.sidebarCollapsed : false,
        animationsEnabled: data.animationsEnabled !== undefined ? data.animationsEnabled : true,
        darkMode: data.darkMode !== undefined ? data.darkMode : false,
        rtl: data.rtl !== undefined ? data.rtl : true,
        language: data.language || 'fa'
      }
    })

    return NextResponse.json(uiSettings)

  } catch (error) {
    console.error('Error updating UI settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















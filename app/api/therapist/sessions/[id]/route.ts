import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { date, duration, note, status, meetingLink } = await req.json()

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    // بررسی اینکه جلسه وجود دارد
    const existingSession = await prisma.therapySession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // به‌روزرسانی جلسه - فقط messages را می‌توانیم به‌روزرسانی کنیم
    const updatedSession = await prisma.therapySession.update({
      where: { id },
      data: {
        messages: note ? JSON.stringify([...JSON.parse(existingSession.messages || '[]'), { role: 'therapist', content: note, timestamp: new Date() }]) : existingSession.messages
      }
    })

    // دریافت اطلاعات کاربر
    const user = await prisma.user.findUnique({
      where: { id: existingSession.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    })

    // ایجاد نوتیفیکیشن
    if (note) {
      await prisma.notification.create({
        data: {
          userId: existingSession.userId,
          title: '📅 به‌روزرسانی جلسه',
          message: 'درمانگر شما یادداشتی به جلسه اضافه کرد.',
          type: 'info',
          priority: 'normal',
          actionUrl: '/therapist/sessions'
        }
      })
    }

    return NextResponse.json({
      success: true,
      session: { ...updatedSession, user }
    })

  } catch (error) {
    console.error('Error updating therapist session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    // بررسی اینکه جلسه وجود دارد
    const existingSession = await prisma.therapySession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // حذف جلسه
    await prisma.therapySession.delete({
      where: { id }
    })

    // ایجاد نوتیفیکیشن برای کاربر
    await prisma.notification.create({
      data: {
        userId: existingSession.userId,
        title: '📅 جلسه لغو شد',
        message: 'جلسه شما لغو شده است. لطفاً برای برنامه‌ریزی مجدد با درمانگر تماس بگیرید.',
        type: 'warning',
        priority: 'high',
        actionUrl: '/contact'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting therapist session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















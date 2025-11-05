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

    // بررسی اینکه جلسه متعلق به این درمانگر است
    const existingSession = await prisma.therapistSession.findFirst({
      where: {
        id,
        therapistId: therapist.id
      }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found or not authorized' }, { status: 404 })
    }

    // به‌روزرسانی جلسه
    const updatedSession = await prisma.therapistSession.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(duration && { duration }),
        ...(note !== undefined && { note }),
        ...(status && { status }),
        ...(meetingLink !== undefined && { meetingLink })
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // ایجاد نوتیفیکیشن در صورت تغییر وضعیت
    if (status && status !== existingSession.status) {
      let notificationMessage = ''
      switch (status) {
        case 'completed':
          notificationMessage = 'جلسه شما تکمیل شد. از همکاری شما متشکریم!'
          break
        case 'cancelled':
          notificationMessage = 'جلسه شما لغو شد. لطفاً برای برنامه‌ریزی مجدد با درمانگر تماس بگیرید.'
          break
        case 'rescheduled':
          notificationMessage = 'جلسه شما مجدداً برنامه‌ریزی شد.'
          break
      }

      if (notificationMessage) {
        await prisma.smartNotification.create({
          data: {
            userId: existingSession.patientId,
            title: '📅 به‌روزرسانی جلسه',
            message: notificationMessage,
            type: 'info',
            priority: 'normal',
            actionUrl: '/therapist/sessions'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      session: updatedSession
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

    // بررسی اینکه جلسه متعلق به این درمانگر است
    const existingSession = await prisma.therapistSession.findFirst({
      where: {
        id,
        therapistId: therapist.id
      }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found or not authorized' }, { status: 404 })
    }

    // حذف جلسه
    await prisma.therapistSession.delete({
      where: { id }
    })

    // ایجاد نوتیفیکیشن برای بیمار
    await prisma.smartNotification.create({
      data: {
        userId: existingSession.patientId,
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

















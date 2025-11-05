import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, contentId, title, description, note } = await req.json()

    if (!userId || !contentId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date()
    const week = getWeekNumber(today)
    const year = today.getFullYear()

    // بررسی اینکه آیا تمرین هفتگی برای این کاربر و هفته وجود دارد
    const existingAssignment = await prisma.weeklyAssignment.findFirst({
      where: {
        userId,
        week,
        year,
        contentId
      }
    })

    if (existingAssignment) {
      return NextResponse.json({ error: 'Assignment already exists for this week' }, { status: 400 })
    }

    // ایجاد تمرین هفتگی جدید
    const assignment = await prisma.weeklyAssignment.create({
      data: {
        userId,
        contentId,
        title,
        description: description || '',
        note,
        week,
        year,
        status: 'assigned'
      }
    })

    // ایجاد نوتیفیکیشن برای کاربر
    await prisma.smartNotification.create({
      data: {
        userId,
        title: '📦 تمرین هفتگی جدید',
        message: `تمرین هفتگی جدیدی برای شما اختصاص داده شده است: ${title}`,
        type: 'info',
        priority: 'normal',
        actionUrl: '/profile/assignments'
      }
    })

    return NextResponse.json({
      success: true,
      assignment
    })

  } catch (error) {
    console.error('Error creating weekly assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















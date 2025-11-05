import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mood, note } = await req.json()

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // بررسی وجود ورودی امروز
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    let moodEntry

    if (existingEntry) {
      // به‌روزرسانی ورودی موجود
      moodEntry = await prisma.moodEntry.update({
        where: { id: existingEntry.id },
        data: {
          mood,
          note: note || null
        }
      })
    } else {
      // ایجاد ورودی جدید
      moodEntry = await prisma.moodEntry.create({
        data: {
          userId: session.user.id,
          mood,
          note: note || null,
          date: today
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      moodEntry: {
        id: moodEntry.id,
        mood: moodEntry.mood,
        note: moodEntry.note,
        date: moodEntry.date
      }
    })

  } catch (error) {
    console.error('Error submitting mood:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















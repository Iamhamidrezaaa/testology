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

    const {
      mood,
      sleepHour,
      energy,
      stress,
      note,
      activities,
      weather,
      social,
      exercise,
      meditation
    } = await req.json()

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 })
    }

    // تنظیم تاریخ امروز
    const today = new Date()
    today.setHours(0, 0, 0, 0) // شروع روز

    // پارس کردن فعالیت‌ها
    let parsedActivities = []
    if (activities) {
      try {
        parsedActivities = typeof activities === 'string' 
          ? JSON.parse(activities) 
          : activities
      } catch {
        parsedActivities = typeof activities === 'string' 
          ? activities.split(',').map(activity => activity.trim())
          : activities
      }
    }

    // ثبت یا به‌روزرسانی mood روزانه
    const moodEntry = await prisma.moodLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today
        }
      },
      update: {
        mood,
        sleepHour: sleepHour || null,
        energy: energy || null,
        stress: stress || null,
        note: note || null,
        activities: parsedActivities,
        weather: weather || null,
        social: social || null,
        exercise: exercise || false,
        meditation: meditation || false
      },
      create: {
        userId: session.user.id,
        date: today,
        mood,
        sleepHour: sleepHour || null,
        energy: energy || null,
        stress: stress || null,
        note: note || null,
        activities: parsedActivities,
        weather: weather || null,
        social: social || null,
        exercise: exercise || false,
        meditation: meditation || false
      }
    })

    // اهدای XP برای ثبت mood
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (userProgress) {
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          xp: { increment: 5 }, // 5 XP برای ثبت mood روزانه
          lastActivity: new Date()
        }
      })
    }

    // ایجاد نوتیفیکیشن
    await prisma.smartNotification.create({
      data: {
        userId: session.user.id,
        title: '📅 ثبت احساس روزانه',
        message: `احساس امروز شما (${mood}) با موفقیت ثبت شد.`,
        type: 'achievement',
        priority: 'normal',
        actionUrl: '/profile/mood-calendar'
      }
    })

    return NextResponse.json({
      success: true,
      moodEntry: {
        id: moodEntry.id,
        date: moodEntry.date,
        mood: moodEntry.mood,
        sleepHour: moodEntry.sleepHour,
        energy: moodEntry.energy,
        stress: moodEntry.stress,
        note: moodEntry.note,
        activities: moodEntry.activities,
        weather: moodEntry.weather,
        social: moodEntry.social,
        exercise: moodEntry.exercise,
        meditation: moodEntry.meditation
      }
    })

  } catch (error) {
    console.error('Error adding mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















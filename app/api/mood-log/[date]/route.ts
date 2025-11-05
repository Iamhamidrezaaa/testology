import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date } = params
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    const moodLog = await prisma.moodLog.findFirst({
      where: {
        userId: session.user.id,
        date: targetDate
      }
    })

    if (!moodLog) {
      return NextResponse.json({ error: 'Mood log not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      moodLog
    })

  } catch (error) {
    console.error('Error fetching mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date } = params
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

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

    const updatedMoodLog = await prisma.moodLog.update({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate
        }
      },
      data: {
        mood: mood || undefined,
        sleepHour: sleepHour || undefined,
        energy: energy || undefined,
        stress: stress || undefined,
        note: note || undefined,
        activities: parsedActivities.length > 0 ? parsedActivities : undefined,
        weather: weather || undefined,
        social: social || undefined,
        exercise: exercise !== undefined ? exercise : undefined,
        meditation: meditation !== undefined ? meditation : undefined
      }
    })

    return NextResponse.json({
      success: true,
      moodLog: updatedMoodLog
    })

  } catch (error) {
    console.error('Error updating mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date } = params
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    await prisma.moodLog.delete({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mood log deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















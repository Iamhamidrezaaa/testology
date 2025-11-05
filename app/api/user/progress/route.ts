import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت پیشرفت کاربر
    const progress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    if (!progress) {
      // اگر پیشرفتی وجود ندارد، ایجاد کن
      const newProgress = await prisma.userProgress.create({
        data: {
          userId,
          xp: 0,
          level: 1,
          totalTests: 0,
          achievements: ['شروع کنید! 🚀'],
          streakDays: 0
        }
      })
      
      return NextResponse.json({
        progress: {
          id: newProgress.id,
          xp: newProgress.xp,
          level: newProgress.level,
          totalTests: newProgress.totalTests,
          achievements: newProgress.achievements,
          streakDays: newProgress.streakDays,
          lastActivity: newProgress.lastActivity
        }
      })
    }

    // محاسبه پیشرفت به سطح بعدی
    const currentLevelXP = (progress.level - 1) * 100
    const nextLevelXP = progress.level * 100
    const progressToNext = progress.xp - currentLevelXP
    const xpNeeded = nextLevelXP - currentLevelXP
    const progressPercentage = Math.round((progressToNext / xpNeeded) * 100)

    return NextResponse.json({
      progress: {
        id: progress.id,
        xp: progress.xp,
        level: progress.level,
        totalTests: progress.totalTests,
        achievements: progress.achievements,
        streakDays: progress.streakDays,
        lastActivity: progress.lastActivity,
        progressToNext,
        xpNeeded,
        progressPercentage
      }
    })

  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
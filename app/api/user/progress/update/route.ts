import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت پیشرفت فعلی کاربر
    const currentProgress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    // محاسبه XP جدید (مثال: +20 برای هر تست)
    const xpGain = 20
    const newXP = (currentProgress?.xp || 0) + xpGain
    
    // محاسبه سطح جدید
    const newLevel = Math.floor(newXP / 100) + 1
    
    // بررسی دستاوردهای جدید
    const newAchievements = []
    const currentAchievements = currentProgress?.achievements as string[] || []
    
    // دستاورد تست اول
    if (!currentAchievements.includes('تست اول انجام شد! 🎯') && (currentProgress?.totalTests || 0) === 0) {
      newAchievements.push('تست اول انجام شد! 🎯')
    }
    
    // دستاورد سطح ۵
    if (newLevel >= 5 && !currentAchievements.includes('رسیدن به سطح ۵! ⭐')) {
      newAchievements.push('رسیدن به سطح ۵! ⭐')
    }
    
    // دستاورد سطح ۱۰
    if (newLevel >= 10 && !currentAchievements.includes('رسیدن به سطح ۱۰! 🏆')) {
      newAchievements.push('رسیدن به سطح ۱۰! 🏆')
    }
    
    // دستاورد ۱۰ تست
    const newTotalTests = (currentProgress?.totalTests || 0) + 1
    if (newTotalTests >= 10 && !currentAchievements.includes('۱۰ تست انجام دادید! 🎉')) {
      newAchievements.push('۱۰ تست انجام دادید! 🎉')
    }

    // به‌روزرسانی یا ایجاد پیشرفت
    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        xp: newXP,
        level: newLevel,
        totalTests: { increment: 1 },
        achievements: {
          push: newAchievements
        },
        lastActivity: new Date()
      },
      create: {
        userId,
        xp: xpGain,
        level: 1,
        totalTests: 1,
        achievements: newAchievements.length > 0 ? newAchievements : ['شروع خوب! 👏'],
        lastActivity: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        xp: progress.xp,
        level: progress.level,
        totalTests: progress.totalTests,
        achievements: progress.achievements,
        streakDays: progress.streakDays,
        newAchievements
      }
    })

  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















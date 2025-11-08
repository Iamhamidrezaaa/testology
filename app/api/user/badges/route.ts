import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { BADGE_DEFINITIONS, checkBadgeConditions } from '@/lib/services/badges'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // UserProfile model doesn't exist in schema - using UserProgress instead
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    });

    const mockUserProfile = {
      id: session.user.id,
      userId: session.user.id,
      xp: userProgress?.xp || 0,
      level: userProgress?.level || 1,
      badges: []
    };

    // دریافت آمار کاربر
    const testResults = await prisma.testResult.findMany({
      where: { userId: session.user.id },
      select: {
        testId: true,
        testName: true,
        createdAt: true
      }
    })

    const userStats = {
      totalTests: testResults.length,
      differentTestTypes: new Set(testResults.map(t => t.testId || t.testName)).size,
      analysesRead: 0, // TODO: پیاده‌سازی شمارش تحلیل‌ها
      totalXP: mockUserProfile.xp,
      level: mockUserProfile.level,
      streakDays: 0, // TODO: پیاده‌سازی محاسبه streak
      profileCompleted: false, // UserProfile doesn't exist
      firstTestDate: testResults.length > 0 ? testResults[testResults.length - 1].createdAt : undefined
    }

    // بررسی دستاوردهای جدید
    const earnedConditions = checkBadgeConditions(userStats)
    const currentBadgeConditions: string[] = []
    const newBadges = earnedConditions.filter(condition => !currentBadgeConditions.includes(condition))

    // ایجاد دستاوردهای جدید
    for (const condition of newBadges) {
      const badgeDef = BADGE_DEFINITIONS.find(b => b.condition === condition)
      if (badgeDef) {
        // Badge and UserBadge models don't exist in schema
        // Update UserProgress instead
        if (userProgress) {
          await prisma.userProgress.update({
            where: { userId: session.user.id },
            data: {
              xp: { increment: badgeDef.xpReward }
            }
          })
        }
      }
    }

    // Badge and UserBadge models don't exist in schema
    const finalBadges: any[] = [];

    return NextResponse.json({
      badges: finalBadges,
      newBadges: newBadges.length,
      totalXP: mockUserProfile.xp + (newBadges.length * 50) // تخمین XP جدید
    })

  } catch (error) {
    console.error('Error fetching user badges:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















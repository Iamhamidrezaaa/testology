import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BADGE_DEFINITIONS, checkBadgeConditions } from '@/lib/services/badges'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت پروفایل کاربر
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        badges: {
          include: {
            badge: true
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // دریافت آمار کاربر
    const testResults = await prisma.testResult.findMany({
      where: { userId: session.user.id, completed: true },
      select: {
        testSlug: true,
        createdAt: true
      }
    })

    const userStats = {
      totalTests: testResults.length,
      differentTestTypes: new Set(testResults.map(t => t.testSlug)).size,
      analysesRead: 0, // TODO: پیاده‌سازی شمارش تحلیل‌ها
      totalXP: userProfile.xp,
      level: userProfile.level,
      streakDays: 0, // TODO: پیاده‌سازی محاسبه streak
      profileCompleted: !!(userProfile.bio && userProfile.fullName),
      firstTestDate: testResults.length > 0 ? testResults[testResults.length - 1].createdAt : undefined
    }

    // بررسی دستاوردهای جدید
    const earnedConditions = checkBadgeConditions(userStats)
    const currentBadgeConditions = userProfile.badges.map(ub => ub.badge.condition)
    const newBadges = earnedConditions.filter(condition => !currentBadgeConditions.includes(condition))

    // ایجاد دستاوردهای جدید
    for (const condition of newBadges) {
      const badgeDef = BADGE_DEFINITIONS.find(b => b.condition === condition)
      if (badgeDef) {
        // بررسی وجود badge در دیتابیس
        let badge = await prisma.badge.findFirst({
          where: { condition }
        })

        if (!badge) {
          // ایجاد badge جدید
          badge = await prisma.badge.create({
            data: {
              name: badgeDef.name,
              description: badgeDef.description,
              icon: badgeDef.icon,
              condition: badgeDef.condition,
              xpReward: badgeDef.xpReward,
              rarity: badgeDef.rarity
            }
          })
        }

        // اتصال badge به کاربر
        await prisma.userBadge.create({
          data: {
            userId: userProfile.id,
            badgeId: badge.id
          }
        })

        // اضافه کردن XP
        await prisma.userProfile.update({
          where: { id: userProfile.id },
          data: {
            xp: { increment: badgeDef.xpReward },
            totalPoints: { increment: badgeDef.xpReward }
          }
        })
      }
    }

    // دریافت دستاوردهای نهایی
    const finalBadges = await prisma.userBadge.findMany({
      where: { userId: userProfile.id },
      include: {
        badge: true
      },
      orderBy: { earnedAt: 'desc' }
    })

    return NextResponse.json({
      badges: finalBadges.map(ub => ({
        id: ub.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        earnedAt: ub.earnedAt
      })),
      newBadges: newBadges.length,
      totalXP: userProfile.xp + (newBadges.length * 50) // تخمین XP جدید
    })

  } catch (error) {
    console.error('Error fetching user badges:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















import { prisma } from '@/lib/prisma'
import { calculateXPReward } from './level'
import { checkBadgeConditions } from './badges'

export async function awardXP(userId: string, activity: string, additionalData?: any): Promise<{
  xpGained: number
  newLevel: number
  levelUp: boolean
  badgesEarned: string[]
}> {
  const xpReward = calculateXPReward(activity)
  
  // دریافت پروفایل کاربر
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      badges: {
        include: {
          badge: true
        }
      }
    }
  })

  if (!userProfile) {
    throw new Error('User profile not found')
  }

  const oldLevel = userProfile.level
  const newXP = userProfile.xp + xpReward
  const newTotalPoints = userProfile.totalPoints + xpReward

  // محاسبه سطح جدید
  let newLevel = oldLevel
  let levelUp = false
  
  // محاسبه سطح بر اساس XP جدید
  let currentXP = newXP
  let nextXP = 100
  let level = 1
  
  while (currentXP >= nextXP) {
    level++
    currentXP -= nextXP
    nextXP = Math.floor(nextXP * 1.2)
  }
  
  newLevel = level
  levelUp = newLevel > oldLevel

  // دریافت آمار کاربر برای بررسی دستاوردها
  const testResults = await prisma.testResult.findMany({
    where: { userId, completed: true },
    select: {
      testSlug: true,
      createdAt: true
    }
  })

  const userStats = {
    totalTests: testResults.length,
    differentTestTypes: new Set(testResults.map(t => t.testSlug)).size,
    analysesRead: 0, // TODO: پیاده‌سازی
    totalXP: newXP,
    level: newLevel,
    streakDays: 0, // TODO: پیاده‌سازی
    profileCompleted: !!(userProfile.bio && userProfile.fullName),
    firstTestDate: testResults.length > 0 ? testResults[testResults.length - 1].createdAt : undefined
  }

  // بررسی دستاوردهای جدید
  const earnedConditions = checkBadgeConditions(userStats)
  const currentBadgeConditions = userProfile.badges.map(ub => ub.badge.condition)
  const newBadges = earnedConditions.filter(condition => !currentBadgeConditions.includes(condition))

  // به‌روزرسانی پروفایل کاربر
  await prisma.userProfile.update({
    where: { id: userProfile.id },
    data: {
      xp: newXP,
      level: newLevel,
      totalPoints: newTotalPoints
    }
  })

  return {
    xpGained: xpReward,
    newLevel,
    levelUp,
    badgesEarned: newBadges
  }
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      badges: {
        include: {
          badge: true
        }
      }
    }
  })

  if (!userProfile) {
    return []
  }

  const testResults = await prisma.testResult.findMany({
    where: { userId, completed: true },
    select: {
      testSlug: true,
      createdAt: true
    }
  })

  const userStats = {
    totalTests: testResults.length,
    differentTestTypes: new Set(testResults.map(t => t.testSlug)).size,
    analysesRead: 0,
    totalXP: userProfile.xp,
    level: userProfile.level,
    streakDays: 0,
    profileCompleted: !!(userProfile.bio && userProfile.fullName),
    firstTestDate: testResults.length > 0 ? testResults[testResults.length - 1].createdAt : undefined
  }

  const earnedConditions = checkBadgeConditions(userStats)
  const currentBadgeConditions = userProfile.badges.map(ub => ub.badge.condition)
  const newBadges = earnedConditions.filter(condition => !currentBadgeConditions.includes(condition))

  return newBadges
}

export async function getGamificationStats(userId: string) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      badges: {
        include: {
          badge: true
        }
      }
    }
  })

  if (!userProfile) {
    return null
  }

  const testResults = await prisma.testResult.findMany({
    where: { userId, completed: true }
  })

  return {
    level: userProfile.level,
    xp: userProfile.xp,
    totalPoints: userProfile.totalPoints,
    badges: userProfile.badges.length,
    totalTests: testResults.length,
    recentBadges: userProfile.badges
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      .slice(0, 5)
      .map(ub => ({
        name: ub.badge.name,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        earnedAt: ub.earnedAt
      }))
  }
}

















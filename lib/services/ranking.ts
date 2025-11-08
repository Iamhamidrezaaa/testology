import { prisma } from '@/lib/prisma'

export interface UserRanking {
  id: string
  username: string
  fullName: string
  totalPoints: number
  rank: number
  level: string
  badge: string
  testCount: number
  averageScore: number
}

export interface RankingLevel {
  name: string
  minPoints: number
  maxPoints: number
  badge: string
  color: string
}

export const RANKING_LEVELS: RankingLevel[] = [
  { name: 'تازه‌کار', minPoints: 0, maxPoints: 100, badge: '🌱', color: 'text-green-500' },
  { name: 'مبتدی', minPoints: 101, maxPoints: 300, badge: '🌿', color: 'text-green-600' },
  { name: 'متوسط', minPoints: 301, maxPoints: 600, badge: '🌳', color: 'text-blue-500' },
  { name: 'پیشرفته', minPoints: 601, maxPoints: 1000, badge: '🏆', color: 'text-purple-500' },
  { name: 'استاد', minPoints: 1001, maxPoints: 2000, badge: '👑', color: 'text-yellow-500' },
  { name: 'افسانه', minPoints: 2001, maxPoints: Infinity, badge: '⭐', color: 'text-red-500' }
]

export function calculateUserLevel(points: number): RankingLevel {
  return RANKING_LEVELS.find(level => 
    points >= level.minPoints && points <= level.maxPoints
  ) || RANKING_LEVELS[0]
}

export function calculatePoints(testResult: any): number {
  let points = 0
  
  // امتیاز پایه برای تکمیل تست
  points += 10
  
  // امتیاز بر اساس نمره
  if (testResult.score && testResult.totalScore) {
    const percentage = (testResult.score / testResult.totalScore) * 100
    points += Math.round(percentage / 10) // 0-10 امتیاز اضافی
  }
  
  // امتیاز بر اساس نوع تست
  switch (testResult.testSlug) {
    case 'rosenberg':
      points += 5 // تست عزت نفس
      break
    case 'beck-depression':
      points += 8 // تست افسردگی
      break
    case 'anxiety':
      points += 6 // تست اضطراب
      break
    case 'big-five':
      points += 15 // تست شخصیت
      break
    default:
      points += 3
  }
  
  return points
}

export async function updateUserRanking(userId: string): Promise<void> {
  try {
    // دریافت تمام تست‌های کاربر
    const testResults = await prisma.testResult.findMany({
      where: {
        userId,
        completed: true
      }
    })

    // محاسبه امتیاز کل
    const totalPoints = testResults.reduce((sum, test) => {
      return sum + calculatePoints(test)
    }, 0)

    // محاسبه میانگین نمره
    const averageScore = testResults.length > 0
      ? testResults.reduce((sum, test) => sum + (test.score || 0), 0) / testResults.length
      : 0

    // به‌روزرسانی پروفایل کاربر
    // مدل userProfile در schema وجود ندارد
    // این بخش غیرفعال است تا زمانی که مدل به schema اضافه شود

  } catch (error) {
    console.error('Error updating user ranking:', error)
    throw error
  }
}

export async function getTopUsers(limit: number = 50): Promise<UserRanking[]> {
  try {
    // مدل userProfile در schema وجود ندارد
    const users: any[] = []

    return users.map((user, index) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.user.name || 'کاربر',
      totalPoints: user.totalPoints,
      rank: index + 1,
      level: calculateUserLevel(user.totalPoints).name,
      badge: calculateUserLevel(user.totalPoints).badge,
      testCount: 0, // این فیلد باید جداگانه محاسبه شود
      averageScore: 0 // این فیلد باید جداگانه محاسبه شود
    }))

  } catch (error) {
    console.error('Error fetching top users:', error)
    throw error
  }
}

















export interface BadgeDefinition {
  name: string
  description: string
  icon: string
  condition: string
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    name: "روان‌جو تازه‌کار",
    description: "اولین تست روان‌شناسی خود را تکمیل کردید",
    icon: "🥉",
    condition: "first_test_completed",
    xpReward: 50,
    rarity: "common"
  },
  {
    name: "فعال روزانه",
    description: "۳ روز متوالی تست انجام دادید",
    icon: "📆",
    condition: "three_day_streak",
    xpReward: 100,
    rarity: "common"
  },
  {
    name: "مشتاق شناخت",
    description: "۵ تست متفاوت انجام دادید",
    icon: "📊",
    condition: "five_different_tests",
    xpReward: 150,
    rarity: "rare"
  },
  {
    name: "دانش‌آموز ساعی",
    description: "۱۰ تحلیل روان‌شناسی مطالعه کردید",
    icon: "🔍",
    condition: "ten_analyses_read",
    xpReward: 200,
    rarity: "rare"
  },
  {
    name: "کاوشگر حرفه‌ای",
    description: "۲۰۰ XP کسب کردید",
    icon: "🏅",
    condition: "two_hundred_xp",
    xpReward: 300,
    rarity: "epic"
  },
  {
    name: "استاد خودشناسی",
    description: "۱۰ تست در یک ماه انجام دادید",
    icon: "🧠",
    condition: "ten_tests_month",
    xpReward: 500,
    rarity: "epic"
  },
  {
    name: "قهرمان رشد",
    description: "به سطح ۲۰ رسیدید",
    icon: "👑",
    condition: "level_twenty",
    xpReward: 1000,
    rarity: "legendary"
  },
  {
    name: "نقشه‌بردار ذهن",
    description: "تمام انواع تست‌ها را انجام دادید",
    icon: "🗺️",
    condition: "all_test_types",
    xpReward: 800,
    rarity: "legendary"
  },
  {
    name: "همراه همیشگی",
    description: "۳۰ روز متوالی وارد سایت شدید",
    icon: "💎",
    condition: "thirty_day_streak",
    xpReward: 1200,
    rarity: "legendary"
  },
  {
    name: "معلم خود",
    description: "پروفایل خود را کامل کردید",
    icon: "📝",
    condition: "profile_completed",
    xpReward: 75,
    rarity: "common"
  }
]

export function checkBadgeConditions(userStats: {
  totalTests: number
  differentTestTypes: number
  analysesRead: number
  totalXP: number
  level: number
  streakDays: number
  profileCompleted: boolean
  firstTestDate?: Date
}): string[] {
  const earnedBadges: string[] = []

  // بررسی شرایط دستاوردها
  if (userStats.totalTests >= 1 && userStats.firstTestDate) {
    earnedBadges.push("first_test_completed")
  }

  if (userStats.streakDays >= 3) {
    earnedBadges.push("three_day_streak")
  }

  if (userStats.differentTestTypes >= 5) {
    earnedBadges.push("five_different_tests")
  }

  if (userStats.analysesRead >= 10) {
    earnedBadges.push("ten_analyses_read")
  }

  if (userStats.totalXP >= 200) {
    earnedBadges.push("two_hundred_xp")
  }

  if (userStats.totalTests >= 10) {
    earnedBadges.push("ten_tests_month")
  }

  if (userStats.level >= 20) {
    earnedBadges.push("level_twenty")
  }

  if (userStats.differentTestTypes >= 8) { // فرض: 8 نوع تست مختلف
    earnedBadges.push("all_test_types")
  }

  if (userStats.streakDays >= 30) {
    earnedBadges.push("thirty_day_streak")
  }

  if (userStats.profileCompleted) {
    earnedBadges.push("profile_completed")
  }

  return earnedBadges
}

export function getBadgeByCondition(condition: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.condition === condition)
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return 'text-purple-600 bg-purple-100'
    case 'epic': return 'text-red-600 bg-red-100'
    case 'rare': return 'text-blue-600 bg-blue-100'
    case 'common': return 'text-gray-600 bg-gray-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export function getRarityIcon(rarity: string): string {
  switch (rarity) {
    case 'legendary': return '👑'
    case 'epic': return '💎'
    case 'rare': return '⭐'
    case 'common': return '🏅'
    default: return '🏅'
  }
}

















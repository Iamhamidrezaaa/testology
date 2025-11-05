/**
 * سیستم لول‌بندی و XP برای Testology
 * این سرویس مسئول محاسبه سطح، XP و دستاوردهای کاربر است
 */

/**
 * محاسبه سطح بر اساس XP
 * فرمول: Level = floor(1 + sqrt(XP / 100))
 */
export function calculateLevel(xp: number): number {
  return Math.floor(1 + Math.sqrt(xp / 100));
}

/**
 * محاسبه XP مورد نیاز برای سطح بعدی
 */
export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel + 1, 2) * 100;
}

/**
 * محاسبه XP بر اساس امتیاز تست
 * هر امتیاز تست = 10 XP
 */
export function getXPForTest(score: number): number {
  return Math.floor(score * 10);
}

/**
 * محاسبه درصد پیشرفت تا سطح بعد
 */
export function calculateProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = Math.pow(currentLevel, 2) * 100;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));
}

/**
 * بررسی و اعطای دستاوردها
 */
export function checkAchievements(stats: {
  totalTests: number;
  xp: number;
  level: number;
  streakDays: number;
}): string[] {
  const newAchievements: string[] = [];

  // دستاورد تست‌ها
  if (stats.totalTests >= 1) newAchievements.push('first_test');
  if (stats.totalTests >= 5) newAchievements.push('test_enthusiast');
  if (stats.totalTests >= 10) newAchievements.push('test_master');
  if (stats.totalTests >= 25) newAchievements.push('psychology_expert');
  if (stats.totalTests >= 50) newAchievements.push('test_legend');

  // دستاورد سطح
  if (stats.level >= 5) newAchievements.push('level_5');
  if (stats.level >= 10) newAchievements.push('level_10');
  if (stats.level >= 20) newAchievements.push('level_20');
  if (stats.level >= 50) newAchievements.push('level_50');

  // دستاورد XP
  if (stats.xp >= 1000) newAchievements.push('xp_1k');
  if (stats.xp >= 5000) newAchievements.push('xp_5k');
  if (stats.xp >= 10000) newAchievements.push('xp_10k');

  // دستاورد تداوم
  if (stats.streakDays >= 3) newAchievements.push('streak_3');
  if (stats.streakDays >= 7) newAchievements.push('streak_week');
  if (stats.streakDays >= 30) newAchievements.push('streak_month');
  if (stats.streakDays >= 100) newAchievements.push('streak_100');

  return newAchievements;
}

/**
 * نام و توضیح دستاوردها به فارسی
 */
export const achievementDetails: Record<string, { name: string; description: string; icon: string }> = {
  first_test: {
    name: 'اولین قدم',
    description: 'اولین تست خود را تکمیل کردید!',
    icon: '🎯'
  },
  test_enthusiast: {
    name: 'علاقه‌مند تست',
    description: '5 تست تکمیل شده',
    icon: '📚'
  },
  test_master: {
    name: 'استاد تست',
    description: '10 تست تکمیل شده',
    icon: '🎓'
  },
  psychology_expert: {
    name: 'متخصص روان‌شناسی',
    description: '25 تست تکمیل شده',
    icon: '🧠'
  },
  test_legend: {
    name: 'افسانه تست',
    description: '50 تست تکمیل شده',
    icon: '👑'
  },
  level_5: {
    name: 'سطح 5',
    description: 'به سطح 5 رسیدید',
    icon: '⭐'
  },
  level_10: {
    name: 'سطح 10',
    description: 'به سطح 10 رسیدید',
    icon: '🌟'
  },
  level_20: {
    name: 'سطح 20',
    description: 'به سطح 20 رسیدید',
    icon: '💫'
  },
  level_50: {
    name: 'سطح 50',
    description: 'به سطح 50 رسیدید - افسانه‌ای!',
    icon: '✨'
  },
  xp_1k: {
    name: '1000 XP',
    description: '1000 امتیاز تجربه کسب کردید',
    icon: '💎'
  },
  xp_5k: {
    name: '5000 XP',
    description: '5000 امتیاز تجربه کسب کردید',
    icon: '💍'
  },
  xp_10k: {
    name: '10000 XP',
    description: '10000 امتیاز تجربه کسب کردید',
    icon: '👸'
  },
  streak_3: {
    name: 'تداوم 3 روزه',
    description: '3 روز متوالی فعالیت',
    icon: '🔥'
  },
  streak_week: {
    name: 'تداوم هفتگی',
    description: '7 روز متوالی فعالیت',
    icon: '🚀'
  },
  streak_month: {
    name: 'تداوم ماهانه',
    description: '30 روز متوالی فعالیت',
    icon: '🏆'
  },
  streak_100: {
    name: 'تداوم 100 روزه',
    description: '100 روز متوالی فعالیت - باورنکردنی!',
    icon: '🎖️'
  }
};

















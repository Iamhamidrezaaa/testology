export interface LevelInfo {
  level: number;
  remainingXP: number;
  nextLevelXP: number;
  totalXP: number;
  progressPercentage: number;
}

export function calculateLevelFromXP(xp: number): LevelInfo {
  let level = 1;
  let currentXP = xp;
  let nextXP = 100;
  let totalXPForLevel = 0;
  
  // محاسبه سطح بر اساس XP
  while (currentXP >= nextXP) {
    level++;
    currentXP -= nextXP;
    totalXPForLevel += nextXP;
    nextXP = Math.floor(nextXP * 1.2); // هر سطح سخت‌تر می‌شود
  }
  
  const progressPercentage = (currentXP / nextXP) * 100;
  
  return {
    level,
    remainingXP: currentXP,
    nextLevelXP: nextXP,
    totalXP: xp,
    progressPercentage: Math.round(progressPercentage)
  };
}

export function addXP(currentXP: number, gainedXP: number): number {
  return currentXP + gainedXP;
}

export function getXPForLevel(level: number): number {
  let totalXP = 0;
  let nextXP = 100;
  
  for (let i = 1; i < level; i++) {
    totalXP += nextXP;
    nextXP = Math.floor(nextXP * 1.2);
  }
  
  return totalXP;
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "استاد روان‌شناسی";
  if (level >= 40) return "کارشناس ارشد";
  if (level >= 30) return "کارشناس";
  if (level >= 20) return "دانش‌آموز پیشرفته";
  if (level >= 10) return "دانش‌آموز";
  if (level >= 5) return "مبتدی";
  return "تازه‌کار";
}

export function getLevelColor(level: number): string {
  if (level >= 50) return "text-purple-600";
  if (level >= 40) return "text-red-600";
  if (level >= 30) return "text-orange-600";
  if (level >= 20) return "text-blue-600";
  if (level >= 10) return "text-green-600";
  if (level >= 5) return "text-yellow-600";
  return "text-gray-600";
}

export function getLevelIcon(level: number): string {
  if (level >= 50) return "👑";
  if (level >= 40) return "🏆";
  if (level >= 30) return "🥇";
  if (level >= 20) return "🥈";
  if (level >= 10) return "🥉";
  if (level >= 5) return "⭐";
  return "🌱";
}

// محاسبه امتیاز بر اساس نوع فعالیت
export function calculateXPReward(activity: string): number {
  const rewards: Record<string, number> = {
    'test_completed': 20,
    'first_test': 50,
    'daily_login': 10,
    'badge_earned': 30,
    'profile_completed': 15,
    'share_result': 5,
    'comment_posted': 3,
    'like_given': 1,
    'week_streak': 100,
    'month_streak': 500
  };
  
  return rewards[activity] || 0;
}

















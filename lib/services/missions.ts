export interface DailyMission {
  title: string
  description: string
  xpReward: number
}

export const getDailyMissions = (date: string): DailyMission[] => [
  {
    title: "تکمیل یک تست",
    description: "امروز حداقل یک تست روان‌شناسی را کامل کن.",
    xpReward: 15,
  },
  {
    title: "خواندن یک تحلیل",
    description: "امروز یکی از تحلیل‌های خودت را بخوان.",
    xpReward: 10,
  },
  {
    title: "بازدید از پروفایل دیگران",
    description: "پروفایل حداقل ۱ کاربر را ببین.",
    xpReward: 5,
  },
  {
    title: "ثبت احساس روزانه",
    description: "احساس امروز خود را در تقویم ثبت کن.",
    xpReward: 8,
  },
  {
    title: "ارسال پیام",
    description: "به یکی از کاربران پیام ارسال کن.",
    xpReward: 7,
  }
]

export const getWeeklyMissions = (): DailyMission[] => [
  {
    title: "تکمیل ۳ تست",
    description: "این هفته حداقل ۳ تست مختلف انجام بده.",
    xpReward: 50,
  },
  {
    title: "فعالیت ۵ روز متوالی",
    description: "۵ روز متوالی وارد سایت شو.",
    xpReward: 75,
  },
  {
    title: "کسب ۵ دستاورد",
    description: "این هفته ۵ دستاورد جدید کسب کن.",
    xpReward: 100,
  }
]

export const getMissionProgress = (mission: any, userStats: any): number => {
  switch (mission.title) {
    case "تکمیل یک تست":
      return userStats.todayTests >= 1 ? 100 : (userStats.todayTests / 1) * 100
    
    case "خواندن یک تحلیل":
      return userStats.todayAnalyses >= 1 ? 100 : (userStats.todayAnalyses / 1) * 100
    
    case "بازدید از پروفایل دیگران":
      return userStats.todayProfileViews >= 1 ? 100 : (userStats.todayProfileViews / 1) * 100
    
    case "ثبت احساس روزانه":
      return userStats.todayMoodEntry ? 100 : 0
    
    case "ارسال پیام":
      return userStats.todayMessages >= 1 ? 100 : (userStats.todayMessages / 1) * 100
    
    case "تکمیل ۳ تست":
      return userStats.weekTests >= 3 ? 100 : (userStats.weekTests / 3) * 100
    
    case "فعالیت ۵ روز متوالی":
      return userStats.streakDays >= 5 ? 100 : (userStats.streakDays / 5) * 100
    
    case "کسب ۵ دستاورد":
      return userStats.weekBadges >= 5 ? 100 : (userStats.weekBadges / 5) * 100
    
    default:
      return 0
  }
}

export const getMissionIcon = (title: string): string => {
  if (title.includes("تست")) return "🧠"
  if (title.includes("تحلیل")) return "📊"
  if (title.includes("پروفایل")) return "👤"
  if (title.includes("احساس")) return "😊"
  if (title.includes("پیام")) return "💬"
  if (title.includes("فعالیت")) return "📅"
  if (title.includes("دستاورد")) return "🏆"
  return "🎯"
}

export const getMissionColor = (progress: number): string => {
  if (progress === 100) return "bg-green-100 text-green-800 border-green-200"
  if (progress >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200"
  return "bg-gray-100 text-gray-800 border-gray-200"
}

















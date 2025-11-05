import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // دریافت تمام کاربران با اطلاعات پروفایل
    const users = await prisma.user.findMany({
      where: {
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        birthDate: true,
        province: true,
        city: true,
        createdAt: true
      }
    })

    // محاسبه آمار سنی
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '65+': 0
    }

    users.forEach(user => {
      if (user.birthDate) {
        const birthYear = new Date(user.birthDate).getFullYear()
        const currentYear = new Date().getFullYear()
        const age = currentYear - birthYear

        if (age >= 18 && age <= 25) ageGroups['18-25']++
        else if (age >= 26 && age <= 35) ageGroups['26-35']++
        else if (age >= 36 && age <= 45) ageGroups['36-45']++
        else if (age >= 46 && age <= 55) ageGroups['46-55']++
        else if (age >= 56 && age <= 65) ageGroups['56-65']++
        else if (age > 65) ageGroups['65+']++
      }
    })

    // محاسبه آمار استان‌ها
    const provinceStats: { [key: string]: number } = {}
    users.forEach(user => {
      if (user.province) {
        provinceStats[user.province] = (provinceStats[user.province] || 0) + 1
      }
    })

    // محاسبه آمار شهرستان‌ها
    const cityStats: { [key: string]: number } = {}
    users.forEach(user => {
      if (user.city) {
        cityStats[user.city] = (cityStats[user.city] || 0) + 1
      }
    })

    // تبدیل به فرمت مناسب برای نمودار
    const ageChartData = Object.entries(ageGroups).map(([ageGroup, count]) => ({
      name: ageGroup,
      value: count,
      percentage: users.length > 0 ? Math.round((count / users.length) * 100) : 0
    }))

    const provinceChartData = Object.entries(provinceStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // 10 استان برتر
      .map(([province, count]) => ({
        name: province,
        value: count,
        percentage: users.length > 0 ? Math.round((count / users.length) * 100) : 0
      }))

    const cityChartData = Object.entries(cityStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // 10 شهرستان برتر
      .map(([city, count]) => ({
        name: city,
        value: count,
        percentage: users.length > 0 ? Math.round((count / users.length) * 100) : 0
      }))

    // آمار کلی
    const totalUsers = users.length
    const usersWithCompleteProfile = users.filter(user => 
      user.name && user.lastName && user.birthDate && user.province && user.city
    ).length

    const profileCompletionRate = totalUsers > 0 ? 
      Math.round((usersWithCompleteProfile / totalUsers) * 100) : 0

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        usersWithCompleteProfile,
        profileCompletionRate,
        ageGroups: ageChartData,
        provinces: provinceChartData,
        cities: cityChartData,
        stats: {
          totalUsers,
          completeProfiles: usersWithCompleteProfile,
          incompleteProfiles: totalUsers - usersWithCompleteProfile,
          averageAge: calculateAverageAge(users),
          mostCommonProvince: provinceChartData[0]?.name || 'نامشخص',
          mostCommonCity: cityChartData[0]?.name || 'نامشخص'
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار کاربران' },
      { status: 500 }
    )
  }
}

function calculateAverageAge(users: any[]): number {
  const usersWithAge = users.filter(user => user.birthDate)
  if (usersWithAge.length === 0) return 0

  const totalAge = usersWithAge.reduce((sum, user) => {
    const birthYear = new Date(user.birthDate).getFullYear()
    const currentYear = new Date().getFullYear()
    return sum + (currentYear - birthYear)
  }, 0)

  return Math.round(totalAge / usersWithAge.length)
}







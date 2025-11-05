import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت آمار کاربران در 12 ماه گذشته
    const users = await prisma.user.findMany({
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // محاسبه آمار ماهانه
    const monthly = Array(12).fill(0)
    const monthNames = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ]

    users.forEach(user => {
      const date = new Date(user.createdAt)
      const month = date.getMonth() // 0-11
      monthly[month] += 1
    })

    // تبدیل به فرمت مناسب برای چارت
    const chartData = monthly.map((count, index) => ({
      month: monthNames[index],
      count: count
    }))

    return NextResponse.json(chartData)

  } catch (error) {
    console.error('Error fetching monthly user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


















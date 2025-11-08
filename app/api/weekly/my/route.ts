import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت تمرین‌های هفتگی کاربر
    const assignments = await prisma.weeklyAssignment.findMany({
      where: { userId },
      orderBy: [
        { year: 'desc' },
        { week: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // گروه‌بندی تمرین‌ها بر اساس وضعیت
    const assignedAssignments = assignments.filter((a: typeof assignments[0]) => a.status === 'assigned')
    const inProgressAssignments = assignments.filter((a: typeof assignments[0]) => a.status === 'in_progress')
    const completedAssignments = assignments.filter((a: typeof assignments[0]) => a.status === 'completed')
    const skippedAssignments = assignments.filter((a: typeof assignments[0]) => a.status === 'skipped')

    // آمار کلی
    const stats = {
      total: assignments.length,
      assigned: assignedAssignments.length,
      inProgress: inProgressAssignments.length,
      completed: completedAssignments.length,
      skipped: skippedAssignments.length
    }

    // تمرین‌های هفته جاری
    const today = new Date()
    const currentWeek = getWeekNumber(today)
    const currentYear = today.getFullYear()

    const currentWeekAssignments = assignments.filter((a: typeof assignments[0]) => 
      a.week === currentWeek && a.year === currentYear
    )

    return NextResponse.json({
      assignments,
      currentWeekAssignments,
      stats,
      currentWeek,
      currentYear
    })

  } catch (error) {
    console.error('Error fetching user assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

















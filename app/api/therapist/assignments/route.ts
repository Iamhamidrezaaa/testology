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

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Access denied. Therapist role required.' }, { status: 403 })
    }

    // دریافت تمرین‌های ارسال شده توسط درمانگر
    const assignments = await prisma.therapistAssignment.findMany({
      where: { therapistId: therapist.id },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            category: true,
            difficulty: true,
            duration: true,
            imageUrl: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // آمار تمرین‌ها
    const stats = {
      total: assignments.length,
      assigned: assignments.filter(a => a.status === 'assigned').length,
      inProgress: assignments.filter(a => a.status === 'in_progress').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      skipped: assignments.filter(a => a.status === 'skipped').length,
      highPriority: assignments.filter(a => a.priority >= 4).length,
      overdue: assignments.filter(a => 
        a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'completed'
      ).length
    }

    // گروه‌بندی بر اساس وضعیت
    const groupedAssignments = {
      assigned: assignments.filter(a => a.status === 'assigned'),
      inProgress: assignments.filter(a => a.status === 'in_progress'),
      completed: assignments.filter(a => a.status === 'completed'),
      skipped: assignments.filter(a => a.status === 'skipped')
    }

    return NextResponse.json({
      assignments,
      stats,
      groupedAssignments
    })

  } catch (error) {
    console.error('Error fetching therapist assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















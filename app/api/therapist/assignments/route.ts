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
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    // دریافت محتوای هر تمرین
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const content = await prisma.marketplaceItem.findUnique({
          where: { id: assignment.contentId },
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
        })
        const user = await prisma.user.findUnique({
          where: { id: assignment.userId },
          select: {
            id: true,
            name: true,
            email: true
          }
        })
        return { ...assignment, content, user }
      })
    )

    // آمار تمرین‌ها
    const stats = {
      total: assignmentsWithDetails.length,
      assigned: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'assigned').length,
      inProgress: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'in_progress').length,
      completed: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'completed').length,
      skipped: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'skipped').length,
      highPriority: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.priority >= 4).length,
      overdue: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => 
        a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'completed'
      ).length
    }

    // گروه‌بندی بر اساس وضعیت
    const groupedAssignments = {
      assigned: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'assigned'),
      inProgress: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'in_progress'),
      completed: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'completed'),
      skipped: assignmentsWithDetails.filter((a: typeof assignmentsWithDetails[0]) => a.status === 'skipped')
    }

    return NextResponse.json({
      assignments: assignmentsWithDetails,
      stats,
      groupedAssignments
    })

  } catch (error) {
    console.error('Error fetching therapist assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}































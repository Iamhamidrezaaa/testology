import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { status } = await req.json()

    // بررسی اینکه تمرین متعلق به کاربر است
    const assignment = await prisma.therapistAssignment.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // به‌روزرسانی تمرین
    const updatedAssignment = await prisma.therapistAssignment.update({
      where: { id },
      data: {
        ...(status !== undefined && { status })
      }
    })
    
    // دریافت محتوای تمرین
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
    
    // دریافت اطلاعات درمانگر
    const therapist = await prisma.therapist.findUnique({
      where: { id: assignment.therapistId },
      select: {
        userId: true
      }
    })
    
    const therapistUser = therapist ? await prisma.user.findUnique({
      where: { id: therapist.userId },
      select: {
        id: true,
        name: true,
        email: true
      }
    }) : null

    // اهدای XP بر اساس وضعیت
    if (status === 'completed' && assignment.status !== 'completed') {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId: session.user.id }
      })

      if (userProgress) {
        await prisma.userProgress.update({
          where: { userId: session.user.id },
          data: {
            xp: { increment: 20 }, // 20 XP برای تکمیل تمرین
            lastActivity: new Date()
          }
        })
      }

      // نوتیفیکیشن تکمیل تمرین
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🎉 تمرین تکمیل شد!',
          message: `تمرین "${content?.title || 'تمرین'}" با موفقیت تکمیل شد.`,
          type: 'achievement',
          priority: 'normal',
          actionUrl: '/profile/assignments'
        }
      })

      // نوتیفیکیشن برای درمانگر
      if (therapistUser) {
        await prisma.notification.create({
          data: {
            userId: therapistUser.id,
            title: '✅ تمرین تکمیل شد',
            message: `بیمار شما تمرین "${content?.title || 'تمرین'}" را تکمیل کرد.`,
            type: 'assignment_completed',
            priority: 'normal',
            actionUrl: '/therapist/assignments'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      assignment: { ...updatedAssignment, content, therapist: therapistUser ? { user: therapistUser } : null }
    })

  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

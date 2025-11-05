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

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // بررسی اینکه تمرین متعلق به کاربر است
    const assignment = await prisma.weeklyAssignment.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // به‌روزرسانی وضعیت تمرین
    const updateData: any = { status }
    
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    const updatedAssignment = await prisma.weeklyAssignment.update({
      where: { id },
      data: updateData
    })

    // ایجاد نوتیفیکیشن در صورت تکمیل تمرین
    if (status === 'completed') {
      await prisma.smartNotification.create({
        data: {
          userId: session.user.id,
          title: '🎉 تمرین تکمیل شد!',
          message: `تبریک! تمرین "${assignment.title}" را با موفقیت تکمیل کردید.`,
          type: 'achievement',
          priority: 'normal',
          actionUrl: '/profile/assignments'
        }
      })

      // اهدای XP برای تکمیل تمرین
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId: session.user.id }
      })

      if (userProgress) {
        await prisma.userProgress.update({
          where: { userId: session.user.id },
          data: {
            xp: { increment: 25 }, // 25 XP برای تکمیل تمرین هفتگی
            totalTests: { increment: 1 }
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment
    })

  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // بررسی اینکه تمرین متعلق به کاربر است
    const assignment = await prisma.weeklyAssignment.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // حذف تمرین
    await prisma.weeklyAssignment.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















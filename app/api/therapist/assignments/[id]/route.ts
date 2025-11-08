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
    const { feedback, status } = await req.json()

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Access denied. Therapist role required.' }, { status: 403 })
    }

    // بررسی اینکه تمرین متعلق به درمانگر است
    const assignment = await prisma.therapistAssignment.findFirst({
      where: {
        id,
        therapistId: therapist.id
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

    // اگر وضعیت تغییر کرد، نوتیفیکیشن ارسال کن
    if (status && status !== assignment.status) {
      await prisma.notification.create({
        data: {
          userId: assignment.userId,
          title: '📋 به‌روزرسانی تمرین',
          message: `وضعیت تمرین "${content?.title || 'تمرین'}" به‌روزرسانی شد.`,
          type: 'assignment_update',
          priority: 'normal',
          actionUrl: '/profile/assignments'
        }
      })
    }

    return NextResponse.json({
      success: true,
      assignment: { ...updatedAssignment, content }
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

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Access denied. Therapist role required.' }, { status: 403 })
    }

    // بررسی اینکه تمرین متعلق به درمانگر است
    const assignment = await prisma.therapistAssignment.findFirst({
      where: {
        id,
        therapistId: therapist.id
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // حذف تمرین
    await prisma.therapistAssignment.delete({
      where: { id }
    })

    // نوتیفیکیشن حذف تمرین
    await prisma.notification.create({
      data: {
        userId: assignment.userId,
        title: '🗑️ تمرین حذف شد',
        message: 'یکی از تمرین‌های شما توسط درمانگر حذف شد.',
        type: 'assignment_deleted',
        priority: 'normal',
        actionUrl: '/profile/assignments'
      }
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

















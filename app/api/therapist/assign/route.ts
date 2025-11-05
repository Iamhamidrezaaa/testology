import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
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

    const {
      userId,
      contentId,
      message,
      priority,
      dueDate
    } = await req.json()

    if (!userId || !contentId) {
      return NextResponse.json({ error: 'userId and contentId are required' }, { status: 400 })
    }

    // بررسی اینکه کاربر در لیست بیماران درمانگر است
    const patient = await prisma.patient.findFirst({
      where: {
        userId,
        therapistId: therapist.id
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'User is not in your patient list' }, { status: 403 })
    }

    // بررسی اینکه محتوا وجود دارد
    const content = await prisma.marketplaceItem.findUnique({
      where: { id: contentId }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // ایجاد تمرین جدید
    const assignment = await prisma.therapistAssignment.create({
      data: {
        therapistId: therapist.id,
        userId,
        contentId,
        message: message || null,
        priority: priority || 3,
        dueDate: dueDate ? new Date(dueDate) : null
      },
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
      }
    })

    // ایجاد نوتیفیکیشن برای کاربر
    await prisma.smartNotification.create({
      data: {
        userId,
        title: '📋 تمرین جدید از درمانگر',
        message: `درمانگر شما تمرین جدید "${content.title}" را برای شما ارسال کرده است.`,
        type: 'assignment',
        priority: priority >= 4 ? 'high' : 'normal',
        actionUrl: '/profile/assignments'
      }
    })

    // اهدای XP به درمانگر برای ارسال تمرین
    const therapistProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (therapistProgress) {
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          xp: { increment: 5 }, // 5 XP برای ارسال تمرین
          lastActivity: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      assignment: {
        id: assignment.id,
        content: assignment.content,
        user: assignment.user,
        message: assignment.message,
        priority: assignment.priority,
        dueDate: assignment.dueDate,
        status: assignment.status,
        createdAt: assignment.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating therapist assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
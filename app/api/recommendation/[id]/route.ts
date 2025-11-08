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
    const { isViewed, isAccepted, feedback } = await req.json()

    // بررسی اینکه پیشنهاد متعلق به کاربر است
    const suggestion = await prisma.suggestedContent.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
    }

    // به‌روزرسانی پیشنهاد
    const updatedSuggestion = await prisma.suggestedContent.update({
      where: { id },
      data: {
        ...(isViewed !== undefined && { isViewed }),
        ...(isAccepted !== undefined && { isAccepted }),
        ...(feedback !== undefined && { feedback })
      }
    })

    // اگر کاربر پیشنهاد را پذیرفت، XP اهدا کن
    if (isAccepted && !suggestion.isAccepted) {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId: session.user.id }
      })

      if (userProgress) {
        await prisma.userProgress.update({
          where: { userId: session.user.id },
          data: {
            xp: { increment: 15 }, // 15 XP برای پذیرش پیشنهاد
            lastActivity: new Date()
          }
        })
      }

      // دریافت محتوای پیشنهاد
      const content = await prisma.marketplaceItem.findUnique({
        where: { id: suggestion.contentId },
        select: { title: true }
      })

      // ایجاد نوتیفیکیشن
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🎉 پیشنهاد پذیرفته شد!',
          message: `شما پیشنهاد "${content?.title || 'محتوای پیشنهادی'}" را پذیرفتید.`,
          type: 'achievement',
          priority: 'normal',
          actionUrl: '/profile/recommendations'
        }
      })
    }

    return NextResponse.json({
      success: true,
      suggestion: updatedSuggestion
    })

  } catch (error) {
    console.error('Error updating suggestion:', error)
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

    // بررسی اینکه پیشنهاد متعلق به کاربر است
    const suggestion = await prisma.suggestedContent.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!suggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
    }

    // حذف پیشنهاد
    await prisma.suggestedContent.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Suggestion deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting suggestion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

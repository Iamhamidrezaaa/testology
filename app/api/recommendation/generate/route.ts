import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { analyzeUserHistory } from '@/lib/gpt/recommendations'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // بررسی اینکه آیا کاربر قبلاً پیشنهادات دریافت کرده یا نه
    const existingSuggestions = await prisma.suggestedContent.findMany({
      where: { 
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 روز گذشته
        }
      }
    })

    // اگر در 7 روز گذشته پیشنهادی دریافت کرده، پیشنهاد جدید نده
    if (existingSuggestions.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'شما اخیراً پیشنهادات جدیدی دریافت کرده‌اید',
        existingSuggestions: existingSuggestions.length
      })
    }

    // تولید پیشنهاد جدید
    const recommendation = await analyzeUserHistory(userId)

    // بررسی اینکه محتوای پیشنهادی وجود دارد یا نه
    const content = await prisma.marketplaceItem.findUnique({
      where: { id: recommendation.contentId }
    })

    if (!content) {
      return NextResponse.json({ 
        error: 'محتوای پیشنهادی یافت نشد' 
      }, { status: 404 })
    }

    // ذخیره پیشنهاد در دیتابیس
    const savedSuggestion = await prisma.suggestedContent.create({
      data: {
        userId,
        contentId: recommendation.contentId,
        reason: recommendation.reason,
        priority: recommendation.priority,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 روز
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
        }
      }
    })

    // ایجاد نوتیفیکیشن
    await prisma.smartNotification.create({
      data: {
        userId,
        title: '🎯 پیشنهاد جدید برای شما',
        message: `تمرین جدید "${content.title}" بر اساس وضعیت شما پیشنهاد شده است.`,
        type: 'recommendation',
        priority: recommendation.priority >= 4 ? 'high' : 'normal',
        actionUrl: '/profile/recommendations'
      }
    })

    // اهدای XP برای دریافت پیشنهاد
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    if (userProgress) {
      await prisma.userProgress.update({
        where: { userId },
        data: {
          xp: { increment: 10 }, // 10 XP برای دریافت پیشنهاد
          lastActivity: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      suggestion: savedSuggestion,
      content: savedSuggestion.content
    })

  } catch (error) {
    console.error('Error generating recommendation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















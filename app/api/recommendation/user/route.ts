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

    // دریافت پیشنهادات کاربر
    const suggestions = await prisma.suggestedContent.findMany({
      where: { 
        userId,
        expiresAt: {
          gte: new Date() // فقط پیشنهادات منقضی نشده
        }
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
            imageUrl: true,
            price: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // آمار پیشنهادات
    const stats = {
      total: suggestions.length,
      viewed: suggestions.filter(s => s.isViewed).length,
      accepted: suggestions.filter(s => s.isAccepted).length,
      pending: suggestions.filter(s => !s.isViewed && !s.isAccepted).length,
      highPriority: suggestions.filter(s => s.priority >= 4).length
    }

    // گروه‌بندی بر اساس اولویت
    const groupedSuggestions = {
      high: suggestions.filter(s => s.priority >= 4),
      medium: suggestions.filter(s => s.priority === 3),
      low: suggestions.filter(s => s.priority <= 2)
    }

    return NextResponse.json({
      suggestions,
      stats,
      groupedSuggestions
    })

  } catch (error) {
    console.error('Error fetching user recommendations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















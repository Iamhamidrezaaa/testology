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
        OR: [
          { expiresAt: { gte: new Date() } },
          { expiresAt: null }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    // دریافت محتوای هر پیشنهاد
    const suggestionsWithContent = await Promise.all(
      suggestions.map(async (suggestion) => {
        const content = await prisma.marketplaceItem.findUnique({
          where: { id: suggestion.contentId },
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
        })
        return { ...suggestion, content }
      })
    )

    // آمار پیشنهادات
    const stats = {
      total: suggestionsWithContent.length,
      viewed: suggestionsWithContent.filter(s => s.isViewed).length,
      accepted: suggestionsWithContent.filter(s => s.isAccepted).length,
      pending: suggestionsWithContent.filter(s => !s.isViewed && !s.isAccepted).length,
      highPriority: suggestionsWithContent.filter(s => s.priority >= 4).length
    }

    // گروه‌بندی بر اساس اولویت
    const groupedSuggestions = {
      high: suggestionsWithContent.filter(s => s.priority >= 4),
      medium: suggestionsWithContent.filter(s => s.priority === 3),
      low: suggestionsWithContent.filter(s => s.priority <= 2)
    }

    return NextResponse.json({
      suggestions: suggestionsWithContent,
      stats,
      groupedSuggestions
    })

  } catch (error) {
    console.error('Error fetching user recommendations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}































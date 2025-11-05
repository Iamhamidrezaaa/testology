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

    // دریافت آخرین پیام با هر کاربر
    const conversations = await prisma.userMessage.findMany({
      where: {
        OR: [
          { fromId: session.user.id },
          { toId: session.user.id }
        ]
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        to: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // گروه‌بندی بر اساس کاربر مقابل
    const conversationMap = new Map()
    
    conversations.forEach(message => {
      const otherUserId = message.fromId === session.user.id ? message.toId : message.fromId
      const otherUser = message.fromId === session.user.id ? message.to : message.from
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        })
      }
    })

    // شمارش پیام‌های خوانده نشده
    for (const [userId, conversation] of conversationMap) {
      const unreadCount = await prisma.userMessage.count({
        where: {
          fromId: userId,
          toId: session.user.id,
          isRead: false
        }
      })
      conversation.unreadCount = unreadCount
    }

    const conversationList = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())

    return NextResponse.json({ conversations: conversationList })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















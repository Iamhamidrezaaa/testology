import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const items = await prisma.marketplaceItem.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ items })

  } catch (error) {
    console.error('Error fetching marketplace items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, slug, description, price, imageUrl, type, category, difficulty, duration, fileUrl } = await req.json()

    if (!title || !slug || !description) {
      return NextResponse.json({ error: 'Title, slug and description are required' }, { status: 400 })
    }

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        slug,
        description,
        price: price || 0,
        imageUrl: imageUrl || '',
        type: type || 'exercise',
        category: category || 'general',
        difficulty: difficulty || 'beginner',
        duration: duration ? parseInt(duration) : null,
        fileUrl: fileUrl || null,
        authorId: session.user.id
      }
    })

    return NextResponse.json({ item })

  } catch (error) {
    console.error('Error creating marketplace item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
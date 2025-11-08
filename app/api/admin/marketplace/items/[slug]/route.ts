import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = params.slug

    const item = await prisma.marketplaceItem.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ item })

  } catch (error) {
    console.error('Error fetching marketplace item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = params.slug
    const data = await req.json()
    const { title, description, price, imageUrl } = data

    const item = await prisma.marketplaceItem.update({
      where: { slug },
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ item })

  } catch (error) {
    console.error('Error updating marketplace item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = params.slug

    await prisma.marketplaceItem.delete({
      where: { slug }
    })

    return NextResponse.json({ message: 'Item deleted successfully' })

  } catch (error) {
    console.error('Error deleting marketplace item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


















import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const advisorId = searchParams.get('advisorId')

    if (!userId || !advisorId) {
      return NextResponse.json({ error: 'userId and advisorId are required' }, { status: 400 })
    }

    // بررسی دسترسی
    if (session.user.role !== 'ADMIN' && session.user.id !== advisorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // SessionNote model doesn't exist in schema
    // Returning empty array for now
    const notes: any[] = []

    return NextResponse.json(notes)

  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, content, advisorId } = await req.json()

    if (!userId || !content || !advisorId) {
      return NextResponse.json({ error: 'userId, content and advisorId are required' }, { status: 400 })
    }

    // بررسی دسترسی
    if (session.user.role !== 'ADMIN' && session.user.id !== advisorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // SessionNote model doesn't exist in schema
    // Returning mock note for now
    const note = {
      id: 'mock-note-id',
      userId,
      advisorId,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(note)

  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get('blogId')

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    // BlogComment model doesn't exist in schema
    // Using Comment model instead (if needed, add blogId to Comment model)
    const comments: any[] = []

    return NextResponse.json({
      success: true,
      comments
    })

  } catch (error) {
    console.error('Error fetching blog comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { blogId, content, author, email } = await req.json()

    if (!blogId || !content || !author || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // BlogComment model doesn't exist in schema
    // Comment model doesn't have blogId field
    return NextResponse.json({ 
      success: false, 
      error: 'Comment feature not fully implemented',
      message: 'BlogComment model is not in schema'
    }, { status: 400 })

  } catch (error) {
    console.error('Error creating blog comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
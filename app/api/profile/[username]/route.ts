import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    // UserProfile model doesn't exist in schema
    return NextResponse.json({ error: 'پروفایل یافت نشد' }, { status: 404 })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

















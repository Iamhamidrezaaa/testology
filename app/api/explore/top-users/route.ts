import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // UserProfile model doesn't exist in schema - returning empty array
    const topUsers: any[] = [];

    return NextResponse.json({ users: topUsers })

  } catch (error) {
    console.error('Error fetching top users:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

















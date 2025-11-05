import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getGamificationStats } from '@/lib/services/gamification'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getGamificationStats(session.user.id)

    if (!stats) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching gamification stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















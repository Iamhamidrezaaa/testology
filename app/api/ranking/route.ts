import { NextResponse } from 'next/server'
import { getTopUsers } from '@/lib/services/ranking'

export async function GET() {
  try {
    const topUsers = await getTopUsers(100)
    
    return NextResponse.json({ 
      rankings: topUsers,
      total: topUsers.length 
    })

  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

















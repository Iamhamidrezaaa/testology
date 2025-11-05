import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 })
    }

    // TODO: Implement critical alerts fetching when userCriticalAlert model is added to schema
    const alerts: any[] = []

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching critical alerts:', error)
    return NextResponse.json({ error: 'خطا در دریافت هشدارهای بحرانی' }, { status: 500 })
  }
}
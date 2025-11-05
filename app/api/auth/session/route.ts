import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const session = cookieStore.get('user_session')

  if (!session) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user: session.value })
} 

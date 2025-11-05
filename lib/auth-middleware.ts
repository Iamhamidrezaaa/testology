import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest } from 'next/server'

export async function checkAdminAuth(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return { 
        success: false, 
        error: 'Unauthorized',
        status: 401 
      }
    }

    // بررسی نقش کاربر
    const isAdmin = session.user.role === 'admin' || 
                   session.user.role === 'ADMIN' || 
                   session.user.email === 'h.asgarizade@gmail.com' ||
                   session.user.isAdmin === true

    if (!isAdmin) {
      return { 
        success: false, 
        error: 'Forbidden',
        status: 403 
      }
    }

    return { 
      success: true, 
      user: session.user 
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { 
      success: false, 
      error: 'Internal Server Error',
      status: 500 
    }
  }
}


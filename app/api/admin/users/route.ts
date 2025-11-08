import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Fetching users (authentication temporarily disabled)')
    
    // TODO: بعداً authentication را فعال کنیم
    /*
    const authResult = await checkAdminAuth(req)
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error }, 
        { status: authResult.status }
      )
    }
    */

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // دریافت کاربران از دیتابیس
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const [users, totalUsers, activeUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          createdAt: true,
          role: true,
          _count: {
            select: {
              testResults: true
            }
          }
        },
        orderBy: [
          // مدیر کل همیشه در صدر
          { email: 'asc' },
          // سپس بر اساس نقش
          { role: 'asc' },
          // و در نهایت بر اساس تاریخ ایجاد
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
    ])

    // فرمت کردن داده‌ها
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name || 'نامشخص',
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      testCount: user._count.testResults,
      lastTestDate: null, // TODO: محاسبه آخرین تست
      isActive: true, // TODO: محاسبه وضعیت فعال
      averageScore: 0, // TODO: محاسبه میانگین امتیاز
      country: null,
      province: null
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      },
      stats: {
        totalUsers,
        activeUsers,
        newUsers: activeUsers
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت کاربران' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Creating user (authentication temporarily disabled)')
    
    // TODO: بعداً authentication را فعال کنیم
    /*
    const session = await getServerSession(authOptions)
    console.log('🔍 Session in POST:', session)
    console.log('👤 User:', session?.user)
    console.log('🔑 Role:', session?.user?.role)
    console.log('📧 Email:', session?.user?.email)
    
    if (!session || !session.user) {
      console.log('❌ No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // بررسی نقش کاربر
    const isAdmin = session.user.role === 'ADMIN' || 
                   session.user.role === 'ADMIN' || 
                   session.user.email === 'h.asgarizade@gmail.com'

    console.log('🔐 Is admin:', isAdmin)

    if (!isAdmin) {
      console.log('❌ User is not admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    */

    const { name, email, phone, role } = await req.json()

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'نام، ایمیل و نقش الزامی است' },
        { status: 400 }
      )
    }

    // بررسی وجود کاربر با همین ایمیل
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'کاربری با این ایمیل قبلاً وجود دارد' },
        { status: 400 }
      )
    }

    // ایجاد کاربر جدید در دیتابیس
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role: role as any,
        emailVerified: new Date(),
        image: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt.toISOString()
      },
      message: 'کاربر با موفقیت ایجاد شد'
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد کاربر' },
      { status: 500 }
    )
  }
}
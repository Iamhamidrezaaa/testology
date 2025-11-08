import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mock data برای نقش‌ها
    const mockRoles = [
      {
        id: '1',
        name: 'مدیر سیستم',
        description: 'دسترسی کامل به تمام بخش‌های سیستم',
        permissions: ['users.view', 'users.edit', 'users.delete', 'tests.view', 'tests.edit', 'tests.create', 'tests.delete', 'reports.view', 'settings.edit', 'roles.manage', 'blog.view', 'blog.edit', 'blog.create', 'blog.delete'],
        userCount: 1,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'کاربر عادی',
        description: 'دسترسی محدود به بخش‌های عمومی',
        permissions: ['tests.view'],
        userCount: 0,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'ناظر',
        description: 'دسترسی به مشاهده گزارش‌ها و کاربران',
        permissions: ['users.view', 'tests.view', 'reports.view'],
        userCount: 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'روان‌شناس',
        description: 'دسترسی به مدیریت مقالات روان‌شناسی و تست‌های تخصصی',
        permissions: ['tests.view', 'tests.edit', 'tests.create', 'blog.view', 'blog.edit', 'blog.create', 'reports.view', 'users.view'],
        userCount: 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'تولیدکننده محتوا',
        description: 'دسترسی به تولید و مدیریت محتوای بلاگ و مقالات',
        permissions: ['blog.view', 'blog.edit', 'blog.create', 'blog.delete', 'tests.view', 'reports.view'],
        userCount: 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      roles: mockRoles
    })

  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت نقش‌ها' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, description, permissions } = await req.json()

    if (!name || !description || !permissions) {
      return NextResponse.json(
        { error: 'نام، توضیحات و مجوزها الزامی است' },
        { status: 400 }
      )
    }

    // Mock response برای ایجاد نقش جدید
    const newRole = {
      id: `role_${Date.now()}`,
      name,
      description,
      permissions,
      userCount: 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      role: newRole,
      message: 'نقش با موفقیت ایجاد شد'
    })

  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد نقش' },
      { status: 500 }
    )
  }
}
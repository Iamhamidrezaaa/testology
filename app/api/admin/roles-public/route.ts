import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // دریافت تعداد کاربران برای هر نقش از دیتابیس
    const userCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })

    // ایجاد نقش‌ها با تعداد کاربران واقعی
    const roles = [
      {
        id: '1',
        name: 'مدیر سیستم',
        description: 'دسترسی کامل به تمام بخش‌های سیستم',
        permissions: ['users.view', 'users.edit', 'users.delete', 'tests.view', 'tests.edit', 'tests.create', 'tests.delete', 'reports.view', 'settings.edit', 'roles.manage', 'blog.view', 'blog.edit', 'blog.create', 'blog.delete'],
        userCount: userCounts.find(uc => uc.role === 'ADMIN')?._count.role || 0,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'کاربر عادی',
        description: 'دسترسی محدود به بخش‌های عمومی',
        permissions: ['tests.view'],
        userCount: userCounts.find(uc => uc.role === 'USER')?._count.role || 0,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'ناظر',
        description: 'دسترسی به مشاهده گزارش‌ها و کاربران',
        permissions: ['users.view', 'tests.view', 'reports.view'],
        userCount: userCounts.find(uc => uc.role === 'MODERATOR')?._count.role || 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'روان‌شناس',
        description: 'دسترسی به مدیریت مقالات روان‌شناسی و تست‌های تخصصی',
        permissions: ['tests.view', 'tests.edit', 'tests.create', 'blog.view', 'blog.edit', 'blog.create', 'reports.view', 'users.view'],
        userCount: userCounts.find(uc => uc.role === 'THERAPIST')?._count.role || 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'تولیدکننده محتوا',
        description: 'دسترسی به تولید و مدیریت محتوای بلاگ و مقالات',
        permissions: ['blog.view', 'blog.edit', 'blog.create', 'blog.delete', 'tests.view', 'reports.view'],
        userCount: userCounts.find(uc => uc.role === 'CONTENT_PRODUCER')?._count.role || 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      roles: roles
    })

  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت نقش‌ها' },
      { status: 500 }
    )
  }
}



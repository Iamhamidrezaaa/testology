import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params

    // Mock data برای نقش خاص
    const mockRole = {
      id,
      name: 'admin',
      description: 'مدیر سیستم',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockRole
    })

  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت نقش' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const { name, description, permissions } = await req.json()

    if (!name || !description || !permissions) {
      return NextResponse.json(
        { error: 'نام، توضیحات و مجوزها الزامی است' },
        { status: 400 }
      )
    }

    // Mock response برای به‌روزرسانی نقش
    const updatedRole = {
      id,
      name,
      description,
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'نقش با موفقیت به‌روزرسانی شد'
    })

  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی نقش' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params

    // Mock response برای حذف نقش
    return NextResponse.json({
      success: true,
      message: 'نقش با موفقیت حذف شد'
    })

  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'خطا در حذف نقش' },
      { status: 500 }
    )
  }
}
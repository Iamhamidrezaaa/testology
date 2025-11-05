import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Deleting user (authentication temporarily disabled)')
    
    const userId = params.id
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }
    
    // Protect admin user
    if (user.email === 'admin@testology.me') {
      return NextResponse.json(
        { error: 'نمی‌توانید کاربر مدیر کل را حذف کنید' },
        { status: 403 }
      )
    }
    
    // Delete user from database
    await prisma.user.delete({
      where: { id: userId }
    })
    
    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت حذف شد'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'خطا در حذف کاربر' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Updating user (authentication temporarily disabled)')
    
    const userId = params.id
    const { name, email, phone, role, password } = await req.json()
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }
    
    // Protect admin user from role changes
    if (user.email === 'admin@testology.me' && role && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'نمی‌توانید نقش کاربر مدیر کل را تغییر دهید' },
        { status: 403 }
      )
    }
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role: role as any }),
        ...(password && { password })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        password: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'کاربر با موفقیت به‌روزرسانی شد'
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی کاربر' },
      { status: 500 }
    )
  }
}





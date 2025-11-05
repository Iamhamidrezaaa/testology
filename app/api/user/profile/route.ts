import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // بررسی تکمیل پروفایل
    const isProfileComplete = !!(
      user.name && 
      user.lastName && 
      user.phone && 
      user.birthDate && 
      user.province && 
      user.city
    )

    const profile = {
      id: user.id,
      name: user.name || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      birthDate: user.birthDate || '',
      province: user.province || '',
      city: user.city || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      isProfileComplete
    }

    return NextResponse.json({
      success: true,
      profile: profile
    })
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات پروفایل' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, lastName, phone, birthDate, province, city, bio } = await req.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // بررسی فیلدهای اجباری
    if (!name || !lastName || !phone || !birthDate || !province || !city) {
      return NextResponse.json(
        { success: false, message: 'تمام فیلدهای اجباری باید پر شوند' },
        { status: 400 }
      )
    }

    // بررسی وجود کاربر
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // بروزرسانی اطلاعات پروفایل
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        lastName,
        phone,
        birthDate,
        province,
        city,
        bio: bio || null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'اطلاعات پروفایل با موفقیت بروزرسانی شد',
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthDate: updatedUser.birthDate,
        province: updatedUser.province,
        city: updatedUser.city,
        bio: updatedUser.bio,
        isProfileComplete: true
      }
    })
    
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در بروزرسانی اطلاعات پروفایل' },
      { status: 500 }
    )
  }
}


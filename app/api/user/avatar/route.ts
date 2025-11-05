import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = formData.get('email') as string
    const file = formData.get('avatar') as File
    
    if (!email || !file) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر و فایل آواتار مورد نیاز است' },
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

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // تولید نام فایل منحصر به فرد
    const fileExtension = file.name.split('.').pop()
    const fileName = `${email.replace('@', '_').replace('.', '_')}_${Date.now()}.${fileExtension}`
    const filePath = join(process.cwd(), 'public', 'images', 'avatars', fileName)

    // ذخیره فایل
    await writeFile(filePath, buffer)

    // مسیر فایل برای ذخیره در دیتابیس
    const avatarPath = `/images/avatars/${fileName}`

    // بروزرسانی آواتار در دیتابیس
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { avatar: avatarPath }
    })

    return NextResponse.json({
      success: true,
      message: 'آواتار با موفقیت آپلود شد',
      avatar: avatarPath
    })
    
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در آپلود آواتار' },
      { status: 500 }
    )
  }
}

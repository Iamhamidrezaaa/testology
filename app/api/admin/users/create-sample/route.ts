import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Creating sample users in database')

    // Sample users
    const sampleUsers = [
      {
        name: 'مدیر کل',
        email: 'admin@testology.me',
        password: 'admin123',
        role: 'ADMIN',
        phone: '09123456789'
      },
      {
        name: 'کاربر تست',
        email: 'user@testology.me',
        password: 'user123',
        role: 'USER',
        phone: '09987654321'
      },
      {
        name: 'روان‌شناس',
        email: 'therapist@testology.me',
        password: 'therapist123',
        role: 'THERAPIST',
        phone: '09111111111'
      },
      {
        name: 'مدیر محتوا',
        email: 'moderator@testology.me',
        password: 'moderator123',
        role: 'MODERATOR',
        phone: '09222222222'
      }
    ]

    // Create users in database
    const createdUsers = []
    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        })

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              password: userData.password,
              role: userData.role as any,
              phone: userData.phone,
              emailVerified: new Date(),
              image: null
            }
          })
          createdUsers.push(newUser)
          console.log(`✅ User created: ${userData.email}`)
        } else {
          console.log(`⚠️ User already exists: ${userData.email}`)
        }
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdUsers.length} کاربر نمونه ایجاد شد`,
      users: createdUsers,
      count: createdUsers.length
    })

  } catch (error) {
    console.error('Error creating sample users:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد کاربران نمونه' },
      { status: 500 }
    )
  }
}










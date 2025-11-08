import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * دریافت یا ایجاد پروفایل درمانگر
 * GET /api/therapist/profile
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;

    // بررسی دسترسی
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // مدل therapistProfile در schema وجود ندارد
    // برای MVP، یک پروفایل mock برمی‌گردانیم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'THERAPIST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'User is not a therapist' }, { status: 404 });
    }

    const profile = {
      userId: user.id,
      bio: '',
      specialties: [],
      location: '',
      availability: {},
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt
      }
    };

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Error fetching therapist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * به‌روزرسانی پروفایل درمانگر
 * PATCH /api/therapist/profile
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // مدل therapistProfile در schema وجود ندارد
    // برای MVP، یک پیام موفقیت برمی‌گردانیم
    const { bio, specialties, location, availability } = await req.json();

    return NextResponse.json({
      success: true,
      message: 'Therapist profile feature is not available yet. Models need to be added to schema.',
      profile: {
        userId: session.user.id,
        bio: bio || '',
        specialties: specialties || [],
        location: location || '',
        availability: availability || {}
      }
    });

  } catch (error) {
    console.error('Error updating therapist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

















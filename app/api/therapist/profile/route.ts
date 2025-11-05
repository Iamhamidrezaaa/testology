import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    if (userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let profile = await prisma.therapistProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            specialty: true,
            createdAt: true
          }
        }
      }
    });

    // اگر پروفایل وجود نداشت و درمانگره، بساز
    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (user?.role === 'therapist') {
        profile = await prisma.therapistProfile.create({
          data: {
            userId,
            bio: '',
            specialties: [],
            location: '',
            availability: {}
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                specialty: true,
                createdAt: true
              }
            }
          }
        });
      } else {
        return NextResponse.json({ error: 'User is not a therapist' }, { status: 404 });
      }
    }

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

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { bio, specialties, location, availability } = await req.json();

    const updated = await prisma.therapistProfile.upsert({
      where: { userId: session.user.id },
      update: {
        bio: bio !== undefined ? bio : undefined,
        specialties: specialties !== undefined ? specialties : undefined,
        location: location !== undefined ? location : undefined,
        availability: availability !== undefined ? availability : undefined
      },
      create: {
        userId: session.user.id,
        bio: bio || '',
        specialties: specialties || [],
        location: location || '',
        availability: availability || {}
      }
    });

    return NextResponse.json({
      success: true,
      profile: updated
    });

  } catch (error) {
    console.error('Error updating therapist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

















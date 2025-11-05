import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * دریافت لیست عمومی درمانگران
 * GET /api/therapist/public?specialty=اضطراب&location=تهران
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: any = {
      role: 'admin' // در حال حاضر فقط admin می‌تواند درمانگر باشد
    };

    // فیلتر specialty در MVP غیرفعال است
    // if (specialty) {
    //   where.specialty = {
    //     contains: specialty,
    //     mode: 'insensitive'
    //   };
    // }

    const therapists = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // فرمت کردن برای نمایش
    const formattedTherapists = therapists.map(t => ({
      id: t.id,
      name: t.name || 'درمانگر',
      email: t.email,
      image: null,
      specialty: 'روان‌شناسی عمومی',
      bio: 'درمانگر مجرب و متخصص',
      location: 'تهران',
      rating: 4.5,
      sessionsCount: 0,
      verified: true,
      specialties: ['اضطراب', 'افسردگی', 'استرس']
    }));

    return NextResponse.json(formattedTherapists);

  } catch (error) {
    console.error('Error fetching public therapists:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}








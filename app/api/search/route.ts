import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * جست‌وجوی هوشمند در تمام بخش‌های Testology
 * GET /api/search?q=اضطراب
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams?.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const q = query.trim();

    // جست‌وجوی موازی در همه بخش‌ها
    const [articles, exercises, therapists, tests, liveSessions, groups] = await Promise.all([
      // مقالات
      prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { metaDescription: { contains: q } }
          ],
          published: true
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          metaDescription: true,
          viewCount: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { viewCount: 'desc' }
      }).catch(() => []),

      // تمرین‌ها و محتوای مارکت
      prisma.marketplaceItem.findMany({
        where: {
          OR: [
            { title: { contains: q, } },
            { description: { contains: q, } }
          ]
        },
        take: 5,
        include: {
          author: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // درمانگران
      prisma.user.findMany({
        where: {
          role: 'THERAPIST',
          OR: [
            { name: { contains: q, } }
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          image: true
        }
      }),

      // تست‌ها (از فایل‌های استاتیک، فقط نام می‌گردیم)
      // برای سادگی، یک لیست استاتیک
      Promise.resolve(
        [
          { slug: 'phq9', name: 'پرسشنامه افسردگی PHQ-9', category: 'افسردگی' },
          { slug: 'gad7', name: 'پرسشنامه اضطراب GAD-7', category: 'اضطراب' },
          { slug: 'pss', name: 'مقیاس استرس ادراک‌شده', category: 'استرس' },
          { slug: 'rosenberg', name: 'مقیاس عزت‌نفس روزنبرگ', category: 'عزت‌نفس' },
          { slug: 'bai', name: 'سیاهه اضطراب بک', category: 'اضطراب' }
        ].filter((test: any) =>
          test.name.includes(q) ||
          test.category.includes(q) ||
          test.testSlug || test.slug.includes(q.toLowerCase())
        ).slice(0, 5)
      ),

      // جلسات لایو - liveSession model doesn't exist in schema
      Promise.resolve([]),

      // گروه‌های درمانی - TherapyGroup model doesn't exist in schema
      Promise.resolve([])
    ]);

    return NextResponse.json({
      query: q,
      results: {
        articles,
        exercises,
        therapists,
        tests,
        liveSessions,
        groups
      },
      totalResults:
        articles.length +
        exercises.length +
        therapists.length +
        tests.length +
        liveSessions.length +
        groups.length
    });

  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}


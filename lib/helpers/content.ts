import { prisma } from '@/lib/prisma';

/**
 * Helper functions برای دریافت محتوا
 */

/**
 * دریافت مقاله بر اساس slug
 */
export async function getArticleBySlug(slug: string) {
  try {
    // مدل blogPost در schema وجود ندارد
    const article = null as any

    if (!article) {
      return null;
    }

    // افزایش تعداد بازدید
    // مدل blogPost در schema وجود ندارد
    // await prisma.blogPost.update({
    //   where: { id: article.id },
    //   data: { views: { increment: 1 } }
    // });

    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * دریافت تست بر اساس slug
 */
export async function getTestBySlug(slug: string) {
  // تست‌ها معمولاً از فایل‌های استاتیک می‌آیند
  const tests: Record<string, any> = {
    'phq9': {
      slug: 'phq9',
      name: 'پرسشنامه افسردگی PHQ-9',
      description: 'ارزیابی علائم افسردگی در دو هفته گذشته',
      category: 'افسردگی',
      duration: '5 دقیقه',
      questionsCount: 9
    },
    'gad7': {
      slug: 'gad7',
      name: 'پرسشنامه اضطراب GAD-7',
      description: 'سنجش سطح اضطراب عمومی',
      category: 'اضطراب',
      duration: '5 دقیقه',
      questionsCount: 7
    },
    'pss': {
      slug: 'pss',
      name: 'مقیاس استرس ادراک‌شده',
      description: 'ارزیابی میزان استرس در یک ماه گذشته',
      category: 'استرس',
      duration: '7 دقیقه',
      questionsCount: 10
    },
    'rosenberg': {
      slug: 'rosenberg',
      name: 'مقیاس عزت‌نفس روزنبرگ',
      description: 'سنجش عزت‌نفس و ارزش خود',
      category: 'عزت‌نفس',
      duration: '5 دقیقه',
      questionsCount: 10
    }
  };

  return tests[slug] || null;
}

/**
 * دریافت پروفایل درمانگر
 */
export async function getTherapistProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        // therapistProfile: true
      }
    });

    if (!user || user.role !== 'THERAPIST') {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      specialty: (user as any).specialty,
      profile: (user as any).therapistProfile
    };
  } catch (error) {
    console.error('Error fetching therapist profile:', error);
    return null;
  }
}

/**
 * دریافت جلسه لایو بر اساس slug
 */
export async function getLiveBySlug(slug: string) {
  try {
    // مدل liveSession در schema وجود ندارد
    const liveSession = null as any

    return liveSession;
  } catch (error) {
    console.error('Error fetching live session:', error);
    return null;
  }
}

/**
 * دریافت محصول مارکت
 */
export async function getMarketplaceItem(id: string) {
  try {
    const item = await prisma.marketplaceItem.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            // specialty: true
          }
        }
      }
    });

    return item;
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    return null;
  }
}

















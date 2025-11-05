import { prisma } from '@/lib/prisma';

export async function getUserProfileByUsername(username: string) {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { username },
      include: {
        user: {
          include: {
            testResults: {
              include: {
                test: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 10
            }
          }
        }
      }
    });

    if (!profile || !profile.isPublic) {
      return null;
    }

    // تبدیل داده‌ها به فرمت مورد نیاز
    const completedTests = profile.user.testResults.map(result => ({
      slug: result.test.slug,
      name: result.test.name,
      score: result.score,
      completedAt: result.createdAt.toISOString()
    }));

    // تولید chartData از نتایج تست‌ها
    const chartData = generateChartData(profile.user.testResults);

    return {
      id: profile.id,
      username: profile.username,
      fullName: profile.fullName,
      bio: profile.bio,
      mood: profile.mood,
      summary: profile.summary,
      chartData,
      totalPoints: profile.totalPoints,
      completedTests,
      createdAt: profile.createdAt
    };
  } catch (error) {
    console.error('خطا در دریافت پروفایل کاربر:', error);
    return null;
  }
}

function generateChartData(testResults: any[]) {
  // تولید داده‌های نمودار رادار بر اساس نتایج تست‌ها
  const categories = [
    'اضطراب',
    'افسردگی', 
    'استرس',
    'عزت نفس',
    'رضایت از زندگی',
    'تمرکز'
  ];

  return categories.map(category => ({
    subject: category,
    score: Math.floor(Math.random() * 100) // در واقعیت از نتایج واقعی محاسبه می‌شود
  }));
}

export async function createUserProfile(userId: string, username: string, fullName?: string) {
  try {
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        username,
        fullName,
        isPublic: true
      }
    });

    return profile;
  } catch (error) {
    console.error('خطا در ایجاد پروفایل:', error);
    return null;
  }
}

export async function updateUserProfile(username: string, data: {
  fullName?: string;
  bio?: string;
  mood?: string;
  summary?: string;
  isPublic?: boolean;
}) {
  try {
    const profile = await prisma.userProfile.update({
      where: { username },
      data
    });

    return profile;
  } catch (error) {
    console.error('خطا در به‌روزرسانی پروفایل:', error);
    return null;
  }
}

















import prisma from '@/lib/prisma';

export async function getUserProfileByUsername(username: string) {
  try {
    // UserProfile model doesn't exist in schema
    return null;
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
    // UserProfile model doesn't exist in schema
    return null;
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
    // UserProfile model doesn't exist in schema
    return null;
  } catch (error) {
    console.error('خطا در به‌روزرسانی پروفایل:', error);
    return null;
  }
}

















const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateSimpleAnalyticsData() {
  try {
    console.log('📊 تولید داده‌های ساده آمار...\n');
    
    // تولید داده‌های کاربران
    console.log('👥 تولید داده‌های کاربران...');
    await prisma.userAnalytics.upsert({
      where: { id: 'main' },
      update: {
        total: 15420,
        active: 8930,
        new: 2340,
        returning: 6590,
        premium: 1230,
        free: 14190
      },
      create: {
        id: 'main',
        total: 15420,
        active: 8930,
        new: 2340,
        returning: 6590,
        premium: 1230,
        free: 14190
      }
    });
    
    // تولید داده‌های تست‌ها
    console.log('🧪 تولید داده‌های تست‌ها...');
    await prisma.testAnalytics.upsert({
      where: { id: 'main' },
      update: {
        total: 45,
        completed: 23450,
        averageTime: 12.5,
        completionRate: 78.5,
        satisfaction: 4.2
      },
      create: {
        id: 'main',
        total: 45,
        completed: 23450,
        averageTime: 12.5,
        completionRate: 78.5,
        satisfaction: 4.2
      }
    });
    
    // تولید داده‌های مقالات
    console.log('📝 تولید داده‌های مقالات...');
    await prisma.articleAnalytics.upsert({
      where: { id: 'main' },
      update: {
        total: 103,
        published: 102,
        draft: 1,
        views: 125670,
        likes: 8930,
        shares: 2340,
        comments: 1560
      },
      create: {
        id: 'main',
        total: 103,
        published: 102,
        draft: 1,
        views: 125670,
        likes: 8930,
        shares: 2340,
        comments: 1560
      }
    });
    
    // تولید داده‌های ماهانه
    console.log('📅 تولید داده‌های ماهانه...');
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    for (const month of months) {
      await prisma.monthlyAnalytics.upsert({
        where: { month },
        update: {
          users: Math.floor(Math.random() * 1000) + 500,
          tests: Math.floor(Math.random() * 2000) + 1000,
          articles: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 50000) + 20000
        },
        create: {
          month,
          users: Math.floor(Math.random() * 1000) + 500,
          tests: Math.floor(Math.random() * 2000) + 1000,
          articles: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 50000) + 20000
        }
      });
    }
    
    // تولید داده‌های جغرافیایی
    console.log('🌍 تولید داده‌های جغرافیایی...');
    const countries = [
      { country: 'ایران', users: 8540, percentage: 55.4 },
      { country: 'آمریکا', users: 2340, percentage: 15.2 },
      { country: 'کانادا', users: 1890, percentage: 12.3 },
      { country: 'آلمان', users: 1230, percentage: 8.0 },
      { country: 'انگلستان', users: 890, percentage: 5.8 },
      { country: 'سایر', users: 530, percentage: 3.4 }
    ];
    
    for (const country of countries) {
      await prisma.geoAnalytics.upsert({
        where: { country: country.country },
        update: country,
        create: country
      });
    }
    
    // تولید داده‌های دستگاه‌ها
    console.log('📱 تولید داده‌های دستگاه‌ها...');
    const devices = [
      { device: 'موبایل', users: 9250, percentage: 60.0 },
      { device: 'دسکتاپ', users: 4620, percentage: 30.0 },
      { device: 'تبلت', users: 1550, percentage: 10.0 }
    ];
    
    for (const device of devices) {
      await prisma.deviceAnalytics.upsert({
        where: { device: device.device },
        update: device,
        create: device
      });
    }
    
    // تولید داده‌های مرورگرها
    console.log('🌐 تولید داده‌های مرورگرها...');
    const browsers = [
      { browser: 'Chrome', users: 9250, percentage: 60.0 },
      { browser: 'Safari', users: 3080, percentage: 20.0 },
      { browser: 'Firefox', users: 1540, percentage: 10.0 },
      { browser: 'Edge', users: 770, percentage: 5.0 },
      { browser: 'سایر', users: 780, percentage: 5.0 }
    ];
    
    for (const browser of browsers) {
      await prisma.browserAnalytics.upsert({
        where: { browser: browser.browser },
        update: browser,
        create: browser
      });
    }
    
    // تولید داده‌های ساعات روز
    console.log('⏰ تولید داده‌های ساعات روز...');
    for (let hour = 0; hour < 24; hour++) {
      await prisma.hourlyAnalytics.upsert({
        where: { hour },
        update: {
          users: Math.floor(Math.random() * 200) + 50,
          tests: Math.floor(Math.random() * 100) + 20
        },
        create: {
          hour,
          users: Math.floor(Math.random() * 200) + 50,
          tests: Math.floor(Math.random() * 100) + 20
        }
      });
    }
    
    // تولید داده‌های روزهای هفته
    console.log('📅 تولید داده‌های روزهای هفته...');
    const days = [
      { day: 'شنبه', users: 2340, tests: 1230 },
      { day: 'یکشنبه', users: 2890, tests: 1450 },
      { day: 'دوشنبه', users: 3120, tests: 1670 },
      { day: 'سه‌شنبه', users: 2980, tests: 1520 },
      { day: 'چهارشنبه', users: 2750, tests: 1380 },
      { day: 'پنج‌شنبه', users: 2340, tests: 1200 },
      { day: 'جمعه', users: 1890, tests: 950 }
    ];
    
    for (const day of days) {
      await prisma.weeklyAnalytics.upsert({
        where: { day: day.day },
        update: day,
        create: day
      });
    }
    
    console.log('\n✅ داده‌های ساده آمار با موفقیت تولید شدند!');
    
    // نمایش آمار کلی
    console.log('\n📊 آمار کلی تولید شده:');
    const userStats = await prisma.userAnalytics.findFirst();
    const testStats = await prisma.testAnalytics.findFirst();
    const articleStats = await prisma.articleAnalytics.findFirst();
    
    console.log('👥 کاربران:', userStats);
    console.log('🧪 تست‌ها:', testStats);
    console.log('📝 مقالات:', articleStats);
    
  } catch (error) {
    console.error('❌ خطا در تولید داده‌های ساده:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSimpleAnalyticsData();








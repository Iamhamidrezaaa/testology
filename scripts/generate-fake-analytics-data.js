const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای تولید داده‌های فیک
function generateFakeData() {
  const categories = ['anxiety', 'personality', 'mindfulness', 'relationships', 'growth', 'lifestyle', 'motivation', 'research', 'sleep', 'analysis'];
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  
  // تولید داده‌های ماهانه
  const monthlyData = months.map((month, index) => ({
    month,
    users: Math.floor(Math.random() * 1000) + 500,
    tests: Math.floor(Math.random() * 2000) + 1000,
    articles: Math.floor(Math.random() * 100) + 50,
    revenue: Math.floor(Math.random() * 50000) + 20000
  }));
  
  // تولید داده‌های دسته‌بندی
  const categoryData = categories.map(category => ({
    category,
    views: Math.floor(Math.random() * 5000) + 1000,
    tests: Math.floor(Math.random() * 500) + 100,
    articles: Math.floor(Math.random() * 20) + 5,
    engagement: Math.floor(Math.random() * 30) + 10
  }));
  
  // تولید داده‌های روزانه (آخرین 30 روز)
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      users: Math.floor(Math.random() * 200) + 50,
      tests: Math.floor(Math.random() * 500) + 100,
      articles: Math.floor(Math.random() * 10) + 1,
      revenue: Math.floor(Math.random() * 2000) + 500
    });
  }
  
  // تولید داده‌های کاربران
  const userData = {
    total: 15420,
    active: 8930,
    new: 2340,
    returning: 6590,
    premium: 1230,
    free: 14190
  };
  
  // تولید داده‌های تست‌ها
  const testData = {
    total: 45,
    completed: 23450,
    averageTime: 12.5,
    completionRate: 78.5,
    satisfaction: 4.2
  };
  
  // تولید داده‌های مقالات
  const articleData = {
    total: 103,
    published: 102,
    draft: 1,
    views: 125670,
    likes: 8930,
    shares: 2340,
    comments: 1560
  };
  
  // تولید داده‌های جغرافیایی
  const geoData = [
    { country: 'ایران', users: 8540, percentage: 55.4 },
    { country: 'آمریکا', users: 2340, percentage: 15.2 },
    { country: 'کانادا', users: 1890, percentage: 12.3 },
    { country: 'آلمان', users: 1230, percentage: 8.0 },
    { country: 'انگلستان', users: 890, percentage: 5.8 },
    { country: 'سایر', users: 530, percentage: 3.4 }
  ];
  
  // تولید داده‌های دستگاه‌ها
  const deviceData = [
    { device: 'موبایل', users: 9250, percentage: 60.0 },
    { device: 'دسکتاپ', users: 4620, percentage: 30.0 },
    { device: 'تبلت', users: 1550, percentage: 10.0 }
  ];
  
  // تولید داده‌های مرورگرها
  const browserData = [
    { browser: 'Chrome', users: 9250, percentage: 60.0 },
    { browser: 'Safari', users: 3080, percentage: 20.0 },
    { browser: 'Firefox', users: 1540, percentage: 10.0 },
    { browser: 'Edge', users: 770, percentage: 5.0 },
    { browser: 'سایر', users: 780, percentage: 5.0 }
  ];
  
  // تولید داده‌های ساعات روز
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    users: Math.floor(Math.random() * 200) + 50,
    tests: Math.floor(Math.random() * 100) + 20
  }));
  
  // تولید داده‌های روزهای هفته
  const weeklyData = [
    { day: 'شنبه', users: 2340, tests: 1230 },
    { day: 'یکشنبه', users: 2890, tests: 1450 },
    { day: 'دوشنبه', users: 3120, tests: 1670 },
    { day: 'سه‌شنبه', users: 2980, tests: 1520 },
    { day: 'چهارشنبه', users: 2750, tests: 1380 },
    { day: 'پنج‌شنبه', users: 2340, tests: 1200 },
    { day: 'جمعه', users: 1890, tests: 950 }
  ];
  
  return {
    monthlyData,
    categoryData,
    dailyData,
    userData,
    testData,
    articleData,
    geoData,
    deviceData,
    browserData,
    hourlyData,
    weeklyData
  };
}

async function generateAnalyticsData() {
  try {
    console.log('📊 تولید داده‌های فیک برای آمار و تحلیل...\n');
    
    const fakeData = generateFakeData();
    
    // ذخیره داده‌های ماهانه
    console.log('📅 تولید داده‌های ماهانه...');
    for (const data of fakeData.monthlyData) {
      await prisma.monthlyAnalytics.upsert({
        where: { month: data.month },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های دسته‌بندی
    console.log('📂 تولید داده‌های دسته‌بندی...');
    for (const data of fakeData.categoryData) {
      await prisma.categoryAnalytics.upsert({
        where: { category: data.category },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های روزانه
    console.log('📆 تولید داده‌های روزانه...');
    for (const data of fakeData.dailyData) {
      await prisma.dailyAnalytics.upsert({
        where: { date: data.date },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های کاربران
    console.log('👥 تولید داده‌های کاربران...');
    await prisma.userAnalytics.upsert({
      where: { id: 'main' },
      update: fakeData.userData,
      create: { id: 'main', ...fakeData.userData }
    });
    
    // ذخیره داده‌های تست‌ها
    console.log('🧪 تولید داده‌های تست‌ها...');
    await prisma.testAnalytics.upsert({
      where: { id: 'main' },
      update: fakeData.testData,
      create: { id: 'main', ...fakeData.testData }
    });
    
    // ذخیره داده‌های مقالات
    console.log('📝 تولید داده‌های مقالات...');
    await prisma.articleAnalytics.upsert({
      where: { id: 'main' },
      update: fakeData.articleData,
      create: { id: 'main', ...fakeData.articleData }
    });
    
    // ذخیره داده‌های جغرافیایی
    console.log('🌍 تولید داده‌های جغرافیایی...');
    for (const data of fakeData.geoData) {
      await prisma.geoAnalytics.upsert({
        where: { country: data.country },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های دستگاه‌ها
    console.log('📱 تولید داده‌های دستگاه‌ها...');
    for (const data of fakeData.deviceData) {
      await prisma.deviceAnalytics.upsert({
        where: { device: data.device },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های مرورگرها
    console.log('🌐 تولید داده‌های مرورگرها...');
    for (const data of fakeData.browserData) {
      await prisma.browserAnalytics.upsert({
        where: { browser: data.browser },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های ساعات روز
    console.log('⏰ تولید داده‌های ساعات روز...');
    for (const data of fakeData.hourlyData) {
      await prisma.hourlyAnalytics.upsert({
        where: { hour: data.hour },
        update: data,
        create: data
      });
    }
    
    // ذخیره داده‌های روزهای هفته
    console.log('📅 تولید داده‌های روزهای هفته...');
    for (const data of fakeData.weeklyData) {
      await prisma.weeklyAnalytics.upsert({
        where: { day: data.day },
        update: data,
        create: data
      });
    }
    
    console.log('\n✅ داده‌های فیک با موفقیت تولید شدند!');
    
    // نمایش آمار کلی
    console.log('\n📊 آمار کلی تولید شده:');
    console.log(`📅 داده‌های ماهانه: ${fakeData.monthlyData.length}`);
    console.log(`📂 داده‌های دسته‌بندی: ${fakeData.categoryData.length}`);
    console.log(`📆 داده‌های روزانه: ${fakeData.dailyData.length}`);
    console.log(`🌍 داده‌های جغرافیایی: ${fakeData.geoData.length}`);
    console.log(`📱 داده‌های دستگاه‌ها: ${fakeData.deviceData.length}`);
    console.log(`🌐 داده‌های مرورگرها: ${fakeData.browserData.length}`);
    console.log(`⏰ داده‌های ساعات روز: ${fakeData.hourlyData.length}`);
    console.log(`📅 داده‌های روزهای هفته: ${fakeData.weeklyData.length}`);
    
    // نمایش نمونه داده‌ها
    console.log('\n📋 نمونه داده‌ها:');
    console.log('👥 کاربران:', fakeData.userData);
    console.log('🧪 تست‌ها:', fakeData.testData);
    console.log('📝 مقالات:', fakeData.articleData);
    
  } catch (error) {
    console.error('❌ خطا در تولید داده‌های فیک:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateAnalyticsData();








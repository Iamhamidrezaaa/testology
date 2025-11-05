const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAnalyticsAPI() {
  try {
    console.log('🧪 تست API آمار و تحلیل...\n');
    
    // تست API endpoint
    console.log('📡 تست API endpoint:');
    const response = await fetch('http://localhost:3000/api/admin/analytics/overview');
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`\n✅ API Response دریافت شد!`);
      
      // نمایش آمار کلی
      console.log('\n📊 آمار کلی:');
      console.log(`👥 کل کاربران: ${data.overview.totalUsers.toLocaleString()}`);
      console.log(`🧪 کل تست‌ها: ${data.overview.totalTests.toLocaleString()}`);
      console.log(`📝 کل مقالات: ${data.overview.totalArticles.toLocaleString()}`);
      console.log(`👁️ کل بازدید: ${data.overview.totalViews.toLocaleString()}`);
      console.log(`📈 رشد ماهانه: ${data.overview.monthlyGrowth}%`);
      
      // نمایش آمار کاربران
      console.log('\n👥 آمار کاربران:');
      console.log(`کل: ${data.userStats.total.toLocaleString()}`);
      console.log(`فعال: ${data.userStats.active.toLocaleString()}`);
      console.log(`جدید: ${data.userStats.new.toLocaleString()}`);
      console.log(`بازگشتی: ${data.userStats.returning.toLocaleString()}`);
      console.log(`پریمیوم: ${data.userStats.premium.toLocaleString()}`);
      console.log(`رایگان: ${data.userStats.free.toLocaleString()}`);
      
      // نمایش آمار تست‌ها
      console.log('\n🧪 آمار تست‌ها:');
      console.log(`کل: ${data.testStats.total}`);
      console.log(`تکمیل شده: ${data.testStats.completed.toLocaleString()}`);
      console.log(`زمان متوسط: ${data.testStats.averageTime} دقیقه`);
      console.log(`نرخ تکمیل: ${data.testStats.completionRate}%`);
      console.log(`رضایت: ${data.testStats.satisfaction}/5`);
      
      // نمایش آمار مقالات
      console.log('\n📝 آمار مقالات:');
      console.log(`کل: ${data.articleStats.total}`);
      console.log(`منتشر شده: ${data.articleStats.published}`);
      console.log(`پیش‌نویس: ${data.articleStats.draft}`);
      console.log(`بازدید: ${data.articleStats.views.toLocaleString()}`);
      console.log(`لایک: ${data.articleStats.likes.toLocaleString()}`);
      console.log(`اشتراک: ${data.articleStats.shares.toLocaleString()}`);
      console.log(`نظر: ${data.articleStats.comments.toLocaleString()}`);
      
      // نمایش آمار جغرافیایی
      console.log('\n🌍 آمار جغرافیایی:');
      data.geoData.countries.forEach((country, index) => {
        console.log(`${index + 1}. ${country.country}: ${country.users.toLocaleString()} کاربر (${country.percentage}%)`);
      });
      
      // نمایش آمار دستگاه‌ها
      console.log('\n📱 آمار دستگاه‌ها:');
      data.deviceData.devices.forEach((device, index) => {
        console.log(`${index + 1}. ${device.device}: ${device.users.toLocaleString()} کاربر (${device.percentage}%)`);
      });
      
      // نمایش آمار مرورگرها
      console.log('\n🌐 آمار مرورگرها:');
      data.browserData.browsers.forEach((browser, index) => {
        console.log(`${index + 1}. ${browser.browser}: ${browser.users.toLocaleString()} کاربر (${browser.percentage}%)`);
      });
      
      // نمایش آمار ساعات
      console.log('\n⏰ آمار ساعات روز:');
      const topHours = data.hourlyData
        .sort((a, b) => b.users - a.users)
        .slice(0, 5);
      topHours.forEach((hour, index) => {
        console.log(`${index + 1}. ساعت ${hour.hour}: ${hour.users} کاربر`);
      });
      
      // نمایش آمار روزهای هفته
      console.log('\n📅 آمار روزهای هفته:');
      data.weeklyData.forEach((day, index) => {
        console.log(`${index + 1}. ${day.day}: ${day.users.toLocaleString()} کاربر`);
      });
      
      // نمایش بینش‌ها
      console.log('\n💡 بینش‌ها:');
      console.log(`ساعت پیک: ${data.insights.peakHour}`);
      console.log(`شلوغ‌ترین روز: ${data.insights.busiestDay}`);
      console.log(`دسته‌بندی برتر: ${data.insights.topCategory}`);
      console.log(`کشور برتر: ${data.insights.topCountry}`);
      
      // نمایش آمار ماهانه
      console.log('\n📅 آمار ماهانه (آخرین 3 ماه):');
      const recentMonths = data.monthlyData.slice(-3);
      recentMonths.forEach((month, index) => {
        console.log(`${index + 1}. ${month.month}: ${month.users.toLocaleString()} کاربر، ${month.tests.toLocaleString()} تست، ${month.articles} مقاله`);
      });
      
      // نمایش آمار دسته‌بندی
      console.log('\n📂 آمار دسته‌بندی (آخرین 5 دسته):');
      const topCategories = data.categoryData
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      topCategories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.category}: ${category.views.toLocaleString()} بازدید، ${category.tests} تست، ${category.articles} مقاله`);
      });
      
      // نمایش آمار روزانه
      console.log('\n📆 آمار روزانه (آخرین 5 روز):');
      const recentDays = data.dailyData.slice(0, 5);
      recentDays.forEach((day, index) => {
        console.log(`${index + 1}. ${day.date}: ${day.users.toLocaleString()} کاربر، ${day.tests.toLocaleString()} تست، ${day.articles} مقاله`);
      });
      
    } else {
      console.log(`❌ API Error: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error Text: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در تست API:', error.message);
  }
}

testAnalyticsAPI();








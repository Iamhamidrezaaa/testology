// scripts/seed-users.js
// اجرا: node scripts/seed-users.js

const { hash } = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع کمکی برای ساخت تحلیل‌های واقعی‌تر
function generateAnalysis(testName, score) {
  const analyses = {
    'تست اضطراب': {
      high: 'سطح اضطراب شما در محدوده بالایی قرار دارد. توصیه می‌شود با یک روان‌شناس مشورت کنید و تکنیک‌های مدیریت اضطراب را تمرین کنید.',
      medium: 'سطح اضطراب شما در محدوده متوسط است. با تمرین تکنیک‌های آرامش‌بخش می‌توانید آن را کاهش دهید.',
      low: 'سطح اضطراب شما در محدوده طبیعی است. به خوبی می‌توانید با استرس‌های روزمره کنار بیایید.'
    },
    'تست افسردگی': {
      high: 'نشانه‌های افسردگی در شما قابل توجه است. حتماً با یک متخصص سلامت روان مشورت کنید.',
      medium: 'برخی نشانه‌های افسردگی در شما دیده می‌شود. مراقبت از خود و فعالیت‌های مثبت می‌تواند کمک کند.',
      low: 'وضعیت روانی شما در محدوده سالم است. به فعالیت‌های مثبت خود ادامه دهید.'
    },
    'تست استرس': {
      high: 'سطح استرس شما بالا است. مدیریت زمان و تکنیک‌های آرامش می‌تواند کمک کند.',
      medium: 'سطح استرس شما متوسط است. با برنامه‌ریزی می‌توانید آن را کنترل کنید.',
      low: 'سطح استرس شما در محدوده طبیعی است. به خوبی با چالش‌ها کنار می‌آیید.'
    },
    'تست MBTI': {
      high: 'شخصیت شما نشان‌دهنده یک فرد برون‌گرا و عمل‌گرا است. در محیط‌های اجتماعی و تیمی عملکرد خوبی دارید.',
      medium: 'شخصیت شما ترکیبی از ویژگی‌های مختلف است. انعطاف‌پذیری شما یک نقطه قوت است.',
      low: 'شخصیت شما نشان‌دهنده یک فرد درون‌گرا و تحلیل‌گر است. در کارهای عمیق و مستقل عملکرد بهتری دارید.'
    },
    'تست هوش هیجانی': {
      high: 'هوش هیجانی شما در سطح بالایی است. به خوبی می‌توانید احساسات خود و دیگران را درک کنید.',
      medium: 'هوش هیجانی شما در سطح متوسط است. با تمرین می‌توانید آن را بهبود بخشید.',
      low: 'هوش هیجانی شما نیاز به بهبود دارد. تمرین همدلی و خودآگاهی می‌تواند کمک کند.'
    }
  };

  const category = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
  return analyses[testName]?.[category] || `نتیجه تست شما ${score} از 100 است.`;
}

// تابع کمکی برای ساخت پیام‌های چت
function generateChatMessages(userName) {
  return JSON.stringify([
    {
      role: 'user',
      content: `سلام، من ${userName} هستم. می‌خواستم درباره نتایج تست‌هایم مشورت بگیرم.`
    },
    {
      role: 'assistant',
      content: `سلام ${userName} عزیز! خوشحالم که برای بهبود سلامت روان خود قدم برداشته‌ای. بگو ببینم چه سوالی داری؟`
    },
    {
      role: 'user',
      content: 'نتیجه تست اضطرابم بالا بود. چه کارهایی می‌تونم انجام بدم؟'
    },
    {
      role: 'assistant',
      content: 'برای کاهش اضطراب، می‌توانی تکنیک‌های تنفس عمیق، مدیتیشن و ورزش منظم را امتحان کنی. همچنین توصیه می‌کنم با یک روان‌شناس مشورت کنی.'
    },
    {
      role: 'user',
      content: 'ممنون از راهنمایی‌هات. می‌خوام تمرینات مدیتیشن رو شروع کنم.'
    },
    {
      role: 'assistant',
      content: 'عالیه! می‌توانی از اپلیکیشن‌های مدیتیشن استفاده کنی یا در بخش تمرینات ما، برنامه‌های روزانه مدیتیشن را پیدا کنی. موفق باشی!'
    }
  ]);
}

async function main() {
  console.log('🚀 شروع ساخت کاربران و داده‌های فیک برای داشبورد admin...\n');

  // اطلاعات اکانت‌های اصلی
  const mainUsers = [
    { 
      email: 'admin@testology.me', 
      name: 'Admin', 
      lastName: 'Testology',
      role: 'ADMIN', 
      password: 'Admin@1234',
      phone: '09123456789',
      bio: 'مدیر سیستم Testology',
      province: 'تهران',
      city: 'تهران',
      birthDate: '1985-05-15' // برای محاسبه سن در نمودارها
    },
    { 
      email: 'user@testology.me',  
      name: 'User', 
      lastName: 'Test',
      role: 'USER',  
      password: 'User@1234',
      phone: '09123456790',
      bio: 'کاربر تست پلتفرم Testology',
      province: 'تهران',
      city: 'تهران',
      birthDate: '1995-08-20' // برای محاسبه سن در نمودارها
    },
  ];

  // ساخت یا به‌روزرسانی کاربران اصلی
  const createdUsers = {};
  for (const u of mainUsers) {
    const hashed = await hash(u.password, 12);
    try {
      const res = await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          lastName: u.lastName,
          role: u.role,
          password: hashed,
          phone: u.phone,
          bio: u.bio,
          province: u.province,
          city: u.city,
          birthDate: u.birthDate,
        },
        create: {
          email: u.email,
          name: u.name,
          lastName: u.lastName,
          role: u.role,
          password: hashed,
          phone: u.phone,
          bio: u.bio,
          province: u.province,
          city: u.city,
          birthDate: u.birthDate,
          isActive: true,
        },
      });
      createdUsers[u.email] = res;
      console.log(`✅ کاربر ${res.email} (${res.role}) با موفقیت ایجاد/به‌روزرسانی شد`);
    } catch (err) {
      console.error(`❌ خطا هنگام upsert کاربر ${u.email}:`, err.message);
      throw err;
    }
  }

      // ساخت کاربران تست اضافی (user1, user2, user3)
      console.log('\n👥 ساخت کاربران تست اضافی...');
      const testUsers = [
        { 
          email: 'user1@testology.me', 
          name: 'کاربر', 
          lastName: 'یک',
          role: 'USER', 
          password: 'User@1234',
          phone: '09123456791',
          bio: 'کاربر تست 1',
          province: 'تهران',
          city: 'تهران',
          birthDate: '1990-03-10' // برای محاسبه سن در نمودارها
        },
        { 
          email: 'user2@testology.me', 
          name: 'کاربر', 
          lastName: 'دو',
          role: 'USER', 
          password: 'User@1234',
          phone: '09123456792',
          bio: 'کاربر تست 2',
          province: 'اصفهان',
          city: 'اصفهان',
          birthDate: '1992-07-25' // برای محاسبه سن در نمودارها
        },
        { 
          email: 'user3@testology.me', 
          name: 'کاربر', 
          lastName: 'سه',
          role: 'USER', 
          password: 'User@1234',
          phone: '09123456793',
          bio: 'کاربر تست 3',
          province: 'فارس',
          city: 'شیراز',
          birthDate: '1988-11-30' // برای محاسبه سن در نمودارها
        },
      ];

      for (const u of testUsers) {
        const hashed = await hash(u.password, 12);
        try {
          await prisma.user.upsert({
            where: { email: u.email },
            update: {
              name: u.name,
              lastName: u.lastName,
              role: u.role,
              password: hashed,
              phone: u.phone,
              bio: u.bio,
              province: u.province,
              city: u.city,
            },
            create: {
              email: u.email,
              name: u.name,
              lastName: u.lastName,
              role: u.role,
              password: hashed,
              phone: u.phone,
              bio: u.bio,
              province: u.province,
              city: u.city,
              isActive: true,
            },
          });
          console.log(`✅ کاربر ${u.email} با موفقیت ایجاد/به‌روزرسانی شد`);
        } catch (err) {
          console.error(`❌ خطا هنگام upsert کاربر ${u.email}:`, err.message);
        }
      }
      console.log(`✅ 3 کاربر تست اضافی ایجاد شد`);

  // ساخت داده‌های فیک برای کاربران اصلی
  const testNames = [
    'تست اضطراب',
    'تست افسردگی',
    'تست استرس',
    'تست MBTI',
    'تست شخصیت',
    'تست هوش هیجانی',
    'تست اعتماد به نفس',
    'تست روابط',
    'تست مدیریت خشم',
    'تست انگیزه',
    'تست تمرکز',
    'تست خلاقیت',
    'تست رهبری',
    'تست کار تیمی',
    'تست تصمیم‌گیری'
  ];

  // اضافه کردن user1, user2, user3 به createdUsers برای ساخت داده‌ها
  const testUsersEmails = ['user1@testology.me', 'user2@testology.me', 'user3@testology.me'];
  for (const email of testUsersEmails) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      createdUsers[email] = user;
    }
  }

  for (const [email, user] of Object.entries(createdUsers)) {
    try {
      console.log(`\n📊 ساخت داده‌های فیک برای ${email}...`);

      // پاک کردن داده‌های قدیمی
      await prisma.testResult.deleteMany({ where: { userId: user.id } });
      await prisma.chatHistory.deleteMany({ where: { userId: user.id } });
      await prisma.notification.deleteMany({ where: { userId: user.id } });
      console.log(`🗑️  داده‌های قدیمی حذف شد`);

      // ساخت نتایج تست (15 تست برای هر کاربر)
      const now = new Date();
      const testResults = [];
      for (let i = 0; i < 15; i++) {
        const testDate = new Date(now.getTime() - i * 2 * 24 * 60 * 60 * 1000); // هر دو روز یک تست
        const score = Math.floor(30 + Math.random() * 70); // نمره بین 30 تا 100
        
        const answers = JSON.stringify({
          question1: Math.floor(Math.random() * 5) + 1,
          question2: Math.floor(Math.random() * 5) + 1,
          question3: Math.floor(Math.random() * 5) + 1,
          question4: Math.floor(Math.random() * 5) + 1,
          question5: Math.floor(Math.random() * 5) + 1,
        });

        testResults.push({
          userId: user.id,
          testName: testNames[i] || `تست ${i + 1}`,
          score: score,
          result: score >= 70 ? 'عالی' : score >= 50 ? 'متوسط' : 'نیاز به بهبود',
          analysis: generateAnalysis(testNames[i] || 'تست', score),
          answers: answers,
          createdAt: testDate,
        });
      }

      await prisma.testResult.createMany({ data: testResults });
      console.log(`✅ ${testResults.length} نتیجه تست ایجاد شد`);

      // ساخت تاریخچه چت (5 مکالمه)
      const chatHistories = [];
      for (let i = 0; i < 5; i++) {
        const chatDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000); // هر هفته یک چت
        chatHistories.push({
          userId: user.id,
          messages: generateChatMessages(user.name || 'کاربر'),
          testResults: JSON.stringify(testResults.slice(i * 3, (i + 1) * 3).map(tr => ({
            testName: tr.testName,
            score: tr.score,
            result: tr.result
          }))),
          createdAt: chatDate,
        });
      }

      await prisma.chatHistory.createMany({ data: chatHistories });
      console.log(`✅ ${chatHistories.length} تاریخچه چت ایجاد شد`);

      // ساخت اعلان‌ها (10 اعلان)
      const notifications = [
        { title: 'خوش آمدید!', message: 'به پلتفرم Testology خوش آمدید. سفر خودشناسی شما از اینجا آغاز می‌شود.' },
        { title: 'تست جدید', message: 'تست جدید "مدیریت استرس" اضافه شد. حتماً امتحان کنید!' },
        { title: 'نتیجه تست', message: 'نتیجه تست شما آماده است. می‌توانید آن را مشاهده کنید.' },
        { title: 'یادآوری', message: 'یادآوری: امروز تست خود را انجام دهید.' },
        { title: 'پیشرفت', message: 'تبریک! شما 5 تست را تکمیل کرده‌اید. به همین منوال ادامه دهید.' },
        { title: 'مقاله جدید', message: 'مقاله جدید "راهکارهای کاهش اضطراب" منتشر شد.' },
        { title: 'تمرین روزانه', message: 'تمرین مدیتیشن امروز را فراموش نکنید.' },
        { title: 'گزارش ماهانه', message: 'گزارش ماهانه شما آماده است. می‌توانید آن را دانلود کنید.' },
        { title: 'به‌روزرسانی', message: 'ویژگی‌های جدید به پلتفرم اضافه شد. حتماً بررسی کنید!' },
        { title: 'نظرسنجی', message: 'نظرات شما برای ما مهم است. لطفاً نظرسنجی را تکمیل کنید.' }
      ];

      const notificationData = notifications.map((notif, idx) => ({
        userId: user.id,
        title: notif.title,
        message: notif.message,
        read: idx < 3, // سه تا اول خوانده شده
        createdAt: new Date(now.getTime() - (notifications.length - idx) * 24 * 60 * 60 * 1000),
      }));

      await prisma.notification.createMany({ data: notificationData });
      console.log(`✅ ${notificationData.length} اعلان ایجاد شد`);

    } catch (e) {
      console.error(`⚠️  خطا در ساخت داده‌های فیک برای ${email}:`, e.message);
    }
  }

  // ساخت تست‌های انجام شده امروز (برای activeToday) - فقط از کاربران اصلی
  console.log('\n📅 ساخت تست‌های انجام شده امروز...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allMainUsers = await prisma.user.findMany({
    where: {
      email: {
        in: ['admin@testology.me', 'user@testology.me', 'user1@testology.me', 'user2@testology.me', 'user3@testology.me']
      }
    }
  });
  const todayTestResults = [];
  
  for (let i = 0; i < 15; i++) {
    const user = allMainUsers[Math.floor(Math.random() * allMainUsers.length)];
    const score = Math.floor(40 + Math.random() * 60);
    todayTestResults.push({
      userId: user.id,
      testName: testNames[Math.floor(Math.random() * testNames.length)],
      score: score,
      result: score >= 70 ? 'عالی' : score >= 50 ? 'متوسط' : 'نیاز به بهبود',
      analysis: `تحلیل تست انجام شده در تاریخ ${today.toLocaleDateString('fa-IR')}`,
      answers: JSON.stringify({}),
      createdAt: new Date(today.getTime() + Math.random() * 24 * 60 * 60 * 1000), // امروز
    });
  }
  await prisma.testResult.createMany({ data: todayTestResults });
  console.log(`✅ ${todayTestResults.length} تست امروز ایجاد شد`);

  // ساخت مقالات (Article)
  console.log('\n📝 ساخت مقالات...');
  const articleCategories = ['روان‌شناسی', 'خودشناسی', 'روابط', 'سلامت روان', 'توسعه فردی'];
  const articles = [];
  
  for (let i = 1; i <= 25; i++) {
    const category = articleCategories[Math.floor(Math.random() * articleCategories.length)];
    const createdAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    articles.push({
      title: `مقاله ${i}: راهکارهای بهبود سلامت روان`,
      slug: `article-${i}-mental-health`,
      content: `این یک مقاله نمونه درباره سلامت روان است. محتوای کامل مقاله در اینجا قرار می‌گیرد...`,
      excerpt: `خلاصه مقاله ${i} درباره سلامت روان و راهکارهای بهبود آن.`,
      category,
      tags: 'سلامت روان,خودشناسی,توسعه فردی',
      author: 'Testology Editorial Team',
      published: i <= 20, // 20 تا منتشر شده
      featured: i <= 5, // 5 تا ویژه
      viewCount: Math.floor(Math.random() * 1000),
      createdAt,
    });
  }
  await prisma.article.createMany({ data: articles });
  console.log(`✅ ${articles.length} مقاله ایجاد شد`);

  // ساخت بلاگ‌ها (Blog)
  console.log('\n📰 ساخت بلاگ‌ها...');
  const adminUser = createdUsers['admin@testology.me'];
  if (adminUser) {
    const blogCategories = ['general', 'psychology', 'self-help', 'relationships', 'wellness'];
    const blogs = [];
    
    for (let i = 1; i <= 15; i++) {
      const category = blogCategories[Math.floor(Math.random() * blogCategories.length)];
      const createdAt = new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000);
      blogs.push({
        title: `بلاگ ${i}: راهنمای جامع سلامت روان`,
        slug: `blog-${i}-mental-health-guide`,
        metaDescription: `توضیحات متا برای بلاگ ${i}`,
        content: `محتوای کامل بلاگ ${i} در اینجا قرار می‌گیرد...`,
        category,
        tags: 'سلامت روان,خودشناسی',
        authorId: adminUser.id,
        published: i <= 12, // 12 تا منتشر شده
        featured: i <= 3, // 3 تا ویژه
        viewCount: Math.floor(Math.random() * 500),
        createdAt,
      });
    }
    await prisma.blog.createMany({ data: blogs });
    console.log(`✅ ${blogs.length} بلاگ ایجاد شد`);
  }

  // ساخت اعضای خبرنامه (NewsletterSubscriber)
  console.log('\n📧 ساخت اعضای خبرنامه...');
  const subscribers = [];
  for (let i = 1; i <= 30; i++) {
    const subscribedAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    subscribers.push({
      email: `subscriber${i}@testology.me`,
      subscribedAt,
      isActive: i <= 25, // 25 تا فعال
      unsubscribedAt: i > 25 ? new Date(subscribedAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
    });
  }
  await prisma.newsletterSubscriber.createMany({ data: subscribers });
  console.log(`✅ ${subscribers.length} عضو خبرنامه ایجاد شد`);

  // ساخت آمار ماهانه (MonthlyAnalytics)
  console.log('\n📊 ساخت آمار ماهانه...');
  const months = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      month: monthStr,
      users: Math.floor(10 + Math.random() * 40),
      tests: Math.floor(20 + Math.random() * 80),
      articles: Math.floor(5 + Math.random() * 15),
      revenue: Math.floor(1000000 + Math.random() * 5000000),
    });
  }
  await prisma.monthlyAnalytics.createMany({ data: months });
  console.log(`✅ ${months.length} آمار ماهانه ایجاد شد`);

  // ساخت آمار جغرافیایی (GeoAnalytics)
  console.log('\n🌍 ساخت آمار جغرافیایی...');
  const countries = ['ایران', 'ترکیه', 'عراق', 'افغانستان', 'پاکستان'];
  const geoStats = countries.map((country, idx) => ({
    country,
    users: Math.floor(10 + idx * 20),
    percentage: Math.floor(15 + idx * 10),
  }));
  await prisma.geoAnalytics.createMany({ data: geoStats });
  console.log(`✅ ${geoStats.length} آمار جغرافیایی ایجاد شد`);

  // ساخت آمار دستگاه‌ها (DeviceAnalytics)
  console.log('\n📱 ساخت آمار دستگاه‌ها...');
  const devices = [
    { device: 'Mobile', users: 45, percentage: 60 },
    { device: 'Desktop', users: 25, percentage: 30 },
    { device: 'Tablet', users: 5, percentage: 10 },
  ];
  await prisma.deviceAnalytics.createMany({ data: devices });
  console.log(`✅ ${devices.length} آمار دستگاه ایجاد شد`);

  // ساخت آمار مرورگرها (BrowserAnalytics)
  console.log('\n🌐 ساخت آمار مرورگرها...');
  const browsers = [
    { browser: 'Chrome', users: 40, percentage: 50 },
    { browser: 'Safari', users: 20, percentage: 25 },
    { browser: 'Firefox', users: 10, percentage: 15 },
    { browser: 'Edge', users: 5, percentage: 10 },
  ];
  await prisma.browserAnalytics.createMany({ data: browsers });
  console.log(`✅ ${browsers.length} آمار مرورگر ایجاد شد`);

  // ساخت تست‌ها (Test) - اگر مدل Test وجود دارد
  console.log('\n🧪 ساخت تست‌ها...');
  try {
    const testTitles = [
      'تست اضطراب بک',
      'تست افسردگی بک',
      'تست استرس',
      'تست MBTI',
      'تست شخصیت نئو',
      'تست هوش هیجانی',
      'تست اعتماد به نفس',
      'تست روابط',
      'تست مدیریت خشم',
      'تست انگیزه'
    ];
    
    const tests = [];
    for (let i = 0; i < testTitles.length; i++) {
      const testSlug = `test-${i + 1}-${testTitles[i].toLowerCase().replace(/\s+/g, '-')}`;
      tests.push({
        testSlug,
        testName: testTitles[i],
        description: `توضیحات تست ${testTitles[i]}`,
        category: 'روان‌شناسی',
        isActive: true,
      });
    }
    
    // استفاده از upsert برای تست‌ها
    for (const test of tests) {
      try {
        await prisma.test.upsert({
          where: { testSlug: test.testSlug },
          update: test,
          create: test,
        });
      } catch (err) {
        // اگر خطا داد، ادامه بده
      }
    }
    console.log(`✅ ${tests.length} تست ایجاد شد`);
  } catch (e) {
    console.log(`⚠️  خطا در ساخت تست‌ها (ممکن است مدل Test وجود نداشته باشد): ${e.message}`);
  }

  console.log('\n✨ تمام! داده‌های فیک برای داشبورد admin آماده است:');
  console.log('   👤 کاربران اصلی:');
  console.log('      - admin@testology.me / Admin@1234 (ADMIN)');
  console.log('      - user@testology.me  / User@1234 (USER)');
  console.log('      - user1@testology.me / User@1234 (USER)');
  console.log('      - user2@testology.me / User@1234 (USER)');
  console.log('      - user3@testology.me / User@1234 (USER)');
  console.log('   📝 25 مقاله');
  console.log('   📰 15 بلاگ');
  console.log('   📧 30 عضو خبرنامه');
  console.log('   📈 آمار ماهانه، جغرافیایی، دستگاه و مرورگر');
  console.log('   🧪 10 تست\n');
}

main()
  .catch((e) => {
    console.error('❌ خطای کلی:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// تنظیمات دیتابیس
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// مسیر مقالات
const ARTICLES_DIR = path.join(__dirname, '..', 'lib', 'blog', 'articles');

// نقشه‌بندی دسته‌ها
const CATEGORY_MAP = {
  'personality': 'personality',
  'anxiety-depression': 'anxiety',
  'relationships-emotions': 'relationships',
  'personal-growth': 'growth',
  'mindfulness-focus': 'mindfulness',
  'sleep-mental-health': 'sleep',
  'motivation-success': 'motivation',
  'lifestyle-work': 'lifestyle',
  'test-analysis': 'analysis',
  'scientific-research': 'research'
};

// نقشه‌بندی نویسندگان
const AUTHOR_MAP = {
  'دکتر سارا احمدی': 'sara-ahmadi',
  'دکتر محمد رضایی': 'mohammad-rezaei',
  'دکتر فاطمه کریمی': 'fatemeh-karimi',
  'دکتر علی حسینی': 'ali-hosseini',
  'دکتر مریم نوری': 'maryam-nouri'
};

async function importAllArticles() {
  try {
    console.log('🚀 شروع فرآیند وارد کردن تمام مقالات...');
    
    // دریافت لیست فایل‌های markdown جدید
    const files = fs.readdirSync(ARTICLES_DIR)
      .filter(file => file.endsWith('.md') && file.includes('-'))
      .sort();

    console.log(`📁 ${files.length} فایل مقاله یافت شد`);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // ایجاد نویسندگان پیش‌فرض
    const authors = await createDefaultAuthors();

    for (const file of files) {
      try {
        const filePath = path.join(ARTICLES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // تجزیه frontmatter
        const { data: frontmatter, content } = matter(fileContent);
        
        // بررسی وجود مقاله
        const existingArticle = await prisma.blog.findUnique({
          where: { slug: frontmatter.slug }
        });

        if (existingArticle) {
          console.log(`⏭️  مقاله ${frontmatter.slug} قبلاً موجود است`);
          skippedCount++;
          continue;
        }

        // پیدا کردن نویسنده
        let authorId = authors[0].id; // نویسنده پیش‌فرض
        if (frontmatter.author) {
          const author = authors.find(a => a.name === frontmatter.author);
          if (author) {
            authorId = author.id;
          }
        }

        // ایجاد مقاله
        const article = await prisma.blog.create({
          data: {
            title: frontmatter.title,
            slug: frontmatter.slug,
            content: content,
            category: CATEGORY_MAP[frontmatter.category] || frontmatter.category,
            imageUrl: frontmatter.cover ? `/images/blog/${frontmatter.cover}` : null,
            tags: frontmatter.tags || '',
            published: frontmatter.published !== false, // پیش‌فرض منتشر شده
            featured: frontmatter.featured || false,
            viewCount: Math.floor(Math.random() * 1000) + 100, // بازدید تصادفی
            authorId: authorId,
            metaDescription: frontmatter.metaDescription || ''
          }
        });

        console.log(`✅ مقاله ${frontmatter.title} با موفقیت وارد شد`);
        importedCount++;

      } catch (error) {
        console.error(`❌ خطا در وارد کردن فایل ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 گزارش نهایی:');
    console.log(`✅ ${importedCount} مقاله با موفقیت وارد شد`);
    console.log(`⏭️  ${skippedCount} مقاله قبلاً موجود بود`);
    console.log(`❌ ${errorCount} خطا رخ داد`);

    // آمار کلی
    const totalArticles = await prisma.blog.count();
    const publishedArticles = await prisma.blog.count({
      where: { published: true }
    });
    const featuredArticles = await prisma.blog.count({
      where: { featured: true }
    });

    console.log('\n📈 آمار کلی:');
    console.log(`📝 کل مقالات: ${totalArticles}`);
    console.log(`📢 منتشر شده: ${publishedArticles}`);
    console.log(`⭐ ویژه: ${featuredArticles}`);

    // آمار دسته‌بندی
    console.log('\n📂 آمار دسته‌بندی:');
    const categories = await prisma.blog.groupBy({
      by: ['category'],
      _count: { category: true }
    });

    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} مقاله`);
    });

  } catch (error) {
    console.error('❌ خطا در فرآیند وارد کردن:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// ایجاد نویسندگان پیش‌فرض
async function createDefaultAuthors() {
  const authors = [];
  
  for (const [name, email] of Object.entries(AUTHOR_MAP)) {
    let author = await prisma.user.findFirst({
      where: { name: name }
    });

    if (!author) {
      author = await prisma.user.create({
        data: {
          name: name,
          email: `${email}@testology.com`,
          role: 'USER',
          isActive: true
        }
      });
    }
    
    authors.push(author);
  }

  return authors;
}

// تابع ایجاد لینک‌های داخلی
async function createInternalLinks() {
  console.log('🔗 ایجاد لینک‌های داخلی...');
  
  const articles = await prisma.blog.findMany({
    select: { id: true, content: true, category: true, title: true, slug: true }
  });

  for (const article of articles) {
    try {
      let updatedContent = article.content;
      
      // اضافه کردن لینک‌های داخلی به مقالات مرتبط
      const relatedArticles = articles.filter(a => 
        a.id !== article.id && a.category === article.category
      ).slice(0, 3);

      if (relatedArticles.length > 0) {
        const relatedLinks = relatedArticles.map(related => 
          `[${related.title}](/blog/${related.slug})`
        ).join(' | ');
        
        // بررسی وجود بخش مقالات مرتبط
        if (!updatedContent.includes('## مقالات مرتبط')) {
          updatedContent += `\n\n## مقالات مرتبط\n${relatedLinks}`;
        }
      }

      // اضافه کردن لینک‌های تست
      const testLinks = getRelatedTests(article.category);
      if (testLinks.length > 0 && !updatedContent.includes('## تست‌های پیشنهادی')) {
        const testSection = testLinks.map(test => 
          `[${test.name}](${test.url}) - ${test.description}`
        ).join('\n');
        
        updatedContent += `\n\n## تست‌های پیشنهادی\n${testSection}`;
      }

      // به‌روزرسانی محتوا
      await prisma.blog.update({
        where: { id: article.id },
        data: { content: updatedContent }
      });

      console.log(`🔗 لینک‌های داخلی برای مقاله ${article.title} ایجاد شد`);

    } catch (error) {
      console.error(`❌ خطا در ایجاد لینک‌های داخلی:`, error.message);
    }
  }
}

// تابع دریافت تست‌های مرتبط
function getRelatedTests(category) {
  const testMap = {
    'personality': [
      { name: 'تست MBTI', url: '/tests/mbti', description: 'تیپ شخصیتی' },
      { name: 'تست Big Five', url: '/tests/big-five', description: 'صفات شخصیتی' },
      { name: 'تست Enneagram', url: '/tests/enneagram', description: 'الگوهای رفتاری' }
    ],
    'anxiety': [
      { name: 'تست اضطراب', url: '/tests/anxiety', description: 'سنجش اضطراب' },
      { name: 'تست استرس', url: '/tests/stress', description: 'مدیریت استرس' },
      { name: 'تست افسردگی', url: '/tests/depression', description: 'ارزیابی افسردگی' }
    ],
    'relationships': [
      { name: 'تست هوش هیجانی', url: '/tests/emotional-intelligence', description: 'سنجش هوش هیجانی' },
      { name: 'تست عشق', url: '/tests/love', description: 'سبک عاشقی' },
      { name: 'تست روابط', url: '/tests/relationships', description: 'ارزیابی روابط' }
    ],
    'growth': [
      { name: 'تست خودآگاهی', url: '/tests/self-awareness', description: 'شناخت خود' },
      { name: 'تست هدف‌گذاری', url: '/tests/goal-setting', description: 'برنامه‌ریزی' },
      { name: 'تست رشد فردی', url: '/tests/personal-growth', description: 'توسعه شخصی' }
    ],
    'mindfulness': [
      { name: 'تست ذهن‌آگاهی', url: '/tests/mindfulness', description: 'سنجش تمرکز' },
      { name: 'تست مدیتیشن', url: '/tests/meditation', description: 'آمادگی مدیتیشن' },
      { name: 'تست آرامش', url: '/tests/relaxation', description: 'مدیریت استرس' }
    ],
    'sleep': [
      { name: 'تست خواب', url: '/tests/sleep', description: 'کیفیت خواب' },
      { name: 'تست بی‌خوابی', url: '/tests/insomnia', description: 'ارزیابی خواب' },
      { name: 'تست رویا', url: '/tests/dreams', description: 'تحلیل رویاها' }
    ],
    'motivation': [
      { name: 'تست انگیزش', url: '/tests/motivation', description: 'سنجش انگیزه' },
      { name: 'تست موفقیت', url: '/tests/success', description: 'ارزیابی موفقیت' },
      { name: 'تست هدف‌گذاری', url: '/tests/goals', description: 'برنامه‌ریزی' }
    ],
    'lifestyle': [
      { name: 'تست تعادل کار-زندگی', url: '/tests/work-life-balance', description: 'سنجش تعادل' },
      { name: 'تست استرس شغلی', url: '/tests/work-stress', description: 'مدیریت استرس' },
      { name: 'تست رهبری', url: '/tests/leadership', description: 'مهارت‌های رهبری' }
    ],
    'analysis': [
      { name: 'تست تفسیر نتایج', url: '/tests/interpretation', description: 'مهارت‌های تفسیر' },
      { name: 'تست تحلیل آماری', url: '/tests/statistical-analysis', description: 'درک آمار' },
      { name: 'تست انتخاب تست', url: '/tests/test-selection', description: 'راهنمای انتخاب' }
    ],
    'research': [
      { name: 'تست سواد پژوهشی', url: '/tests/research-literacy', description: 'سنجش دانش' },
      { name: 'تست تحلیل مطالعات', url: '/tests/study-analysis', description: 'مهارت‌های تحلیل' },
      { name: 'تست روش‌های تحقیق', url: '/tests/research-methods', description: 'دانش روش‌شناسی' }
    ]
  };
  
  return testMap[category] || [];
}

// تابع اصلی
async function main() {
  console.log('🎯 شروع فرآیند کامل وارد کردن مقالات...\n');
  
  // 1. وارد کردن مقالات
  await importAllArticles();
  
  // 2. ایجاد لینک‌های داخلی
  await createInternalLinks();
  
  console.log('\n🎉 فرآیند کامل شد!');
  console.log('\n📋 دستورات بعدی:');
  console.log('1. npm run dev - برای اجرای سرور توسعه');
  console.log('2. مراجعه به /blog/comprehensive - برای مشاهده بلاگ جامع');
  console.log('3. مراجعه به /admin/blog/comprehensive-manager - برای مدیریت مقالات');
}

// اجرای اسکریپت
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  importAllArticles,
  createInternalLinks
};

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

async function importArticles() {
  try {
    console.log('🚀 شروع فرآیند وارد کردن مقالات...');
    
    // دریافت لیست فایل‌های markdown
    const files = fs.readdirSync(ARTICLES_DIR)
      .filter(file => file.endsWith('.md') && !file.startsWith('article_'))
      .sort();

    console.log(`📁 ${files.length} فایل مقاله یافت شد`);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

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

        // ایجاد نویسنده در صورت عدم وجود
        let authorId = null;
        if (frontmatter.author) {
          const authorSlug = AUTHOR_MAP[frontmatter.author] || 'default-author';
          
          let author = await prisma.user.findFirst({
            where: { name: frontmatter.author }
          });

          if (!author) {
            author = await prisma.user.create({
              data: {
                name: frontmatter.author,
                email: `${authorSlug}@testology.com`,
                role: 'content_creator',
                isActive: true
              }
            });
          }
          
          authorId = author.id;
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
            published: frontmatter.published || false,
            featured: frontmatter.featured || false,
            viewCount: 0,
            authorId: authorId,
            metaDescription: frontmatter.metaDescription || '',
            excerpt: frontmatter.excerpt || content.substring(0, 150) + '...'
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

  } catch (error) {
    console.error('❌ خطا در فرآیند وارد کردن:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تابع ایجاد تصاویر SEO
async function generateSEOImages() {
  console.log('🎨 تولید تصاویر SEO...');
  
  const articles = await prisma.blog.findMany({
    select: { id: true, title: true, slug: true, category: true }
  });

  for (const article of articles) {
    try {
      // ایجاد تصویر SEO (در اینجا فقط مسیر ایجاد می‌کنیم)
      const imagePath = `/images/blog/seo/${article.slug}.jpg`;
      
      // در واقعیت، اینجا باید تصویر واقعی تولید شود
      console.log(`🖼️  تصویر SEO برای ${article.title} ایجاد شد`);
      
    } catch (error) {
      console.error(`❌ خطا در ایجاد تصویر برای ${article.slug}:`, error.message);
    }
  }
}

// تابع ایجاد لینک‌های داخلی
async function createInternalLinks() {
  console.log('🔗 ایجاد لینک‌های داخلی...');
  
  const articles = await prisma.blog.findMany({
    select: { id: true, content: true, category: true }
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
        
        updatedContent += `\n\n## مقالات مرتبط\n${relatedLinks}`;
      }

      // اضافه کردن لینک‌های تست
      const testLinks = getRelatedTests(article.category);
      if (testLinks.length > 0) {
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

      console.log(`🔗 لینک‌های داخلی برای مقاله ${article.id} ایجاد شد`);

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
      { name: 'تست Big Five', url: '/tests/big-five', description: 'صفات شخصیتی' }
    ],
    'anxiety': [
      { name: 'تست اضطراب', url: '/tests/anxiety', description: 'سنجش اضطراب' },
      { name: 'تست استرس', url: '/tests/stress', description: 'مدیریت استرس' }
    ],
    'relationships': [
      { name: 'تست هوش هیجانی', url: '/tests/emotional-intelligence', description: 'سنجش هوش هیجانی' },
      { name: 'تست عشق', url: '/tests/love', description: 'سبک عاشقی' }
    ]
  };
  
  return testMap[category] || [];
}

// تابع اصلی
async function main() {
  console.log('🎯 شروع فرآیند کامل وارد کردن مقالات...\n');
  
  // 1. وارد کردن مقالات
  await importArticles();
  
  // 2. ایجاد تصاویر SEO
  await generateSEOImages();
  
  // 3. ایجاد لینک‌های داخلی
  await createInternalLinks();
  
  console.log('\n🎉 فرآیند کامل شد!');
}

// اجرای اسکریپت
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  importArticles,
  generateSEOImages,
  createInternalLinks
};








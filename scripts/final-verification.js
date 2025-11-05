const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalVerification() {
  try {
    console.log('🔍 بررسی نهایی همه مقالات...\n');
    
    // دریافت همه مقالات
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });
    
    console.log(`📝 بررسی ${blogs.length} مقاله...\n`);
    
    let totalHashCount = 0;
    let articlesWithHash = 0;
    let articlesWithHashtags = 0;
    
    for (const blog of blogs) {
      // بررسی وجود علامت #
      const hashCount = (blog.content.match(/#/g) || []).length;
      totalHashCount += hashCount;
      
      if (hashCount > 0) {
        articlesWithHash++;
        console.log(`❌ ${blog.title}: ${hashCount} علامت #`);
      }
      
      // بررسی تگ‌های #
      const hashtags = blog.content.match(/#[\w\u0600-\u06FF\s]+/g);
      if (hashtags && hashtags.length > 0) {
        articlesWithHashtags++;
        console.log(`🏷️ ${blog.title}: ${hashtags.length} تگ #`);
        console.log(`   تگ‌ها: ${hashtags.join(', ')}`);
      }
    }
    
    console.log(`\n📊 گزارش کلی:`);
    console.log(`📝 کل مقالات: ${blogs.length}`);
    console.log(`❌ مقالات با علامت #: ${articlesWithHash}`);
    console.log(`🏷️ مقالات با تگ #: ${articlesWithHashtags}`);
    console.log(`🔢 کل علامت‌های #: ${totalHashCount}`);
    
    if (totalHashCount === 0) {
      console.log(`\n🎉 موفقیت! همه علامت‌های # حذف شده‌اند!`);
    } else {
      console.log(`\n⚠️ هنوز ${totalHashCount} علامت # باقی مانده است.`);
    }
    
    // تست نمونه خاص
    console.log(`\n🧪 تست نمونه خاص:`);
    const specificBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'development-planning-test-evaluation'
      }
    });
    
    if (specificBlog) {
      console.log(`📋 مقاله: ${specificBlog.title}`);
      console.log(`📄 محتوای کامل:`);
      console.log('='.repeat(80));
      console.log(specificBlog.content);
      console.log('='.repeat(80));
      
      // بررسی دقیق
      const hasHash = specificBlog.content.includes('#');
      const hashtags = specificBlog.content.match(/#[\w\u0600-\u06FF\s]+/g);
      
      console.log(`\n🔍 بررسی دقیق:`);
      console.log(`علامت #: ${hasHash ? '❌ وجود دارد' : '✅ حذف شده'}`);
      console.log(`تگ‌های #: ${hashtags ? hashtags.length : 0} مورد`);
      
      if (hashtags) {
        console.log(`تگ‌ها: ${hashtags.join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('❌ خطا در بررسی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalVerification();








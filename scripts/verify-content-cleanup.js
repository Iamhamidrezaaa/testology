const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyContentCleanup() {
  try {
    console.log('🔍 بررسی نهایی محتوای مقالات...\n');
    
    // دریافت نمونه مقالات
    const sampleBlogs = await prisma.blog.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });
    
    console.log(`📝 بررسی ${sampleBlogs.length} مقاله نمونه...\n`);
    
    let totalHashCount = 0;
    let articlesWithHash = 0;
    
    for (const blog of sampleBlogs) {
      console.log(`📋 مقاله: ${blog.title}`);
      console.log(`🔗 Slug: ${blog.slug}`);
      
      // بررسی وجود علامت #
      const hashCount = (blog.content.match(/#/g) || []).length;
      totalHashCount += hashCount;
      
      if (hashCount > 0) {
        articlesWithHash++;
        console.log(`❌ علامت #: ${hashCount} مورد`);
      } else {
        console.log(`✅ علامت #: حذف شده`);
      }
      
      // نمایش نمونه محتوا
      console.log(`📄 نمونه محتوا:`);
      console.log(blog.content.substring(0, 300) + '...');
      console.log('='.repeat(80));
    }
    
    console.log(`\n📊 گزارش کلی:`);
    console.log(`📝 مقالات بررسی شده: ${sampleBlogs.length}`);
    console.log(`❌ مقالات با علامت #: ${articlesWithHash}`);
    console.log(`✅ مقالات بدون علامت #: ${sampleBlogs.length - articlesWithHash}`);
    console.log(`🔢 کل علامت‌های #: ${totalHashCount}`);
    
    if (totalHashCount === 0) {
      console.log(`\n🎉 موفقیت! همه علامت‌های # حذف شده‌اند!`);
    } else {
      console.log(`\n⚠️ هنوز ${totalHashCount} علامت # باقی مانده است.`);
    }
    
    // بررسی فرمت کلی
    console.log(`\n🔍 بررسی فرمت کلی:`);
    const allBlogs = await prisma.blog.findMany({
      select: { content: true }
    });
    
    let totalHashes = 0;
    for (const blog of allBlogs) {
      const hashes = (blog.content.match(/#/g) || []).length;
      totalHashes += hashes;
    }
    
    console.log(`📊 کل مقالات: ${allBlogs.length}`);
    console.log(`🔢 کل علامت‌های # در همه مقالات: ${totalHashes}`);
    
    if (totalHashes === 0) {
      console.log(`\n🎉 عالی! همه مقالات تمیز شده‌اند!`);
    } else {
      console.log(`\n⚠️ هنوز ${totalHashes} علامت # در کل مقالات وجود دارد.`);
    }
    
  } catch (error) {
    console.error('❌ خطا در بررسی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyContentCleanup();








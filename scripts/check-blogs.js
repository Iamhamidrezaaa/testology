const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBlogs() {
  try {
    console.log('🔍 بررسی مقالات در دیتابیس...\n');
    
    // شمارش کل مقالات
    const totalBlogs = await prisma.blog.count();
    console.log(`📊 کل مقالات: ${totalBlogs}`);
    
    // شمارش مقالات منتشر شده
    const publishedBlogs = await prisma.blog.count({
      where: { published: true }
    });
    console.log(`✅ مقالات منتشر شده: ${publishedBlogs}`);
    
    // شمارش مقالات پیش‌نویس
    const draftBlogs = await prisma.blog.count({
      where: { published: false }
    });
    console.log(`📝 مقالات پیش‌نویس: ${draftBlogs}`);
    
    // آمار دسته‌بندی‌ها
    const categories = await prisma.blog.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });
    
    console.log('\n📂 آمار دسته‌بندی‌ها:');
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} مقاله`);
    });
    
    // نمونه مقالات
    const sampleBlogs = await prisma.blog.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        published: true,
        viewCount: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n📋 نمونه مقالات:');
    sampleBlogs.forEach(blog => {
      console.log(`  - ${blog.title} (${blog.category}) - ${blog.published ? 'منتشر' : 'پیش‌نویس'} - ${blog.viewCount} بازدید`);
    });
    
    // بررسی نویسندگان
    const authors = await prisma.user.findMany({
      where: {
        blogs: {
          some: {}
        }
      },
      select: {
        name: true,
        email: true,
        _count: {
          select: {
            blogs: true
          }
        }
      }
    });
    
    console.log('\n👥 نویسندگان:');
    authors.forEach(author => {
      console.log(`  ${author.name} (${author.email}): ${author._count.blogs} مقاله`);
    });
    
  } catch (error) {
    console.error('❌ خطا در بررسی مقالات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogs();








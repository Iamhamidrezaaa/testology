const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalDashboardCheck() {
  try {
    console.log('🔍 بررسی نهایی داشبورد...\n');
    
    // بررسی مقالات در دیتابیس
    console.log('📊 بررسی مقالات در دیتابیس:');
    const totalBlogs = await prisma.blog.count();
    const publishedBlogs = await prisma.blog.count({ where: { published: true } });
    const featuredBlogs = await prisma.blog.count({ where: { featured: true } });
    const totalViews = await prisma.blog.aggregate({
      _sum: { viewCount: true }
    });
    
    console.log(`📝 کل مقالات: ${totalBlogs}`);
    console.log(`✅ منتشر شده: ${publishedBlogs}`);
    console.log(`⭐ ویژه: ${featuredBlogs}`);
    console.log(`👁️ کل بازدید: ${totalViews._sum.viewCount || 0}`);
    
    // تست API endpoint
    console.log('\n🌐 تست API endpoint:');
    try {
      const response = await fetch('http://localhost:3001/api/admin/blog-public');
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API Status: ${response.status}`);
        console.log(`📊 مقالات دریافتی: ${data.blogs ? data.blogs.length : 0}`);
        
        if (data.blogs && data.blogs.length > 0) {
          console.log('\n📋 نمونه مقالات از API:');
          data.blogs.slice(0, 5).forEach((blog, index) => {
            console.log(`${index + 1}. ${blog.title}`);
            console.log(`   Author: ${blog.author}`);
            console.log(`   Published: ${blog.published}`);
            console.log(`   Featured: ${blog.featured}`);
            console.log(`   View Count: ${blog.viewCount}`);
            console.log('');
          });
        }
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ API Connection Error: ${error.message}`);
    }
    
    // بررسی فرمت محتوا
    console.log('\n📝 بررسی فرمت محتوا:');
    const sampleBlog = await prisma.blog.findFirst({
      where: { slug: 'development-planning-test-evaluation' }
    });
    
    if (sampleBlog) {
      console.log(`📋 مقاله نمونه: ${sampleBlog.title}`);
      
      // بررسی وجود علامت #
      const hasHash = sampleBlog.content.includes('#');
      console.log(`🔍 علامت # در محتوا: ${hasHash ? '❌ وجود دارد' : '✅ حذف شده'}`);
      
      // بررسی تگ‌های #
      const hashtags = sampleBlog.content.match(/#[\w\u0600-\u06FF\s]+/g);
      console.log(`🏷️ تگ‌های # در محتوا: ${hashtags ? hashtags.length : 0} مورد`);
      
      // بررسی فرمت پاراگراف‌ها
      const paragraphs = sampleBlog.content.split('\n\n').filter(p => p.trim().length > 0);
      console.log(`📄 تعداد پاراگراف‌ها: ${paragraphs.length}`);
      
      // نمایش نمونه محتوا
      console.log('\n📄 نمونه محتوا (200 کاراکتر اول):');
      console.log(sampleBlog.content.substring(0, 200) + '...');
    }
    
    // بررسی آمار کلی
    console.log('\n📊 آمار کلی سیستم:');
    const categories = await prisma.blog.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    
    console.log('دسته‌بندی مقالات:');
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} مقاله`);
    });
    
    // بررسی مقالات اخیر
    console.log('\n📅 مقالات اخیر:');
    const recentBlogs = await prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        createdAt: true,
        published: true,
        featured: true
      }
    });
    
    recentBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title}`);
      console.log(`   تاریخ: ${blog.createdAt.toLocaleDateString('fa-IR')}`);
      console.log(`   منتشر شده: ${blog.published ? '✅' : '❌'}`);
      console.log(`   ویژه: ${blog.featured ? '⭐' : '❌'}`);
      console.log('');
    });
    
    console.log('🎉 بررسی کامل شد!');
    
  } catch (error) {
    console.error('❌ خطا در بررسی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalDashboardCheck();








const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminAPI() {
  try {
    console.log('🧪 تست API داشبورد ادمین...\n');
    
    // تست مستقیم دیتابیس
    console.log('📊 بررسی مقالات در دیتابیس:');
    const blogs = await prisma.blog.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        featured: true,
        viewCount: true,
        tags: true,
        createdAt: true
      }
    });
    
    console.log(`📝 تعداد مقالات: ${blogs.length}`);
    
    if (blogs.length > 0) {
      console.log('\n📋 نمونه مقالات:');
      blogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title}`);
        console.log(`   Slug: ${blog.slug}`);
        console.log(`   Published: ${blog.published}`);
        console.log(`   Featured: ${blog.featured}`);
        console.log(`   View Count: ${blog.viewCount}`);
        console.log(`   Tags: ${blog.tags}`);
        console.log(`   Created: ${blog.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ هیچ مقاله‌ای در دیتابیس یافت نشد!');
    }
    
    // تست API endpoint
    console.log('🌐 تست API endpoint:');
    try {
      const response = await fetch('http://localhost:3001/api/admin/blog-public');
      const data = await response.json();
      
      if (data.blogs && Array.isArray(data.blogs)) {
        console.log(`✅ API کار می‌کند - ${data.blogs.length} مقاله دریافت شد`);
        
        if (data.blogs.length > 0) {
          console.log('\n📋 نمونه از API:');
          data.blogs.slice(0, 3).forEach((blog, index) => {
            console.log(`${index + 1}. ${blog.title}`);
            console.log(`   Author: ${blog.author}`);
            console.log(`   Published: ${blog.published}`);
            console.log(`   Tags: ${JSON.stringify(blog.tags)}`);
          });
        }
      } else {
        console.log('❌ API پاسخ نامعتبر برمی‌گرداند');
        console.log('Response:', data);
      }
    } catch (error) {
      console.log('❌ خطا در فراخوانی API:', error.message);
    }
    
    // بررسی آمار کلی
    console.log('\n📊 آمار کلی:');
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
    
  } catch (error) {
    console.error('❌ خطا در تست:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAPI();








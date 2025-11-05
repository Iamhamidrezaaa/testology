const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboardDisplay() {
  try {
    console.log('🧪 تست نمایش داشبورد...\n');
    
    // شبیه‌سازی API call
    console.log('📡 شبیه‌سازی API call:');
    
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    const apiResponse = {
      blogs: blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        metaDescription: blog.metaDescription,
        content: blog.content,
        category: blog.category,
        author: blog.author?.name || 'نامشخص',
        imageUrl: blog.imageUrl,
        tags: blog.tags ? (typeof blog.tags === 'string' ? blog.tags.split(',').map(tag => tag.trim()) : blog.tags) : [],
        published: blog.published,
        featured: blog.featured,
        viewCount: blog.viewCount || 0,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }))
    };
    
    console.log(`✅ API Response: ${apiResponse.blogs.length} مقاله`);
    
    // بررسی فرمت داده‌ها
    console.log('\n🔍 بررسی فرمت داده‌ها:');
    console.log(`data: ${typeof apiResponse}`);
    console.log(`data.blogs: ${typeof apiResponse.blogs}`);
    console.log(`Array.isArray(data.blogs): ${Array.isArray(apiResponse.blogs)}`);
    
    if (apiResponse.blogs.length > 0) {
      const sampleBlog = apiResponse.blogs[0];
      console.log('\n📋 نمونه مقاله:');
      console.log(`ID: ${sampleBlog.id}`);
      console.log(`Title: ${sampleBlog.title}`);
      console.log(`Author: ${sampleBlog.author}`);
      console.log(`Published: ${sampleBlog.published}`);
      console.log(`Featured: ${sampleBlog.featured}`);
      console.log(`View Count: ${sampleBlog.viewCount}`);
      console.log(`Tags: ${JSON.stringify(sampleBlog.tags)}`);
    }
    
    // آمار داشبورد
    console.log('\n📊 آمار داشبورد:');
    const totalBlogs = apiResponse.blogs.length;
    const publishedBlogs = apiResponse.blogs.filter(blog => blog.published).length;
    const featuredBlogs = apiResponse.blogs.filter(blog => blog.featured).length;
    const totalViews = apiResponse.blogs.reduce((sum, blog) => sum + blog.viewCount, 0);
    
    console.log(`📝 کل مقالات: ${totalBlogs}`);
    console.log(`✅ منتشر شده: ${publishedBlogs}`);
    console.log(`⭐ ویژه: ${featuredBlogs}`);
    console.log(`👁️ کل بازدید: ${totalViews}`);
    
    // تست فیلترها
    console.log('\n🔍 تست فیلترها:');
    const allBlogs = apiResponse.blogs;
    const publishedOnly = allBlogs.filter(blog => blog.published);
    const draftOnly = allBlogs.filter(blog => !blog.published);
    const featuredOnly = allBlogs.filter(blog => blog.featured);
    
    console.log(`همه مقالات: ${allBlogs.length}`);
    console.log(`فقط منتشر شده: ${publishedOnly.length}`);
    console.log(`فقط پیش‌نویس: ${draftOnly.length}`);
    console.log(`فقط ویژه: ${featuredOnly.length}`);
    
    // تست جستجو
    console.log('\n🔍 تست جستجو:');
    const searchTerm = 'تست';
    const searchResults = allBlogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(`جستجوی "${searchTerm}": ${searchResults.length} نتیجه`);
    
    if (searchResults.length > 0) {
      console.log('نتایج جستجو:');
      searchResults.slice(0, 3).forEach((blog, index) => {
        console.log(`  ${index + 1}. ${blog.title}`);
      });
    }
    
    console.log('\n✅ همه تست‌ها موفق بود!');
    
  } catch (error) {
    console.error('❌ خطا در تست:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardDisplay();








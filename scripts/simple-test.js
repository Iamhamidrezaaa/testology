const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBlogAPI() {
  try {
    console.log('🧪 تست مستقیم API logic...\n');
    
    // شبیه‌سازی API /api/articles
    console.log('1️⃣ تست logic /api/articles...');
    const articles = await prisma.blog.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log(`✅ مقالات یافت شد: ${articles.length}`);
    
    if (articles.length > 0) {
      const formattedArticles = articles.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.metaDescription || blog.content.substring(0, 150) + '...',
        category: blog.category,
        author: blog.author?.name || 'نامشخص',
        coverUrl: blog.imageUrl,
        featured: blog.featured,
        viewCount: blog.viewCount || 0,
        createdAt: blog.createdAt,
        tags: blog.tags ? (typeof blog.tags === 'string' ? blog.tags.split(',').map(tag => tag.trim()) : blog.tags) : []
      }));
      
      console.log(`📋 نمونه مقالات:`);
      formattedArticles.slice(0, 3).forEach(article => {
        console.log(`  - ${article.title} (${article.category})`);
      });
    }
    
  } catch (error) {
    console.error('❌ خطا در تست:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogAPI();

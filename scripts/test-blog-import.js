// اسکریپت تست برای import مقالات به سیستم بلاگ
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/admin/blogs/create';

// داده‌های تست
const testArticles = [
  {
    slug: 'test-article-1',
    title: 'مقاله تست شماره 1',
    content: '<h1>مقاله تست</h1><p>این یک مقاله تست است.</p>',
    imageUrl: '/media/blogs/test-1.jpg',
    tags: ['تست', 'مقاله', 'بلاگ'],
    meta: {
      title: 'مقاله تست شماره 1 | تستولوژی',
      description: 'این یک مقاله تست برای سیستم بلاگ است.',
      ogImage: '/media/blogs/test-1.jpg'
    }
  },
  {
    slug: 'test-article-2',
    title: 'مقاله تست شماره 2',
    content: '<h1>مقاله تست 2</h1><p>این مقاله دوم تست است.</p>',
    imageUrl: '/media/blogs/test-2.jpg',
    tags: ['تست', 'مقاله', 'بلاگ'],
    meta: {
      title: 'مقاله تست شماره 2 | تستولوژی',
      description: 'این مقاله دوم تست برای سیستم بلاگ است.',
      ogImage: '/media/blogs/test-2.jpg'
    }
  }
];

async function testBlogImport() {
  console.log('🚀 شروع تست import مقالات...');
  
  for (const article of testArticles) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${article.title} - با موفقیت ایجاد شد`);
      } else {
        console.error(`❌ ${article.title} - خطا:`, result.message);
      }
    } catch (error) {
      console.error(`❌ خطا در ${article.title}:`, error.message);
    }
  }
  
  console.log('🎉 تست import تکمیل شد');
}

// اجرای تست
if (require.main === module) {
  testBlogImport();
}

module.exports = { testBlogImport };

















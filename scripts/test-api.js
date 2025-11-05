const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    console.log('🧪 تست API endpoints...\n');
    
    // تست /api/articles
    console.log('1️⃣ تست /api/articles...');
    const articlesResponse = await fetch('http://localhost:3000/api/articles');
    const articlesData = await articlesResponse.json();
    
    if (articlesResponse.ok) {
      console.log(`✅ /api/articles: ${articlesData.length} مقاله دریافت شد`);
      if (articlesData.length > 0) {
        console.log(`   نمونه: ${articlesData[0].title}`);
      }
    } else {
      console.log(`❌ /api/articles: خطا ${articlesResponse.status}`);
      console.log(`   پیام: ${articlesData.error || 'نامشخص'}`);
    }
    
    // تست /api/admin/blog-public
    console.log('\n2️⃣ تست /api/admin/blog-public...');
    const blogResponse = await fetch('http://localhost:3000/api/admin/blog-public');
    const blogData = await blogResponse.json();
    
    if (blogResponse.ok) {
      console.log(`✅ /api/admin/blog-public: ${blogData.blogs?.length || 0} مقاله دریافت شد`);
      if (blogData.blogs && blogData.blogs.length > 0) {
        console.log(`   نمونه: ${blogData.blogs[0].title}`);
      }
    } else {
      console.log(`❌ /api/admin/blog-public: خطا ${blogResponse.status}`);
      console.log(`   پیام: ${blogData.error || 'نامشخص'}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در تست API:', error.message);
  }
}

// صبر کردن برای راه‌اندازی سرور
setTimeout(() => {
  testAPI();
}, 5000);

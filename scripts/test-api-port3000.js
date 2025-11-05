const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPIPort3000() {
  try {
    console.log('🧪 تست API روی پورت 3000...\n');
    
    // تست API endpoint
    console.log('📡 تست API endpoint:');
    const response = await fetch('http://localhost:3000/api/admin/blog-public');
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`\n✅ API Response: ${data.blogs ? data.blogs.length : 0} مقاله`);
      
      if (data.blogs && data.blogs.length > 0) {
        console.log('\n📋 نمونه مقالات:');
        data.blogs.slice(0, 3).forEach((blog, index) => {
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
      const errorText = await response.text();
      console.log(`Error Text: ${errorText}`);
    }
    
    // تست API اصلی
    console.log('\n📡 تست API اصلی:');
    const mainResponse = await fetch('http://localhost:3000/api/articles');
    
    console.log(`Status: ${mainResponse.status}`);
    
    if (mainResponse.ok) {
      const mainData = await mainResponse.json();
      console.log(`✅ Main API Response: ${mainData.length} مقاله`);
    } else {
      console.log(`❌ Main API Error: ${mainResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در تست API:', error.message);
  }
}

testAPIPort3000();








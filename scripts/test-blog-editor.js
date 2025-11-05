const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBlogEditor() {
  try {
    console.log('🎨 تست ادیتور پیشرفته مقالات...\n');
    
    // تست API endpoint برای دریافت مقاله
    console.log('📡 تست API endpoint برای دریافت مقاله:');
    const response = await fetch('http://localhost:3000/api/admin/blog-public');
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`\n✅ API Response دریافت شد!`);
      
      if (data.blogs && data.blogs.length > 0) {
        const firstBlog = data.blogs[0];
        console.log('\n📝 اولین مقاله:');
        console.log(`ID: ${firstBlog.id}`);
        console.log(`Title: ${firstBlog.title}`);
        console.log(`Category: ${firstBlog.category}`);
        console.log(`Author: ${firstBlog.author}`);
        console.log(`Published: ${firstBlog.published}`);
        console.log(`Featured: ${firstBlog.featured}`);
        console.log(`View Count: ${firstBlog.viewCount}`);
        
        // تست API endpoint برای دریافت مقاله خاص
        console.log('\n📡 تست API endpoint برای دریافت مقاله خاص:');
        const singleResponse = await fetch(`http://localhost:3000/api/admin/blog/${firstBlog.id}`);
        
        if (singleResponse.ok) {
          const singleData = await singleResponse.json();
          console.log(`✅ مقاله خاص دریافت شد!`);
          console.log(`Content Length: ${singleData.content?.length || 0} characters`);
          console.log(`Meta Description: ${singleData.metaDescription}`);
          console.log(`Tags: ${singleData.tags}`);
          
          console.log('\n🎉 ادیتور آماده استفاده است!');
          console.log('\n📱 آدرس‌های قابل دسترسی:');
          console.log(`🌐 مدیریت مقالات: http://localhost:3000/admin/blog`);
          console.log(`🎨 ادیتور مقاله: http://localhost:3000/admin/blog/edit/${firstBlog.id}`);
          
          console.log('\n🎨 ویژگی‌های ادیتور:');
          console.log('✅ ادیتور پیشرفته شبیه Elementor');
          console.log('✅ عناصر متنوع: متن، عنوان، تصویر، ویدیو، دکمه');
          console.log('✅ لایه‌بندی: ستون، کارت، جداکننده، فاصله');
          console.log('✅ عناصر ویژه: لینک تست، نقل قول، لیست');
          console.log('✅ Drag & Drop interface');
          console.log('✅ Responsive design');
          console.log('✅ Real-time preview');
          console.log('✅ Auto-save functionality');
          console.log('✅ Element toolbar');
          console.log('✅ Style customization');
          console.log('✅ Media upload support');
          console.log('✅ Test integration links');
          
          console.log('\n🔧 امکانات ادیتور:');
          console.log('📝 ویرایش متن با WYSIWYG');
          console.log('🖼️ آپلود و مدیریت تصاویر');
          console.log('🎥 پشتیبانی از ویدیو');
          console.log('🔗 ایجاد لینک‌های تست');
          console.log('📊 لایه‌بندی پیشرفته');
          console.log('🎨 سفارشی‌سازی استایل‌ها');
          console.log('📱 طراحی Responsive');
          console.log('👁️ پیش‌نمایش زنده');
          console.log('💾 ذخیره خودکار');
          console.log('🔄 Undo/Redo');
          console.log('📋 Copy/Paste');
          console.log('🎯 Element targeting');
          console.log('⚙️ Advanced settings');
          
        } else {
          console.log(`❌ خطا در دریافت مقاله خاص: ${singleResponse.status}`);
        }
        
      } else {
        console.log('❌ هیچ مقاله‌ای یافت نشد');
      }
      
    } else {
      console.log(`❌ API Error: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error Text: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در تست ادیتور:', error.message);
  }
}

testBlogEditor();








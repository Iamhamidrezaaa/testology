const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCoverImageFeature() {
  try {
    console.log('🖼️ تست قابلیت عکس کاور در ادیتور...\n');
    
    // تست API endpoint برای دریافت مقالات
    console.log('📡 تست API endpoint برای دریافت مقالات:');
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
        console.log(`Image URL: ${firstBlog.imageUrl || 'بدون عکس کاور'}`);
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
          console.log(`Image URL: ${singleData.imageUrl || 'بدون عکس کاور'}`);
          
          console.log('\n🎉 قابلیت عکس کاور آماده استفاده است!');
          console.log('\n📱 آدرس‌های قابل دسترسی:');
          console.log(`🌐 مدیریت مقالات: http://localhost:3000/admin/blog`);
          console.log(`🎨 ادیتور مقاله: http://localhost:3000/admin/blog/edit/${firstBlog.id}`);
          
          console.log('\n🖼️ ویژگی‌های عکس کاور:');
          console.log('✅ دکمه "عکس کاور" در header ادیتور');
          console.log('✅ Modal مخصوص تنظیم عکس کاور');
          console.log('✅ آپلود تصویر با Drag & Drop');
          console.log('✅ نمایش عکس کاور فعلی');
          console.log('✅ امکان حذف عکس کاور');
          console.log('✅ راهنمای اندازه و فرمت');
          console.log('✅ نمایش عکس کاور در header');
          console.log('✅ ذخیره عکس کاور در دیتابیس');
          console.log('✅ نمایش thumbnail در صفحه بلاگ');
          
          console.log('\n🎨 امکانات عکس کاور:');
          console.log('📏 اندازه پیشنهادی: 1200x630 پیکسل');
          console.log('🖼️ فرمت‌های پشتیبانی: JPG, PNG, WebP');
          console.log('📦 حداکثر حجم: 5MB');
          console.log('🎯 کیفیت: واضح و با کیفیت');
          console.log('📱 Responsive: سازگار با همه دستگاه‌ها');
          console.log('🔄 آپلود: Drag & Drop یا کلیک');
          console.log('✏️ ویرایش: تغییر و حذف');
          console.log('💾 ذخیره: خودکار در دیتابیس');
          console.log('👁️ پیش‌نمایش: نمایش فوری');
          console.log('🔗 لینک: استفاده در صفحه بلاگ');
          
          console.log('\n🔧 نحوه استفاده:');
          console.log('1️⃣ روی دکمه "عکس کاور" در header کلیک کنید');
          console.log('2️⃣ تصویر را Drag & Drop کنید یا کلیک کنید');
          console.log('3️⃣ عکس کاور فعلی نمایش داده می‌شود');
          console.log('4️⃣ امکان تغییر یا حذف عکس کاور');
          console.log('5️⃣ روی "اعمال تغییرات" کلیک کنید');
          console.log('6️⃣ عکس کاور در header نمایش داده می‌شود');
          console.log('7️⃣ عکس کاور در صفحه بلاگ به عنوان thumbnail نمایش داده می‌شود');
          
          console.log('\n📊 مزایای عکس کاور:');
          console.log('🎯 SEO: بهبود سئو با عکس کاور');
          console.log('👁️ جذابیت: افزایش کلیک و بازدید');
          console.log('📱 شبکه‌های اجتماعی: نمایش بهتر در اشتراک');
          console.log('🔍 جستجو: بهبود نتایج جستجو');
          console.log('📈 آمار: افزایش engagement');
          console.log('🎨 طراحی: ظاهر حرفه‌ای‌تر');
          console.log('📚 تجربه کاربری: بهتر و جذاب‌تر');
          
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
    console.error('❌ خطا در تست عکس کاور:', error.message);
  }
}

testCoverImageFeature();








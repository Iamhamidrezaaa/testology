const fs = require('fs');
const path = require('path');

function checkMediaLibraryStatus() {
  console.log('🔍 بررسی وضعیت کتابخانه رسانه...\n');
  
  // بررسی فایل داشبورد ادمین
  const adminDashboardPath = 'app/admin/dashboard/page.tsx';
  if (fs.existsSync(adminDashboardPath)) {
    const content = fs.readFileSync(adminDashboardPath, 'utf8');
    
    if (content.includes('کتابخانه رسانه')) {
      console.log('✅ بخش "کتابخانه رسانه" در فایل داشبورد ادمین موجود است');
    } else {
      console.log('❌ بخش "کتابخانه رسانه" در فایل داشبورد ادمین موجود نیست');
    }
    
    if (content.includes('/admin/media')) {
      console.log('✅ لینک "/admin/media" در فایل داشبورد ادمین موجود است');
    } else {
      console.log('❌ لینک "/admin/media" در فایل داشبورد ادمین موجود نیست');
    }
  } else {
    console.log('❌ فایل داشبورد ادمین یافت نشد');
  }
  
  // بررسی فایل صفحه رسانه
  const mediaPagePath = 'app/admin/media/page.tsx';
  if (fs.existsSync(mediaPagePath)) {
    console.log('✅ صفحه کتابخانه رسانه (/admin/media) موجود است');
  } else {
    console.log('❌ صفحه کتابخانه رسانه (/admin/media) موجود نیست');
  }
  
  // بررسی فایل داشبورد روان‌شناس
  const psychologistDashboardPath = 'app/psychologist/dashboard/page.tsx';
  if (fs.existsSync(psychologistDashboardPath)) {
    const content = fs.readFileSync(psychologistDashboardPath, 'utf8');
    
    if (content.includes('کتابخانه رسانه')) {
      console.log('✅ بخش "کتابخانه رسانه" در فایل داشبورد روان‌شناس موجود است');
    } else {
      console.log('❌ بخش "کتابخانه رسانه" در فایل داشبورد روان‌شناس موجود نیست');
    }
  }
  
  // بررسی فایل داشبورد تولیدکننده محتوا
  const contentProducerDashboardPath = 'app/content-producer/dashboard/page.tsx';
  if (fs.existsSync(contentProducerDashboardPath)) {
    const content = fs.readFileSync(contentProducerDashboardPath, 'utf8');
    
    if (content.includes('کتابخانه رسانه')) {
      console.log('✅ بخش "کتابخانه رسانه" در فایل داشبورد تولیدکننده محتوا موجود است');
    } else {
      console.log('❌ بخش "کتابخانه رسانه" در فایل داشبورد تولیدکننده محتوا موجود نیست');
    }
  }
  
  console.log('\n🔧 راه‌حل‌های ممکن:');
  console.log('1️⃣ Hard Refresh مرورگر: Ctrl+F5 یا Cmd+Shift+R');
  console.log('2️⃣ پاک کردن Cache مرورگر');
  console.log('3️⃣ Restart سرور: npm run dev');
  console.log('4️⃣ بررسی Console مرورگر برای خطاها');
  
  console.log('\n📱 آدرس‌های قابل تست:');
  console.log('🌐 داشبورد ادمین: http://localhost:3000/admin/dashboard');
  console.log('📁 کتابخانه رسانه: http://localhost:3000/admin/media');
  console.log('🧠 داشبورد روان‌شناس: http://localhost:3000/psychologist/dashboard');
  console.log('✍️ داشبورد تولیدکننده محتوا: http://localhost:3000/content-producer/dashboard');
}

checkMediaLibraryStatus();








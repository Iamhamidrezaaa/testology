const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای فرمت کامل محتوا
function completeContentFix(content) {
  if (!content) return content;
  
  let fixed = content
    // حذف کامل همه علامت‌های # از متن
    .replace(/#/g, '')
    
    // فرمت کردن هدینگ‌ها
    .replace(/^مبانی اصلی$/gm, '\n## مبانی اصلی\n')
    .replace(/^کاربردهای عملی$/gm, '\n## کاربردهای عملی\n')
    .replace(/^تست‌های مرتبط$/gm, '\n## تست‌های مرتبط\n')
    .replace(/^مقالات مرتبط$/gm, '\n## مقالات مرتبط\n')
    .replace(/^تست‌های پیشنهادی$/gm, '\n## تست‌های پیشنهادی\n')
    .replace(/^نتیجه‌گیری$/gm, '\n## نتیجه‌گیری\n')
    .replace(/^ارزش‌ها$/gm, '\n## ارزش‌ها\n')
    .replace(/^شناخت خود$/gm, '\n### شناخت خود\n')
    .replace(/^روابط بین‌فردی$/gm, '\n### روابط بین‌فردی\n')
    .replace(/^رشد شخصی$/gm, '\n### رشد شخصی\n')
    
    // فرمت کردن لیست‌های شماره‌دار
    .replace(/^(\d+\.\s*)/gm, '\n$1')
    .replace(/^(-\s*)/gm, '\n$1')
    
    // فرمت کردن لینک‌ها
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, ' [$1]($2)')
    
    // حذف خطوط خالی اضافی
    .replace(/\n{3,}/g, '\n\n')
    
    // حذف فاصله‌های اضافی
    .replace(/[ \t]+$/gm, '')
    
    // فرمت کردن اطلاعات نویسنده
    .replace(/---\n\n\*\*نویسنده\*\*:/g, '\n\n---\n\n**نویسنده**:')
    .replace(/\*\*تاریخ انتشار\*\*:/g, '\n**تاریخ انتشار**:')
    .replace(/\*\*زمان خواندن\*\*:/g, '\n**زمان خواندن**:')
    .replace(/\*\*کلمات کلیدی\*\*:/g, '\n**کلمات کلیدی**:')
    
    // حذف تگ‌های # از انتهای متن
    .replace(/\n#[\w\u0600-\u06FF\s]+\n?$/gm, '')
    .replace(/#[\w\u0600-\u06FF\s]+$/gm, '')
    
    .trim();
  
  return fixed;
}

async function fixAllContent() {
  try {
    console.log('🔧 اصلاح کامل محتوای مقالات...\n');
    
    // دریافت همه مقالات
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });
    
    console.log(`📝 پردازش ${blogs.length} مقاله...`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const blog of blogs) {
      try {
        console.log(`\n🔄 در حال پردازش: ${blog.title}`);
        
        // اصلاح محتوا
        const fixedContent = completeContentFix(blog.content);
        
        if (fixedContent !== blog.content) {
          // به‌روزرسانی در دیتابیس
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content: fixedContent }
          });
          
          console.log(`✅ اصلاح شد: ${blog.title}`);
          updatedCount++;
        } else {
          console.log(`⏭️ بدون تغییر: ${blog.title}`);
        }
        
      } catch (error) {
        console.error(`❌ خطا در ${blog.title}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 گزارش نهایی:`);
    console.log(`✅ مقالات اصلاح شده: ${updatedCount}`);
    console.log(`⏭️ مقالات بدون تغییر: ${blogs.length - updatedCount - errorCount}`);
    console.log(`❌ خطاها: ${errorCount}`);
    
    // تست نمونه
    console.log(`\n🧪 تست نمونه:`);
    const sampleBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'development-planning-test-evaluation'
      }
    });
    
    if (sampleBlog) {
      console.log(`📋 نمونه: ${sampleBlog.title}`);
      console.log(`📄 محتوای اصلاح شده:`);
      console.log(sampleBlog.content.substring(0, 500) + '...');
      
      // بررسی وجود علامت #
      const hasHash = sampleBlog.content.includes('#');
      console.log(`\n🔍 بررسی علامت #: ${hasHash ? '❌ هنوز وجود دارد' : '✅ حذف شده'}`);
      
      // بررسی فرمت
      const paragraphs = sampleBlog.content.split('\n\n').filter(p => p.trim().length > 0);
      console.log(`📄 تعداد پاراگراف‌ها: ${paragraphs.length}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در فرآیند اصلاح:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
fixAllContent();








const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای حذف علامت‌های # و فرمت کردن محتوا
function cleanContent(content) {
  if (!content) return content;
  
  let cleaned = content
    // حذف علامت‌های # از ابتدای خطوط
    .replace(/^#+\s*/gm, '')
    .replace(/^#/gm, '')
    
    // حذف علامت‌های # از وسط متن
    .replace(/#/g, '')
    
    // فرمت کردن هدینگ‌ها بدون #
    .replace(/^([^#\n]+)$/gm, (match, text) => {
      // اگر خط کوتاه است و شامل کلمات کلیدی هدینگ است، آن را هدینگ در نظر بگیر
      if (text.trim().length < 50 && (
        text.includes('مبانی') || 
        text.includes('کاربرد') || 
        text.includes('تست') || 
        text.includes('مقالات') || 
        text.includes('نتیجه') ||
        text.includes('ارزش') ||
        text.includes('شناخت') ||
        text.includes('روابط') ||
        text.includes('رشد') ||
        text.includes('مرتبط') ||
        text.includes('پیشنهادی')
      )) {
        return `\n## ${text.trim()}\n`;
      }
      return text;
    })
    
    // فرمت کردن لیست‌ها
    .replace(/^(\d+\.\s*)/gm, '\n$1')
    .replace(/^(-\s*)/gm, '\n$1')
    
    // فرمت کردن لینک‌ها
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, ' [$1]($2)')
    
    // حذف خطوط خالی اضافی
    .replace(/\n{3,}/g, '\n\n')
    
    // حذف فاصله‌های اضافی
    .replace(/[ \t]+$/gm, '')
    
    .trim();
  
  return cleaned;
}

async function removeHashSigns() {
  try {
    console.log('🧹 حذف علامت‌های # از محتوای مقالات...\n');
    
    // دریافت همه مقالات
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });
    
    console.log(`📝 یافت شد: ${blogs.length} مقاله`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const blog of blogs) {
      try {
        console.log(`\n🔄 در حال پردازش: ${blog.title}`);
        
        // تمیز کردن محتوا
        const cleanedContent = cleanContent(blog.content);
        
        if (cleanedContent !== blog.content) {
          // به‌روزرسانی در دیتابیس
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content: cleanedContent }
          });
          
          console.log(`✅ تمیز شد: ${blog.title}`);
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
    console.log(`✅ مقالات تمیز شده: ${updatedCount}`);
    console.log(`⏭️ مقالات بدون تغییر: ${blogs.length - updatedCount - errorCount}`);
    console.log(`❌ خطاها: ${errorCount}`);
    
    // تست نمونه
    console.log(`\n🧪 تست نمونه:`);
    const sampleBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'development-planning-growth'
      }
    });
    
    if (sampleBlog) {
      console.log(`📋 نمونه: ${sampleBlog.title}`);
      console.log(`📄 محتوای تمیز شده:`);
      console.log(sampleBlog.content.substring(0, 500) + '...');
      
      // بررسی وجود علامت #
      const hasHash = sampleBlog.content.includes('#');
      console.log(`\n🔍 بررسی علامت #: ${hasHash ? '❌ هنوز وجود دارد' : '✅ حذف شده'}`);
    }
    
  } catch (error) {
    console.error('❌ خطا در فرآیند تمیز کردن:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
removeHashSigns();








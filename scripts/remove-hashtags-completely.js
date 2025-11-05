const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای حذف کامل تگ‌های #
function removeHashtagsCompletely(content) {
  if (!content) return content;
  
  let cleaned = content
    // حذف کامل همه علامت‌های # از متن
    .replace(/#/g, '')
    
    // حذف تگ‌های # از انتهای متن
    .replace(/\n#[\w\u0600-\u06FF\s]+\n?$/gm, '')
    .replace(/#[\w\u0600-\u06FF\s]+$/gm, '')
    
    // حذف خطوط خالی اضافی
    .replace(/\n{3,}/g, '\n\n')
    
    // حذف فاصله‌های اضافی
    .replace(/[ \t]+$/gm, '')
    
    .trim();
  
  return cleaned;
}

async function removeAllHashtags() {
  try {
    console.log('🧹 حذف کامل تگ‌های # از همه مقالات...\n');
    
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
        
        // حذف تگ‌های #
        const cleanedContent = removeHashtagsCompletely(blog.content);
        
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
        slug: 'development-planning-test-evaluation'
      }
    });
    
    if (sampleBlog) {
      console.log(`📋 نمونه: ${sampleBlog.title}`);
      console.log(`📄 محتوای تمیز شده:`);
      console.log(sampleBlog.content.substring(0, 800) + '...');
      
      // بررسی وجود علامت #
      const hasHash = sampleBlog.content.includes('#');
      console.log(`\n🔍 بررسی علامت #: ${hasHash ? '❌ هنوز وجود دارد' : '✅ حذف شده'}`);
      
      // بررسی تگ‌های #
      const hashtags = sampleBlog.content.match(/#[\w\u0600-\u06FF\s]+/g);
      console.log(`🏷️ تگ‌های #: ${hashtags ? hashtags.length : 0} مورد`);
    }
    
  } catch (error) {
    console.error('❌ خطا در فرآیند حذف تگ‌ها:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
removeAllHashtags();








const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای فرمت نهایی و تمیز کردن محتوا
function finalCleanup(content) {
  if (!content) return content;
  
  let cleaned = content
    // حذف کامل همه علامت‌های #
    .replace(/#/g, '')
    
    // فرمت کردن هدینگ‌ها بر اساس کلمات کلیدی
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
    
    // فرمت کردن لیست‌ها
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
    
    .trim();
  
  return cleaned;
}

async function applyFinalCleanup() {
  try {
    console.log('🧹 اعمال تمیز کردن نهایی...\n');
    
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
    
    for (const blog of blogs) {
      try {
        const cleanedContent = finalCleanup(blog.content);
        
        if (cleanedContent !== blog.content) {
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content: cleanedContent }
          });
          
          console.log(`✅ تمیز شد: ${blog.title}`);
          updatedCount++;
        }
        
      } catch (error) {
        console.error(`❌ خطا در ${blog.title}:`, error.message);
      }
    }
    
    console.log(`\n📊 گزارش نهایی:`);
    console.log(`✅ مقالات تمیز شده: ${updatedCount}`);
    console.log(`⏭️ مقالات بدون تغییر: ${blogs.length - updatedCount}`);
    
    // تست نمونه نهایی
    console.log(`\n🧪 تست نمونه نهایی:`);
    const sampleBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'development-planning-growth'
      }
    });
    
    if (sampleBlog) {
      console.log(`📋 مقاله: ${sampleBlog.title}`);
      console.log(`📄 نمونه محتوا:`);
      console.log(sampleBlog.content.substring(0, 800) + '...');
      
      // بررسی کیفیت فرمت
      const content = sampleBlog.content;
      const hasHash = content.includes('#');
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
      const headings = (content.match(/^## /gm) || []).length;
      const lists = (content.match(/^- /gm) || []).length;
      const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
      
      console.log(`\n📊 آمار نهایی:`);
      console.log(`🔍 علامت #: ${hasHash ? '❌ هنوز وجود دارد' : '✅ حذف شده'}`);
      console.log(`📄 پاراگراف‌ها: ${paragraphs.length}`);
      console.log(`🔖 هدینگ‌ها: ${headings}`);
      console.log(`📋 لیست‌ها: ${lists}`);
      console.log(`🔗 لینک‌ها: ${links}`);
      console.log(`📏 طول: ${content.length} کاراکتر`);
    }
    
  } catch (error) {
    console.error('❌ خطا در تمیز کردن نهایی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyFinalCleanup();








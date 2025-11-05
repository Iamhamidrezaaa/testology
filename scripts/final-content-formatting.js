const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// تابع برای فرمت نهایی محتوا
function finalFormatContent(content) {
  if (!content) return content;
  
  let formatted = content
    // حذف خطوط خالی اضافی
    .replace(/\n{3,}/g, '\n\n')
    
    // فرمت کردن هدینگ‌های تودرتو
    .replace(/^### ### /gm, '### ')
    .replace(/^#### #### /gm, '#### ')
    
    // فرمت کردن لیست‌ها
    .replace(/^- \n- /gm, '- ')
    .replace(/^\d+\. \n\d+\. /gm, '$&')
    
    // فرمت کردن لینک‌ها
    .replace(/\[([^\]]+)\]\(([^)]+)\)\n/g, '[$1]($2)\n')
    
    // حذف فاصله‌های اضافی
    .replace(/[ \t]+$/gm, '')
    
    // فرمت کردن اطلاعات نویسنده
    .replace(/---\n\n\*\*نویسنده\*\*:/g, '\n\n---\n\n**نویسنده**:')
    .replace(/\*\*تاریخ انتشار\*\*:/g, '\n**تاریخ انتشار**:')
    .replace(/\*\*زمان خواندن\*\*:/g, '\n**زمان خواندن**:')
    .replace(/\*\*کلمات کلیدی\*\*:/g, '\n**کلمات کلیدی**:')
    
    .trim();
  
  return formatted;
}

async function applyFinalFormatting() {
  try {
    console.log('🎯 اعمال فرمت نهایی...\n');
    
    // دریافت همه مقالات
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true
      }
    });
    
    console.log(`📝 پردازش ${blogs.length} مقاله...`);
    
    let updatedCount = 0;
    
    for (const blog of blogs) {
      try {
        const formattedContent = finalFormatContent(blog.content);
        
        if (formattedContent !== blog.content) {
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content: formattedContent }
          });
          
          console.log(`✅ فرمت نهایی: ${blog.title}`);
          updatedCount++;
        }
        
      } catch (error) {
        console.error(`❌ خطا در ${blog.title}:`, error.message);
      }
    }
    
    console.log(`\n📊 گزارش نهایی:`);
    console.log(`✅ مقالات به‌روزرسانی شده: ${updatedCount}`);
    console.log(`⏭️ مقالات بدون تغییر: ${blogs.length - updatedCount}`);
    
    // تست نمونه نهایی
    console.log(`\n🧪 تست نمونه نهایی:`);
    const sampleBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'values-assessment-personal-decision-making'
      }
    });
    
    if (sampleBlog) {
      console.log(`📋 مقاله: ${sampleBlog.title}`);
      console.log(`📄 نمونه محتوا:`);
      console.log(sampleBlog.content.substring(0, 500) + '...');
      
      // بررسی کیفیت فرمت
      const content = sampleBlog.content;
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
      const headings = (content.match(/^## /gm) || []).length;
      const lists = (content.match(/^- /gm) || []).length;
      const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
      
      console.log(`\n📊 آمار نهایی:`);
      console.log(`📄 پاراگراف‌ها: ${paragraphs.length}`);
      console.log(`🔖 هدینگ‌ها: ${headings}`);
      console.log(`📋 لیست‌ها: ${lists}`);
      console.log(`🔗 لینک‌ها: ${links}`);
      console.log(`📏 طول: ${content.length} کاراکتر`);
    }
    
  } catch (error) {
    console.error('❌ خطا در فرمت نهایی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyFinalFormatting();








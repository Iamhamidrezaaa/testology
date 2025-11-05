const { PrismaClient } = require('@prisma/client');
const matter = require('gray-matter');

const prisma = new PrismaClient();

// تابع برای فرمت کردن محتوای مقاله
function formatArticleContent(content) {
  if (!content) return content;
  
  // 1. حذف اطلاعات نویسنده از انتهای متن
  const authorInfoRegex = /---\s*\*\*نویسنده\*\*:.*$/s;
  const cleanedContent = content.replace(authorInfoRegex, '').trim();
  
  // 2. فرمت کردن هدینگ‌ها
  let formatted = cleanedContent
    // اضافه کردن خط خالی قبل از هدینگ‌های اصلی
    .replace(/^## /gm, '\n\n## ')
    .replace(/^### /gm, '\n\n### ')
    .replace(/^#### /gm, '\n\n#### ')
    
    // اضافه کردن خط خالی بعد از هدینگ‌ها
    .replace(/^## .*$/gm, '$&\n')
    .replace(/^### .*$/gm, '$&\n')
    .replace(/^#### .*$/gm, '$&\n')
    
    // فرمت کردن لیست‌ها
    .replace(/^### \d+\. /gm, '\n### $&')
    .replace(/^- /gm, '\n- ')
    .replace(/^\d+\. /gm, '\n$&')
    
    // فرمت کردن لینک‌ها
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '\n[$1]($2)')
    
    // اضافه کردن خط خالی بین پاراگراف‌ها
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
  
  // 3. اضافه کردن اطلاعات نویسنده در انتها با فرمت مناسب
  const authorInfo = extractAuthorInfo(content);
  if (authorInfo) {
    formatted += `\n\n---\n\n**نویسنده**: ${authorInfo.author}\n\n**تاریخ انتشار**: ${authorInfo.publishDate}\n\n**زمان خواندن**: ${authorInfo.readTime}\n\n**کلمات کلیدی**: ${authorInfo.keywords}`;
  }
  
  return formatted;
}

// تابع برای استخراج اطلاعات نویسنده
function extractAuthorInfo(content) {
  const authorMatch = content.match(/\*\*نویسنده\*\*:\s*([^\n]+)/);
  const dateMatch = content.match(/\*\*تاریخ انتشار\*\*:\s*([^\n]+)/);
  const timeMatch = content.match(/\*\*زمان خواندن\*\*:\s*([^\n]+)/);
  const keywordsMatch = content.match(/\*\*کلمات کلیدی\*\*:\s*([^\n]+)/);
  
  if (authorMatch || dateMatch || timeMatch || keywordsMatch) {
    return {
      author: authorMatch ? authorMatch[1].trim() : '',
      publishDate: dateMatch ? dateMatch[1].trim() : '',
      readTime: timeMatch ? timeMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].trim() : ''
    };
  }
  
  return null;
}

// تابع برای فرمت کردن محتوای Markdown
function formatMarkdownContent(content) {
  if (!content) return content;
  
  // فرمت کردن هدینگ‌ها
  let formatted = content
    // اضافه کردن خط خالی قبل از هدینگ‌ها
    .replace(/^# /gm, '\n# ')
    .replace(/^## /gm, '\n\n## ')
    .replace(/^### /gm, '\n\n### ')
    .replace(/^#### /gm, '\n\n#### ')
    
    // فرمت کردن لیست‌ها
    .replace(/^- /gm, '\n- ')
    .replace(/^\d+\. /gm, '\n$&')
    
    // فرمت کردن لینک‌ها
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, ' [$1]($2)')
    
    // اضافه کردن خط خالی بین پاراگراف‌ها
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
  
  return formatted;
}

async function fixAllBlogContent() {
  try {
    console.log('🔧 شروع فرمت کردن محتوای مقالات...\n');
    
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
        
        // فرمت کردن محتوا
        const formattedContent = formatArticleContent(blog.content);
        
        if (formattedContent !== blog.content) {
          // به‌روزرسانی در دیتابیس
          await prisma.blog.update({
            where: { id: blog.id },
            data: { content: formattedContent }
          });
          
          console.log(`✅ فرمت شد: ${blog.title}`);
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
    console.log(`✅ مقالات فرمت شده: ${updatedCount}`);
    console.log(`⏭️ مقالات بدون تغییر: ${blogs.length - updatedCount - errorCount}`);
    console.log(`❌ خطاها: ${errorCount}`);
    
    // تست نمونه
    console.log(`\n🧪 تست نمونه:`);
    const sampleBlog = await prisma.blog.findFirst({
      where: { content: { contains: '## ' } }
    });
    
    if (sampleBlog) {
      console.log(`📋 نمونه: ${sampleBlog.title}`);
      console.log(`📄 محتوای فرمت شده:`);
      console.log(sampleBlog.content.substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.error('❌ خطا در فرآیند فرمت کردن:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
fixAllBlogContent();








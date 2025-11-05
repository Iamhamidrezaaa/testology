const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFormattedContent() {
  try {
    console.log('🧪 تست محتوای فرمت شده...\n');
    
    // دریافت مقاله نمونه
    const sampleBlog = await prisma.blog.findFirst({
      where: { 
        slug: 'values-assessment-personal-decision-making'
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });
    
    if (!sampleBlog) {
      console.log('❌ مقاله نمونه یافت نشد');
      return;
    }
    
    console.log(`📋 مقاله: ${sampleBlog.title}`);
    console.log(`🔗 Slug: ${sampleBlog.slug}`);
    console.log(`📄 محتوای فرمت شده:\n`);
    console.log('='.repeat(80));
    console.log(sampleBlog.content);
    console.log('='.repeat(80));
    
    // بررسی ویژگی‌های فرمت
    const content = sampleBlog.content;
    
    console.log('\n📊 تحلیل فرمت:');
    console.log(`📏 طول محتوا: ${content.length} کاراکتر`);
    console.log(`📝 تعداد پاراگراف‌ها: ${(content.match(/\n\n/g) || []).length}`);
    console.log(`🔖 تعداد هدینگ‌ها: ${(content.match(/^## /gm) || []).length}`);
    console.log(`📋 تعداد لیست‌ها: ${(content.match(/^- /gm) || []).length}`);
    console.log(`🔗 تعداد لینک‌ها: ${(content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length}`);
    
    // بررسی اطلاعات نویسنده
    const hasAuthorInfo = content.includes('**نویسنده**:');
    const hasPublishDate = content.includes('**تاریخ انتشار**:');
    const hasReadTime = content.includes('**زمان خواندن**:');
    const hasKeywords = content.includes('**کلمات کلیدی**:');
    
    console.log('\n👤 اطلاعات نویسنده:');
    console.log(`✅ نویسنده: ${hasAuthorInfo ? 'موجود' : 'مفقود'}`);
    console.log(`📅 تاریخ انتشار: ${hasPublishDate ? 'موجود' : 'مفقود'}`);
    console.log(`⏱️ زمان خواندن: ${hasReadTime ? 'موجود' : 'مفقود'}`);
    console.log(`🏷️ کلمات کلیدی: ${hasKeywords ? 'موجود' : 'مفقود'}`);
    
    // بررسی فرمت پاراگراف‌ها
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    console.log(`\n📄 تعداد پاراگراف‌های واقعی: ${paragraphs.length}`);
    
    // نمایش نمونه پاراگراف‌ها
    console.log('\n📋 نمونه پاراگراف‌ها:');
    paragraphs.slice(0, 3).forEach((para, index) => {
      console.log(`\n${index + 1}. ${para.substring(0, 100)}...`);
    });
    
  } catch (error) {
    console.error('❌ خطا در تست:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFormattedContent();








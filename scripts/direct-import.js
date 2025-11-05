// اسکریپت import مستقیم به دیتابیس
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'content', 'articles');

async function importArticles() {
  console.log('🚀 شروع import مستقیم 50 مقاله...');
  
  try {
    const files = fs.readdirSync(ARTICLES_DIR).filter(file => file.endsWith('.json'));
    console.log(`📄 ${files.length} فایل JSON پیدا شد`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(ARTICLES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const articleData = JSON.parse(fileContent);
        
        // استخراج شماره مقاله از نام فایل
        const articleNumber = file.replace('article_', '').replace('.json', '');
        const seoImageUrl = `/media/articles/article_${articleNumber.padStart(2, '0')}.png`;
        
        // ایجاد مقاله در دیتابیس
        const blog = await prisma.blog.create({
          data: {
            slug: articleData.slug,
            title: articleData.title,
            content: articleData.content,
            imageUrl: seoImageUrl,
            tags: JSON.stringify(articleData.tags),
            metaTitle: articleData.meta.title,
            metaDescription: articleData.meta.description,
            ogImage: seoImageUrl
          }
        });

        console.log(`✅ مقاله "${articleData.title}" اضافه شد`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ خطا در فایل ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 خلاصه نتایج:');
    console.log(`✅ موفق: ${successCount}`);
    console.log(`❌ خطا: ${errorCount}`);
    console.log(`📄 کل: ${files.length}`);

  } catch (error) {
    console.error('❌ خطای کلی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importArticles().catch(console.error);

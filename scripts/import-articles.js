// اسکریپت import 50 مقاله ترجمه‌شده به سیستم بلاگ
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'content', 'articles');
const API_URL = 'http://localhost:3000/api/admin/blogs/create';

// خواندن و پردازش مقالات
async function importAllArticles() {
  try {
    console.log('🚀 شروع import 50 مقاله ترجمه‌شده...');
    
    const files = fs.readdirSync(ARTICLES_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📄 ${jsonFiles.length} فایل JSON پیدا شد`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of jsonFiles) {
      try {
        const result = await importSingleArticle(file);
        if (result.success) {
          successCount++;
          console.log(`✅ ${result.title} - آپلود شد`);
        } else {
          errorCount++;
          console.error(`❌ ${result.title} - خطا: ${result.error}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ خطا در پردازش ${file}:`, error.message);
      }
    }
    
    console.log('\n📊 خلاصه نتایج:');
    console.log(`✅ موفق: ${successCount}`);
    console.log(`❌ خطا: ${errorCount}`);
    console.log(`📄 کل: ${jsonFiles.length}`);
    
  } catch (error) {
    console.error('❌ خطای کلی:', error);
  }
}

async function importSingleArticle(filename) {
  const filePath = path.join(ARTICLES_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const articleData = JSON.parse(fileContent);
  
  // تبدیل ساختار JSON به فرمت API
  const articleNumber = filename.replace('article_', '').replace('.json', '');
  const seoImageUrl = `/media/articles/article_${articleNumber}.png`;
  
  const apiData = {
    slug: articleData.slug,
    title: articleData.title,
    content: articleData.content,
    imageUrl: seoImageUrl, // استفاده از تصویر SEO جدید
    tags: articleData.tags,
    meta: {
      title: articleData.meta.title,
      description: articleData.meta.description,
      ogImage: seoImageUrl // استفاده از تصویر SEO جدید
    }
  };
  
  // ارسال به API
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, title: articleData.title };
    } else {
      return { success: false, title: articleData.title, error: result.message || 'خطای نامشخص' };
    }
  } catch (error) {
    return { success: false, title: articleData.title, error: error.message };
  }
}

// اجرای اسکریپت
if (require.main === module) {
  importAllArticles();
}

module.exports = { importAllArticles, importSingleArticle };

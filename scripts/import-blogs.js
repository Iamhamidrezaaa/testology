// اسکریپت import مقالات Markdown به CMS تستولوژی
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// تنظیمات
const ARTICLES_DIR = path.join(__dirname, "..", "lib", "blog", "articles");
const MEDIA_DIR = path.join(__dirname, "..", "public", "media", "blogs");
const API_URL = "http://localhost:3000/api/admin/blog/import";

// ایجاد پوشه media اگر وجود نداشته باشد
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  console.log("📁 پوشه media/blogs ایجاد شد");
}

async function importAllArticles() {
  try {
    console.log("🚀 شروع import مقالات...");
    
    const files = fs.readdirSync(ARTICLES_DIR);
    const markdownFiles = files.filter(file => file.endsWith(".md"));
    
    console.log(`📄 ${markdownFiles.length} فایل Markdown پیدا شد`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of markdownFiles) {
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
    
    console.log("\n📊 خلاصه نتایج:");
    console.log(`✅ موفق: ${successCount}`);
    console.log(`❌ خطا: ${errorCount}`);
    console.log(`📄 کل: ${markdownFiles.length}`);
    
  } catch (error) {
    console.error("❌ خطای کلی:", error);
  }
}

async function importSingleArticle(filename) {
  const filePath = path.join(ARTICLES_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  
  // تجزیه frontmatter
  const { data, content } = matter(fileContent);
  
  // استخراج شماره مقاله از نام فایل
  const articleNumber = filename.replace('article_', '').replace('.md', '');
  
  // تولید داده‌های مقاله
  const articleData = {
    title: data.title || `مقاله شماره ${articleNumber}`,
    slug: data.slug || `article-${articleNumber}`,
    excerpt: data.excerpt || generateExcerpt(content),
    content: content,
    coverUrl: data.cover ? `/media/blogs/${data.cover}` : `/media/blogs/article-${articleNumber}.jpg`,
    tags: data.tags ? data.tags.split(",").map(t => t.trim()) : generateTagsByNumber(parseInt(articleNumber)),
    category: data.category || determineCategoryByNumber(parseInt(articleNumber)),
    author: data.author || 'تیم تستولوژی',
    published: data.published !== false,
    meta: {
      title: data.metaTitle || data.title || `مقاله شماره ${articleNumber}`,
      description: data.metaDescription || generateMetaDescription(content),
      ogImage: data.cover ? `/media/blogs/${data.cover}` : `/media/blogs/article-${articleNumber}.jpg`
    }
  };
  
  // ارسال به API
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // اگر authentication لازم باشد، اینجا اضافه کنید
        // "Authorization": "Bearer YOUR_TOKEN"
      },
      body: JSON.stringify(articleData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, title: articleData.title };
    } else {
      return { success: false, title: articleData.title, error: result.message || "خطای نامشخص" };
    }
  } catch (error) {
    return { success: false, title: articleData.title, error: error.message };
  }
}

// توابع کمکی
function generateExcerpt(content) {
  // استخراج اولین پاراگراف به عنوان خلاصه
  const firstParagraph = content.split('\n\n')[0];
  return firstParagraph.replace(/^#+\s*/, '').substring(0, 150) + '...';
}

function generateMetaDescription(content) {
  const excerpt = generateExcerpt(content);
  return excerpt.substring(0, 160);
}

function determineCategoryByNumber(articleNumber) {
  if (articleNumber <= 10) return 'mental-health';
  if (articleNumber <= 20) return 'personal-growth';
  if (articleNumber <= 30) return 'relationships';
  if (articleNumber <= 40) return 'family';
  return 'general';
}

function generateTagsByNumber(articleNumber) {
  const tagSets = [
    ['استرس', 'اضطراب', 'مدیریت استرس'], // مقالات 1-10
    ['عزت نفس', 'اعتماد به نفس', 'رشد شخصی'], // مقالات 11-20
    ['روابط', 'عشق', 'ارتباطات'], // مقالات 21-30
    ['خانواده', 'تربیت', 'کودک'], // مقالات 31-40
    ['روانشناسی', 'سلامت روان', 'مشاوره'] // مقالات 41-50
  ];
  
  const setIndex = Math.floor((articleNumber - 1) / 10);
  return tagSets[setIndex] || tagSets[4];
}

// اجرای اسکریپت
if (require.main === module) {
  importAllArticles();
}

module.exports = { importAllArticles, importSingleArticle };

















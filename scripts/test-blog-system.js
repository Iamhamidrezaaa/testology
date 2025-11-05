// اسکریپت تست سیستم بلاگ
const fs = require('fs');
const path = require('path');

console.log('🧪 تست سیستم بلاگ تستولوژی...\n');

// تست 1: بررسی فایل‌های مقالات
const articlesDir = path.join(__dirname, '..', 'public', 'content', 'articles');
const articlesFiles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json'));
console.log(`✅ فایل‌های مقالات: ${articlesFiles.length}/50`);

// تست 2: بررسی تصاویر SEO
const imagesDir = path.join(__dirname, '..', 'public', 'media', 'articles');
const seoImages = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));
console.log(`✅ تصاویر SEO: ${seoImages.length}/50`);

// تست 3: بررسی ساختار JSON
let validJsonCount = 0;
articlesFiles.forEach(file => {
  try {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (data.title && data.content && data.tags) {
      validJsonCount++;
    }
  } catch (error) {
    console.log(`❌ خطا در فایل ${file}: ${error.message}`);
  }
});
console.log(`✅ فایل‌های JSON معتبر: ${validJsonCount}/50`);

// تست 4: بررسی تصاویر
let validImagesCount = 0;
seoImages.forEach(file => {
  const filePath = path.join(imagesDir, file);
  const stats = fs.statSync(filePath);
  if (stats.size > 0) {
    validImagesCount++;
  }
});
console.log(`✅ تصاویر معتبر: ${validImagesCount}/50`);

// تست 5: بررسی ساختار پروژه
const requiredFiles = [
  'app/blog/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/admin/blog/page.tsx',
  'app/admin/blog/new/page.tsx',
  'components/blog/BlogCard.tsx',
  'components/blog/CommentsSection.tsx',
  'components/blog/AnalyticsSection.tsx',
  'app/api/admin/blogs/create/route.ts',
  'app/api/admin/blogs/route.ts',
  'app/api/blog/[slug]/route.ts',
  'app/api/blog/comments/route.ts',
  'app/api/blog/analytics/route.ts'
];

let existingFiles = 0;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    existingFiles++;
  }
});
console.log(`✅ فایل‌های سیستم: ${existingFiles}/${requiredFiles.length}`);

// خلاصه
console.log('\n📊 خلاصه تست:');
console.log(`📄 مقالات: ${articlesFiles.length}/50`);
console.log(`🖼 تصاویر SEO: ${seoImages.length}/50`);
console.log(`📝 JSON معتبر: ${validJsonCount}/50`);
console.log(`🖼 تصاویر معتبر: ${validImagesCount}/50`);
console.log(`⚙️ فایل‌های سیستم: ${existingFiles}/${requiredFiles.length}`);

const totalScore = (articlesFiles.length + seoImages.length + validJsonCount + validImagesCount + existingFiles) / (50 + 50 + 50 + 50 + requiredFiles.length) * 100;
console.log(`\n🎯 امتیاز کلی: ${totalScore.toFixed(1)}%`);

if (totalScore >= 95) {
  console.log('🎉 سیستم بلاگ آماده است!');
} else if (totalScore >= 80) {
  console.log('⚠️ سیستم تقریباً آماده است، چند مورد کوچک باقی مانده');
} else {
  console.log('❌ سیستم نیاز به تکمیل دارد');
}

















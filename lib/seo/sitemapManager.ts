import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://testology.me';
const LANGS = ['en', 'fa', 'ar', 'fr', 'ru', 'tr', 'es'];

/**
 * به‌روزرسانی خودکار Sitemap
 * بعد از ایجاد یا ویرایش محتوا فراخوانی می‌شود
 */
export async function updateSitemap() {
  try {
    console.log('🔄 Updating sitemap...');
    
    // دریافت مقالات منتشر شده
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    });

    // دریافت تست‌های منتشر شده
    const tests = await prisma.test.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    });

    // دریافت تمرین‌های منتشر شده
    const exercises = await prisma.exercise.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    });

    // تولید XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // صفحات اصلی برای هر زبان
    for (const lang of LANGS) {
      const lastMod = new Date().toISOString();
      
      // صفحه اصلی
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>`;

      // Hreflang برای صفحه اصلی
      for (const altLang of LANGS) {
        xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}" />`;
      }
      xml += `
  </url>`;

      // صفحات ثابت
      const staticPages = [
        { path: '/about', priority: '0.8', changefreq: 'monthly' },
        { path: '/contact', priority: '0.8', changefreq: 'monthly' },
        { path: '/tests', priority: '0.9', changefreq: 'weekly' },
        { path: '/blog', priority: '0.9', changefreq: 'weekly' },
        { path: '/dashboard', priority: '0.7', changefreq: 'monthly' },
        { path: '/profile', priority: '0.6', changefreq: 'monthly' },
        { path: '/leaderboard', priority: '0.7', changefreq: 'weekly' },
        { path: '/ranking', priority: '0.7', changefreq: 'weekly' },
        { path: '/results', priority: '0.6', changefreq: 'monthly' },
        { path: '/therapist', priority: '0.8', changefreq: 'monthly' },
        { path: '/explore', priority: '0.8', changefreq: 'weekly' },
        { path: '/places', priority: '0.7', changefreq: 'weekly' },
        { path: '/gamification', priority: '0.6', changefreq: 'monthly' },
        { path: '/advanced-features', priority: '0.6', changefreq: 'monthly' }
      ];

      for (const page of staticPages) {
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}${page.path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

        // Hreflang برای صفحات ثابت
        for (const altLang of LANGS) {
          xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}${page.path}" />`;
        }
        xml += `
  </url>`;
      }

      // مقالات برای هر زبان
      for (const article of articles) {
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}/blog/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

        // Hreflang برای مقالات
        for (const altLang of LANGS) {
          xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}/blog/${article.slug}" />`;
        }
        xml += `
  </url>`;
      }

      // تست‌ها برای هر زبان
      for (const test of tests) {
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}/tests/${test.slug}</loc>
    <lastmod>${test.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

        // Hreflang برای تست‌ها
        for (const altLang of LANGS) {
          xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}/tests/${test.slug}" />`;
        }
        xml += `
  </url>`;
      }

      // تمرین‌ها برای هر زبان
      for (const exercise of exercises) {
        xml += `
  <url>
    <loc>${BASE_URL}/${lang}/exercises/${exercise.slug}</loc>
    <lastmod>${exercise.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

        // Hreflang برای تمرین‌ها
        for (const altLang of LANGS) {
          xml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}/exercises/${exercise.slug}" />`;
        }
        xml += `
  </url>`;
      }
    }

    xml += `
</urlset>`;

    // ذخیره فایل
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(filePath, xml, 'utf8');
    
    console.log('✅ Sitemap updated successfully!');
    console.log(`📊 Generated ${LANGS.length} languages`);
    console.log(`📄 ${articles.length} articles`);
    console.log(`🧠 ${tests.length} tests`);
    console.log(`💪 ${exercises.length} exercises`);
    
    return {
      success: true,
      stats: {
        languages: LANGS.length,
        articles: articles.length,
        tests: tests.length,
        exercises: exercises.length,
        totalUrls: LANGS.length * (1 + staticPages.length + articles.length + tests.length + exercises.length)
      }
    };

  } catch (error) {
    console.error('❌ Sitemap update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sitemap update failed'
    };
  }
}

/**
 * تولید Sitemap برای زبان خاص
 */
export async function generateLanguageSitemap(lang: string) {
  try {
    if (!LANGS.includes(lang)) {
      throw new Error(`Unsupported language: ${lang}`);
    }

    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    });

    const tests = await prisma.test.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const lastMod = new Date().toISOString();

    // صفحه اصلی
    xml += `
  <url>
    <loc>${BASE_URL}/${lang}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // مقالات
    for (const article of articles) {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}/blog/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // تست‌ها
    for (const test of tests) {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}/tests/${test.slug}</loc>
    <lastmod>${test.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    // ذخیره فایل
    const filePath = path.join(process.cwd(), 'public', `${lang}-sitemap.xml`);
    fs.writeFileSync(filePath, xml, 'utf8');
    
    console.log(`✅ ${lang} sitemap generated!`);
    return { success: true };

  } catch (error) {
    console.error(`❌ ${lang} sitemap error:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Sitemap generation failed' };
  }
}

/**
 * حذف Sitemap قدیمی
 */
export function cleanupOldSitemaps() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const files = fs.readdirSync(publicDir);
    
    files.forEach(file => {
      if (file.startsWith('sitemap') && file.endsWith('.xml')) {
        const filePath = path.join(publicDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ Removed old sitemap: ${file}`);
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Cleanup failed' };
  }
}















import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { IS_BUILD } from '@/lib/isBuild'

const languages = ['en', 'fa', 'ar', 'fr', 'ru', 'tr', 'es'];
const base = 'https://testology.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  try {
    // دریافت مقالات
    const articles = IS_BUILD ? [] : await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    }).catch(() => []);

    // دریافت تست‌ها
    const tests = IS_BUILD ? [] : await prisma.test.findMany({
      where: { isActive: true },
      select: { testSlug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' }
    }).catch(() => []);

    // صفحات اصلی برای هر زبان
    for (const lang of languages) {
      // صفحه اصلی
      urls.push({
        url: `${base}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: languages.reduce((acc: any, l: any) => {
            acc[l] = `${base}/${l}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });

      // صفحات ثابت
      const staticPages = [
        { path: '/about', priority: 0.8 },
        { path: '/contact', priority: 0.8 },
        { path: '/tests', priority: 0.9 },
        { path: '/blog', priority: 0.9 },
        { path: '/dashboard', priority: 0.7 },
        { path: '/profile', priority: 0.6 },
        { path: '/leaderboard', priority: 0.7 },
        { path: '/ranking', priority: 0.7 },
        { path: '/results', priority: 0.6 },
        { path: '/therapist', priority: 0.8 },
        { path: '/unauthorized', priority: 0.3 },
        { path: '/explore', priority: 0.8 },
        { path: '/places', priority: 0.7 },
        { path: '/gamification', priority: 0.6 },
        { path: '/advanced-features', priority: 0.6 }
      ];

      for (const page of staticPages) {
        urls.push({
          url: `${base}/${lang}${page.path}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: page.priority,
          alternates: {
            languages: languages.reduce((acc: any, l: any) => {
              acc[l] = `${base}/${l}${page.path}`;
              return acc;
            }, {} as Record<string, string>)
          }
        });
      }

      // مقالات برای هر زبان
      for (const article of articles) {
        urls.push({
          url: `${base}/${lang}/blog/${article.slug}`,
          lastModified: article.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: languages.reduce((acc: any, l: any) => {
              acc[l] = `${base}/${l}/blog/${article.slug}`;
              return acc;
            }, {} as Record<string, string>)
          }
        });
      }

      // تست‌ها برای هر زبان
      for (const test of tests) {
        urls.push({
          url: `${base}/${lang}/tests/${test.testSlug}`,
          lastModified: test.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: {
            languages: languages.reduce((acc: any, l: any) => {
              acc[l] = `${base}/${l}/tests/${test.testSlug}`;
              return acc;
            }, {} as Record<string, string>)
          }
        });
      }
    }

    // صفحات خاص بدون زبان
    urls.push({
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    });

    return urls;

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Fallback sitemap
    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}
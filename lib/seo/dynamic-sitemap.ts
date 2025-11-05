// مدیریت sitemap داینامیک
import { getAllTestSlugs } from './test-metadata'
import { getAllCategorySlugs } from './categories'
import { getAllCitySlugs } from './cities'

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemapEntries(): SitemapEntry[] {
  const baseUrl = 'https://testology.ir'
  const entries: SitemapEntry[] = []
  
  // صفحه اصلی
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0
  })
  
  // صفحات اصلی
  entries.push(
    {
      url: `${baseUrl}/tests`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/places`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  )
  
  // صفحات تست‌ها
  const testSlugs = getAllTestSlugs()
  testSlugs.forEach(slug => {
    entries.push({
      url: `${baseUrl}/tests/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    })
  })
  
  // صفحات دسته‌بندی‌ها
  const categorySlugs = getAllCategorySlugs()
  categorySlugs.forEach(slug => {
    entries.push({
      url: `${baseUrl}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    })
  })
  
  // صفحات شهرها
  const citySlugs = getAllCitySlugs()
  citySlugs.forEach(city => {
    entries.push({
      url: `${baseUrl}/places/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    })
  })
  
  return entries
}

export function generateSitemapXML(): string {
  const entries = generateSitemapEntries()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  
  return xml
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

Sitemap: https://testology.ir/sitemap.xml`
}

















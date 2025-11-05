// تولید sitemap داینامیک
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

export function generateSitemapIndex(): string {
  const baseUrl = 'https://testology.ir'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`
}

export function generateNewsSitemap(): string {
  const baseUrl = 'https://testology.ir'
  const today = new Date()
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>تستولوژی</news:name>
        <news:language>fa</news:language>
      </news:publication>
      <news:publication_date>${today.toISOString()}</news:publication_date>
      <news:title>تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها</news:title>
    </news:news>
  </url>
</urlset>`
}

export function generateImageSitemap(): string {
  const baseUrl = 'https://testology.ir'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/images/og-home.jpg</image:loc>
      <image:title>تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها</image:title>
      <image:caption>پلتفرم ارزیابی و بهبود مهارت‌ها</image:caption>
    </image:image>
  </url>
</urlset>`
}

















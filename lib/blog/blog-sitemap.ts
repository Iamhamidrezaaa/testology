// تولید sitemap برای بلاگ
import { prisma } from '@/lib/prisma'
import { IS_BUILD } from '@/lib/isBuild'

export interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export async function generateBlogSitemap(): Promise<SitemapEntry[]> {
  const baseUrl = 'https://testology.ir'
  const entries: SitemapEntry[] = []

  // صفحه اصلی بلاگ
  entries.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  })

  if (IS_BUILD) {
    return entries
  }

  // صفحات دسته‌بندی‌ها
  const categories = await prisma.blogCategory.findMany({
    select: { slug: true, updatedAt: true }
  }).catch(() => [])

  categories.forEach(category => {
    entries.push({
      url: `${baseUrl}/blog?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7
    })
  })

  // مقالات منتشرشده
  // مدل blogPost در schema وجود ندارد
  const posts: any[] = []

  posts.forEach(post => {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6
    })
  })

  return entries
}

export async function generateBlogSitemapXML(): Promise<string> {
  const entries = await generateBlogSitemap()
  
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

export async function generateBlogRSSFeed(): Promise<string> {
  // مدل blogPost در schema وجود ندارد
  const posts: any[] = []

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>بلاگ تستولوژی</title>
    <description>مجموعه‌ای از مقالات تخصصی روانشناسی، سلامت روان و بهبود شخصیت</description>
    <link>https://testology.ir/blog</link>
    <language>fa-IR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://testology.ir/blog/rss.xml" rel="self" type="application/rss+xml"/>
    
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>https://testology.ir/blog/${post.slug}</link>
      <guid>https://testology.ir/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt!).toUTCString()}</pubDate>
      <category><![CDATA[${post.category.name}]]></category>
      <author>${post.author.email} (${post.author.name})</author>
    </item>`).join('')}
  </channel>
</rss>`

  return rss
}

















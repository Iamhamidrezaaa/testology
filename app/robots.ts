import { MetadataRoute } from 'next'

const languages = ['en', 'fa', 'ar', 'fr', 'ru', 'tr', 'es'];
const base = 'https://testology.me';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next', '/private'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
        crawlDelay: 2,
      }
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      ...languages.map(lang => `${base}/${lang}/sitemap.xml`)
    ],
    host: base
  }
}
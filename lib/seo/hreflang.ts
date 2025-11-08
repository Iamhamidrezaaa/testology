/**
 * تولید تگ‌های hreflang برای SEO چندزبانه
 */

import { i18nConfig } from '@/i18n/config';

/**
 * تولید تگ‌های hreflang برای یک صفحه
 */
export function generateHreflangTags(slug: string, baseUrl: string = 'https://testology.com') {
  const tags = i18nConfig.locales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: `${baseUrl}/${locale}/${slug}`
  }));

  // افزودن x-default
  tags.push({
    rel: 'alternate',
    hreflang: 'en',
    href: `${baseUrl}/${i18nConfig.defaultLocale}/${slug}`
  });

  return tags;
}

/**
 * تولید canonical URL
 */
export function generateCanonicalUrl(locale: string, slug: string, baseUrl: string = 'https://testology.com') {
  return `${baseUrl}/${locale}/${slug}`;
}

/**
 * تولید متادیتای چندزبانه برای صفحات Next.js
 */
export function generateMultilingualMetadata(
  locale: string,
  slug: string,
  title: string,
  description: string
) {
  const baseUrl = 'https://testology.com';
  
  return {
    title,
    description,
    alternates: {
      canonical: generateCanonicalUrl(locale, slug, baseUrl),
      languages: Object.fromEntries(
        i18nConfig.locales.map(loc => [
          loc,
          `${baseUrl}/${loc}/${slug}`
        ])
      )
    },
    openGraph: {
      title,
      description,
      url: generateCanonicalUrl(locale, slug, baseUrl),
      locale: locale,
      alternateLocale: i18nConfig.locales.filter(l => l !== locale)
    }
  };
}

export default {
  generateHreflangTags,
  generateCanonicalUrl,
  generateMultilingualMetadata
};


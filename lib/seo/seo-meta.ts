// توابع تولید متادیتا برای هر صفحه
import { Metadata } from 'next';
import { TestMetadata, getTestMetadata } from './test-metadata';
import { CategoryData, getCategoryData } from './categories';
import { CityData, getCityData } from './cities';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: any;
}

export function generateTestSEO(slug: string): Metadata {
  const testData = getTestMetadata(slug);
  
  if (!testData) {
    return {
      title: 'تست یافت نشد | تستولوژی',
      description: 'تست مورد نظر یافت نشد'
    };
  }

  return {
    title: testData.title,
    description: testData.description,
    keywords: testData.keywords,
    openGraph: {
      title: testData.title,
      description: testData.description,
      url: testData.canonical,
      siteName: 'تستولوژی',
      images: [
        {
          url: testData.ogImage,
          width: 1200,
          height: 630,
          alt: testData.title,
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: testData.twitterCard,
      title: testData.title,
      description: testData.description,
      images: [testData.ogImage],
    },
    alternates: {
      canonical: testData.canonical,
    },
    other: {
      ...(testData.structuredData ? { 'application/ld+json': JSON.stringify(testData.structuredData) } : {}),
    },
  };
}

export function generateCategorySEO(slug: string): Metadata {
  const categoryData = getCategoryData(slug);
  
  if (!categoryData) {
    return {
      title: 'دسته‌بندی یافت نشد | تستولوژی',
      description: 'دسته‌بندی مورد نظر یافت نشد'
    };
  }

  return {
    title: categoryData.name + ' | تستولوژی',
    description: categoryData.description,
    keywords: categoryData.keywords,
    openGraph: {
      title: categoryData.name + ' | تستولوژی',
      description: categoryData.description,
      url: categoryData.canonical,
      siteName: 'تستولوژی',
      images: [
        {
          url: categoryData.ogImage,
          width: 1200,
          height: 630,
          alt: categoryData.name,
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: categoryData.name + ' | تستولوژی',
      description: categoryData.description,
      images: [categoryData.ogImage],
    },
    alternates: {
      canonical: categoryData.canonical,
    },
  };
}

export function generateCitySEO(slug: string): Metadata {
  const cityData = getCityData(slug);
  
  if (!cityData) {
    return {
      title: 'شهر یافت نشد | تستولوژی',
      description: 'شهر مورد نظر یافت نشد'
    };
  }

  return {
    title: `تست‌های روانشناسی در ${cityData.name} | تستولوژی`,
    description: cityData.description,
    keywords: cityData.keywords,
    openGraph: {
      title: `تست‌های روانشناسی در ${cityData.name} | تستولوژی`,
      description: cityData.description,
      url: cityData.canonical,
      siteName: 'تستولوژی',
      images: [
        {
          url: cityData.ogImage,
          width: 1200,
          height: 630,
          alt: `تست‌های روانشناسی در ${cityData.name}`,
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `تست‌های روانشناسی در ${cityData.name} | تستولوژی`,
      description: cityData.description,
      images: [cityData.ogImage],
    },
    alternates: {
      canonical: cityData.canonical,
    },
  };
}

export function generateHomeSEO(): Metadata {
  return {
    title: 'تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها',
    description: 'تستولوژی پلتفرمی برای ارزیابی و بهبود مهارت‌های شماست. با ما همراه باشید تا مسیر رشد خود را پیدا کنید.',
    keywords: ['تستولوژی', 'تست روانشناسی', 'ارزیابی شخصیت', 'تست آنلاین', 'تست رایگان'],
    openGraph: {
      title: 'تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها',
      description: 'تستولوژی پلتفرمی برای ارزیابی و بهبود مهارت‌های شماست. با ما همراه باشید تا مسیر رشد خود را پیدا کنید.',
      url: 'https://testology.ir',
      siteName: 'تستولوژی',
      images: [
        {
          url: '/images/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها',
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها',
      description: 'تستولوژی پلتفرمی برای ارزیابی و بهبود مهارت‌های شماست.',
      images: ['/images/og-home.jpg'],
    },
    alternates: {
      canonical: 'https://testology.ir',
    },
  };
}

















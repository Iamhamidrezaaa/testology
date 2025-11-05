# سئوی پیشرفته Testology

این پکیج شامل تمام ابزارها و فایل‌های مورد نیاز برای پیاده‌سازی سئوی پیشرفته در پلتفرم Testology است.

## ساختار فایل‌ها

### 1. متادیتای سئو
- `test-metadata.ts` - متادیتای اختصاصی هر تست
- `categories.ts` - دیتای دسته‌بندی‌ها
- `cities.ts` - دیتای شهرها
- `seo-meta.ts` - توابع تولید متادیتا

### 2. صفحات داینامیک
- `app/tests/[slug]/page.tsx` - صفحات تست‌ها
- `app/categories/[slug]/page.tsx` - صفحات دسته‌بندی‌ها
- `app/places/[city]/page.tsx` - صفحات شهرها

### 3. مدیریت محتوا
- `database-content.ts` - اتصال محتوای مرتبط از دیتابیس
- `internal-linking.ts` - مدیریت لینک‌دهی داخلی
- `structured-data.ts` - مدیریت structured data

### 4. بهینه‌سازی
- `image-optimization.ts` - مدیریت تصاویر سئو
- `performance.ts` - مدیریت performance و Core Web Vitals
- `analytics.ts` - مدیریت analytics و tracking

### 5. مدیریت URL
- `advanced-redirects.ts` - مدیریت redirects پیشرفته
- `dynamic-sitemap.ts` - مدیریت sitemap داینامیک
- `middleware.ts` - مدیریت redirects در middleware

## ویژگی‌های پیاده‌سازی شده

### ✅ URLهای سئوپذیر
- `/tests/self-esteem` به‌جای `/tests/rosenberg`
- `/categories/personality` به‌جای `/category/personality`
- `/places/tehran` به‌جای `/city/tehran`

### ✅ متادیتای سئو
- Title و Description بهینه
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Structured Data (Schema.org)

### ✅ صفحات لندینگ
- صفحات دسته‌بندی‌ها با تست‌های مرتبط
- صفحات شهرها با تست‌های محلی
- محتوای مرتبط و مقالات

### ✅ بهینه‌سازی عملکرد
- Lazy loading تصاویر
- Critical CSS
- Resource hints
- Service Worker
- Core Web Vitals monitoring

### ✅ Analytics و Tracking
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- Hotjar
- Custom events

## نحوه استفاده

### 1. اضافه کردن تست جدید
```typescript
// در test-metadata.ts
export const testMetadata: Record<string, TestMetadata> = {
  'new-test': {
    id: 'new-test',
    slug: 'new-test',
    title: 'تست جدید',
    description: 'توضیحات تست جدید',
    category: 'personality',
    keywords: ['کلمه کلیدی 1', 'کلمه کلیدی 2'],
    ogImage: '/images/tests/new-test-og.jpg',
    canonical: '/tests/new-test',
    twitterCard: 'summary_large_image'
  }
}
```

### 2. اضافه کردن دسته‌بندی جدید
```typescript
// در categories.ts
export const categoriesData: Record<string, CategoryData> = {
  'new-category': {
    id: 'new-category',
    slug: 'new-category',
    name: 'دسته‌بندی جدید',
    description: 'توضیحات دسته‌بندی جدید',
    keywords: ['کلمه کلیدی 1', 'کلمه کلیدی 2'],
    tests: ['test1', 'test2'],
    articles: ['article1', 'article2'],
    ogImage: '/images/categories/new-category-og.jpg',
    canonical: '/categories/new-category'
  }
}
```

### 3. اضافه کردن شهر جدید
```typescript
// در cities.ts
export const citiesData: Record<string, CityData> = {
  'new-city': {
    id: 'new-city',
    slug: 'new-city',
    name: 'شهر جدید',
    province: 'استان جدید',
    description: 'توضیحات شهر جدید',
    keywords: ['کلمه کلیدی 1', 'کلمه کلیدی 2'],
    relatedTests: ['test1', 'test2'],
    relatedArticles: ['article1', 'article2'],
    ogImage: '/images/cities/new-city-og.jpg',
    canonical: '/places/new-city'
  }
}
```

## تصاویر مورد نیاز

### تصاویر تست‌ها
- `/images/tests/self-esteem-og.jpg`
- `/images/tests/stress-og.jpg`
- `/images/tests/anxiety-og.jpg`
- `/images/tests/depression-og.jpg`
- `/images/tests/life-satisfaction-og.jpg`

### تصاویر دسته‌بندی‌ها
- `/images/categories/personality-og.jpg`
- `/images/categories/mental-health-og.jpg`
- `/images/categories/wellbeing-og.jpg`
- `/images/categories/anxiety-og.jpg`

### تصاویر شهرها
- `/images/cities/tehran-og.jpg`
- `/images/cities/mashhad-og.jpg`
- `/images/cities/isfahan-og.jpg`
- `/images/cities/shiraz-og.jpg`
- `/images/cities/tabriz-og.jpg`

### تصویر اصلی
- `/images/og-home.jpg`

## تنظیمات Analytics

### Google Analytics
```typescript
// در layout.tsx
const gaId = process.env.NEXT_PUBLIC_GA_ID
```

### Google Tag Manager
```typescript
// در layout.tsx
const gtmId = process.env.NEXT_PUBLIC_GTM_ID
```

### Facebook Pixel
```typescript
// در layout.tsx
const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
```

## تست و بررسی

### 1. بررسی سئو
- Google Search Console
- Google PageSpeed Insights
- GTmetrix
- Screaming Frog

### 2. بررسی عملکرد
- Chrome DevTools
- Lighthouse
- WebPageTest
- Core Web Vitals

### 3. بررسی Analytics
- Google Analytics
- Google Tag Manager
- Facebook Pixel
- Hotjar

## نکات مهم

1. **تصاویر**: تمام تصاویر سئو باید با ابعاد 1200x630 پیکسل و فرمت JPG یا WebP باشند
2. **متن**: تمام متون باید به زبان فارسی و با کیفیت بالا باشند
3. **لینک‌ها**: لینک‌دهی داخلی باید طبیعی و مفید باشد
4. **سرعت**: صفحات باید در کمتر از 3 ثانیه لود شوند
5. **موبایل**: تمام صفحات باید responsive باشند

## پشتیبانی

برای سوالات و مشکلات، با تیم توسعه تماس بگیرید.

















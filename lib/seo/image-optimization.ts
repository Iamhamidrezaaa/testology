// مدیریت تصاویر سئو و بهینه‌سازی
export interface SEOImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

export function generateTestOGImage(testSlug: string, testTitle: string): SEOImage {
  return {
    url: `/images/tests/${testSlug}-og.jpg`,
    width: 1200,
    height: 630,
    alt: testTitle,
    type: 'image/jpeg'
  }
}

export function generateCategoryOGImage(categorySlug: string, categoryName: string): SEOImage {
  return {
    url: `/images/categories/${categorySlug}-og.jpg`,
    width: 1200,
    height: 630,
    alt: categoryName,
    type: 'image/jpeg'
  }
}

export function generateCityOGImage(citySlug: string, cityName: string): SEOImage {
  return {
    url: `/images/cities/${citySlug}-og.jpg`,
    width: 1200,
    height: 630,
    alt: cityName,
    type: 'image/jpeg'
  }
}

export function generateHomeOGImage(): SEOImage {
  return {
    url: '/images/og-home.jpg',
    width: 1200,
    height: 630,
    alt: 'تستولوژی - پلتفرم ارزیابی و بهبود مهارت‌ها',
    type: 'image/jpeg'
  }
}

// لیست تصاویر مورد نیاز برای تولید
export const requiredImages = [
  // تصاویر تست‌ها
  '/images/tests/self-esteem-og.jpg',
  '/images/tests/stress-og.jpg',
  '/images/tests/anxiety-og.jpg',
  '/images/tests/depression-og.jpg',
  '/images/tests/life-satisfaction-og.jpg',
  
  // تصاویر دسته‌بندی‌ها
  '/images/categories/personality-og.jpg',
  '/images/categories/mental-health-og.jpg',
  '/images/categories/wellbeing-og.jpg',
  '/images/categories/anxiety-og.jpg',
  
  // تصاویر شهرها
  '/images/cities/tehran-og.jpg',
  '/images/cities/mashhad-og.jpg',
  '/images/cities/isfahan-og.jpg',
  '/images/cities/shiraz-og.jpg',
  '/images/cities/tabriz-og.jpg',
  
  // تصویر اصلی
  '/images/og-home.jpg'
]

export function validateImageExists(imagePath: string): boolean {
  // این تابع باید با سیستم فایل یا CDN بررسی کند که تصویر وجود دارد
  // فعلاً true برمی‌گردانیم
  return true
}

export function getImageDimensions(imagePath: string): { width: number; height: number } | null {
  // این تابع باید ابعاد تصویر را از فایل بخواند
  // فعلاً ابعاد پیش‌فرض برمی‌گردانیم
  return { width: 1200, height: 630 }
}

















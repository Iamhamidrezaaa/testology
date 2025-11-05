// تولید تصاویر سئو به صورت خودکار
export interface SEOImageConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  title: string;
  subtitle?: string;
  logo?: string;
  pattern?: string;
}

export function generateTestOGImage(testSlug: string, testTitle: string): string {
  // این تابع باید تصویر OG را برای تست تولید کند
  // فعلاً URL تصویر پیش‌فرض برمی‌گردانیم
  return `/images/tests/${testSlug}-og.jpg`
}

export function generateCategoryOGImage(categorySlug: string, categoryName: string): string {
  return `/images/categories/${categorySlug}-og.jpg`
}

export function generateCityOGImage(citySlug: string, cityName: string): string {
  return `/images/cities/${citySlug}-og.jpg`
}

export function generateHomeOGImage(): string {
  return `/images/og-home.jpg`
}

// لیست تصاویر مورد نیاز برای تولید
export const requiredImages = [
  // تصاویر تست‌ها
  {
    path: '/images/tests/self-esteem-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      title: 'تست عزت نفس روزنبرگ',
      subtitle: 'ارزیابی رایگان عزت نفس'
    }
  },
  {
    path: '/images/tests/stress-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
      title: 'تست استرس ادراک‌شده PSS',
      subtitle: 'ارزیابی سطح استرس'
    }
  },
  {
    path: '/images/tests/anxiety-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#f59e0b',
      textColor: '#ffffff',
      title: 'تست اضطراب GAD-7',
      subtitle: 'ارزیابی اضطراب عمومی'
    }
  },
  {
    path: '/images/tests/depression-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      title: 'تست افسردگی PHQ-9',
      subtitle: 'ارزیابی افسردگی'
    }
  },
  {
    path: '/images/tests/life-satisfaction-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      title: 'تست رضایت از زندگی SWLS',
      subtitle: 'ارزیابی رضایت از زندگی'
    }
  },
  
  // تصاویر دسته‌بندی‌ها
  {
    path: '/images/categories/personality-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      title: 'تست‌های شخصیت',
      subtitle: 'شناخت بهتر خود و ویژگی‌های شخصیتی'
    }
  },
  {
    path: '/images/categories/mental-health-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
      title: 'سلامت روان',
      subtitle: 'تست‌های سلامت روان و ارزیابی روانی'
    }
  },
  {
    path: '/images/categories/wellbeing-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      title: 'رفاه و رضایت',
      subtitle: 'تست‌های رفاه و رضایت از زندگی'
    }
  },
  {
    path: '/images/categories/anxiety-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#f59e0b',
      textColor: '#ffffff',
      title: 'اضطراب و نگرانی',
      subtitle: 'تست‌ها و راهکارهای مقابله با اضطراب'
    }
  },
  
  // تصاویر شهرها
  {
    path: '/images/cities/tehran-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      title: 'تست‌های روانشناسی در تهران',
      subtitle: 'ارزیابی شخصیت و سلامت روان در تهران'
    }
  },
  {
    path: '/images/cities/mashhad-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      title: 'تست‌های روانشناسی در مشهد',
      subtitle: 'ارزیابی شخصیت و سلامت روان در مشهد'
    }
  },
  {
    path: '/images/cities/isfahan-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#059669',
      textColor: '#ffffff',
      title: 'تست‌های روانشناسی در اصفهان',
      subtitle: 'ارزیابی شخصیت و سلامت روان در اصفهان'
    }
  },
  {
    path: '/images/cities/shiraz-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      title: 'تست‌های روانشناسی در شیراز',
      subtitle: 'ارزیابی شخصیت و سلامت روان در شیراز'
    }
  },
  {
    path: '/images/cities/tabriz-og.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#ea580c',
      textColor: '#ffffff',
      title: 'تست‌های روانشناسی در تبریز',
      subtitle: 'ارزیابی شخصیت و سلامت روان در تبریز'
    }
  },
  
  // تصویر اصلی
  {
    path: '/images/og-home.jpg',
    config: {
      width: 1200,
      height: 630,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      title: 'تستولوژی',
      subtitle: 'پلتفرم ارزیابی و بهبود مهارت‌ها'
    }
  }
]

export function generateImageScript(): string {
  return `
    // تصاویر سئو مورد نیاز
    const requiredImages = ${JSON.stringify(requiredImages, null, 2)};
    
    // بررسی وجود تصاویر
    function checkImageExists(imagePath) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
      });
    }
    
    // تولید تصاویر سئو
    async function generateSEOImages() {
      for (const image of requiredImages) {
        const exists = await checkImageExists(image.path);
        if (!exists) {
          console.warn('تصویر سئو یافت نشد:', image.path);
          // اینجا می‌توانید تصویر را تولید کنید
        }
      }
    }
    
    // اجرای بررسی تصاویر
    generateSEOImages();
  `
}

















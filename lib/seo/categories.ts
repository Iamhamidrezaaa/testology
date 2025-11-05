// دیتا برای دسته‌بندی‌ها
export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  tests: string[];
  articles: string[];
  ogImage: string;
  canonical: string;
}

export const categoriesData: Record<string, CategoryData> = {
  'personality': {
    id: 'personality',
    slug: 'personality',
    name: 'تست‌های شخصیت',
    description: 'مجموعه‌ای از تست‌های شخصیت برای شناخت بهتر خود و ویژگی‌های شخصیتی شما',
    keywords: ['تست شخصیت', 'ارزیابی شخصیت', 'تست روانشناسی', 'شناخت خود'],
    tests: ['self-esteem'],
    articles: ['personality-development', 'self-awareness'],
    ogImage: '/images/categories/personality-og.jpg',
    canonical: '/categories/personality'
  },
  'mental-health': {
    id: 'mental-health',
    slug: 'mental-health',
    name: 'سلامت روان',
    description: 'تست‌های سلامت روان برای ارزیابی و بهبود وضعیت روانی شما',
    keywords: ['سلامت روان', 'تست روانشناسی', 'ارزیابی روانی', 'تست سلامت'],
    tests: ['stress', 'anxiety', 'depression'],
    articles: ['mental-health-tips', 'stress-management'],
    ogImage: '/images/categories/mental-health-og.jpg',
    canonical: '/categories/mental-health'
  },
  'wellbeing': {
    id: 'wellbeing',
    slug: 'wellbeing',
    name: 'رفاه و رضایت',
    description: 'تست‌های رفاه و رضایت برای ارزیابی کیفیت زندگی و رضایت از آن',
    keywords: ['رفاه', 'رضایت از زندگی', 'کیفیت زندگی', 'تست رفاه'],
    tests: ['life-satisfaction'],
    articles: ['wellbeing-guide', 'life-satisfaction-tips'],
    ogImage: '/images/categories/wellbeing-og.jpg',
    canonical: '/categories/wellbeing'
  },
  'anxiety': {
    id: 'anxiety',
    slug: 'anxiety',
    name: 'اضطراب و نگرانی',
    description: 'تست‌ها و راهکارهای مقابله با اضطراب و نگرانی',
    keywords: ['اضطراب', 'نگرانی', 'تست اضطراب', 'مدیریت اضطراب'],
    tests: ['anxiety'],
    articles: ['anxiety-management', 'coping-strategies'],
    ogImage: '/images/categories/anxiety-og.jpg',
    canonical: '/categories/anxiety'
  }
};

export function getCategoryData(slug: string): CategoryData | null {
  return categoriesData[slug] || null;
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(categoriesData);
}

















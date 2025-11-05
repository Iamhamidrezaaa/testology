// دیتا برای شهرها (در آینده سفرها)
export interface CityData {
  id: string;
  slug: string;
  name: string;
  province: string;
  description: string;
  keywords: string[];
  population?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  ogImage: string;
  canonical: string;
  relatedTests: string[];
  relatedArticles: string[];
}

export const citiesData: Record<string, CityData> = {
  'tehran': {
    id: 'tehran',
    slug: 'tehran',
    name: 'تهران',
    province: 'تهران',
    description: 'تهران پایتخت ایران و بزرگترین شهر کشور است. تست‌های روانشناسی و ارزیابی شخصیت در تهران',
    keywords: ['تهران', 'تست روانشناسی تهران', 'ارزیابی شخصیت تهران', 'تستولوژی تهران'],
    population: 8500000,
    coordinates: {
      lat: 35.6892,
      lng: 51.3890
    },
    ogImage: '/images/cities/tehran-og.jpg',
    canonical: '/places/tehran',
    relatedTests: ['self-esteem', 'stress', 'anxiety'],
    relatedArticles: ['tehran-psychology', 'urban-stress']
  },
  'mashhad': {
    id: 'mashhad',
    slug: 'mashhad',
    name: 'مشهد',
    province: 'خراسان رضوی',
    description: 'مشهد دومین شهر بزرگ ایران و مرکز مذهبی کشور است. تست‌های روانشناسی در مشهد',
    keywords: ['مشهد', 'تست روانشناسی مشهد', 'ارزیابی شخصیت مشهد', 'تستولوژی مشهد'],
    population: 3000000,
    coordinates: {
      lat: 36.2605,
      lng: 59.6168
    },
    ogImage: '/images/cities/mashhad-og.jpg',
    canonical: '/places/mashhad',
    relatedTests: ['self-esteem', 'life-satisfaction'],
    relatedArticles: ['mashhad-psychology', 'spiritual-wellbeing']
  },
  'isfahan': {
    id: 'isfahan',
    slug: 'isfahan',
    name: 'اصفهان',
    province: 'اصفهان',
    description: 'اصفهان شهر تاریخی و فرهنگی ایران است. تست‌های روانشناسی و ارزیابی در اصفهان',
    keywords: ['اصفهان', 'تست روانشناسی اصفهان', 'ارزیابی شخصیت اصفهان', 'تستولوژی اصفهان'],
    population: 2000000,
    coordinates: {
      lat: 32.6546,
      lng: 51.6680
    },
    ogImage: '/images/cities/isfahan-og.jpg',
    canonical: '/places/isfahan',
    relatedTests: ['stress', 'anxiety', 'life-satisfaction'],
    relatedArticles: ['isfahan-psychology', 'cultural-wellbeing']
  },
  'shiraz': {
    id: 'shiraz',
    slug: 'shiraz',
    name: 'شیراز',
    province: 'فارس',
    description: 'شیراز شهر شعر و ادب ایران است. تست‌های روانشناسی در شیراز',
    keywords: ['شیراز', 'تست روانشناسی شیراز', 'ارزیابی شخصیت شیراز', 'تستولوژی شیراز'],
    population: 1500000,
    coordinates: {
      lat: 29.5918,
      lng: 52.5837
    },
    ogImage: '/images/cities/shiraz-og.jpg',
    canonical: '/places/shiraz',
    relatedTests: ['depression', 'life-satisfaction'],
    relatedArticles: ['shiraz-psychology', 'art-therapy']
  },
  'tabriz': {
    id: 'tabriz',
    slug: 'tabriz',
    name: 'تبریز',
    province: 'آذربایجان شرقی',
    description: 'تبریز یکی از شهرهای مهم شمال غرب ایران است. تست‌های روانشناسی در تبریز',
    keywords: ['تبریز', 'تست روانشناسی تبریز', 'ارزیابی شخصیت تبریز', 'تستولوژی تبریز'],
    population: 1500000,
    coordinates: {
      lat: 38.0800,
      lng: 46.2919
    },
    ogImage: '/images/cities/tabriz-og.jpg',
    canonical: '/places/tabriz',
    relatedTests: ['self-esteem', 'stress'],
    relatedArticles: ['tabriz-psychology', 'cultural-identity']
  }
};

export function getCityData(slug: string): CityData | null {
  return citiesData[slug] || null;
}

export function getAllCitySlugs(): string[] {
  return Object.keys(citiesData);
}

















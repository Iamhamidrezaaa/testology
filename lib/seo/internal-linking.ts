// مدیریت لینک‌دهی داخلی برای سئو
import { getTestMetadata } from './test-metadata'
import { getCategoryData } from './categories'
import { getCityData } from './cities'

export interface InternalLink {
  url: string;
  title: string;
  description: string;
  type: 'test' | 'category' | 'city' | 'article' | 'page';
  priority: number;
}

export function getRelatedTestsForTest(testSlug: string): InternalLink[] {
  const testData = getTestMetadata(testSlug)
  if (!testData) return []

  const relatedTests: InternalLink[] = []
  
  // تست‌های هم‌دسته
  const categoryData = getCategoryData(testData.category)
  if (categoryData) {
    categoryData.tests.forEach(slug => {
      if (slug !== testSlug) {
        const relatedTest = getTestMetadata(slug)
        if (relatedTest) {
          relatedTests.push({
            url: relatedTest.canonical,
            title: relatedTest.title,
            description: relatedTest.description,
            type: 'test',
            priority: 0.8
          })
        }
      }
    })
  }

  return relatedTests.slice(0, 5) // حداکثر 5 تست مرتبط
}

export function getRelatedCategoriesForTest(testSlug: string): InternalLink[] {
  const testData = getTestMetadata(testSlug)
  if (!testData) return []

  const categoryData = getCategoryData(testData.category)
  if (!categoryData) return []

  return [{
    url: categoryData.canonical,
    title: categoryData.name,
    description: categoryData.description,
    type: 'category',
    priority: 0.7
  }]
}

export function getRelatedCitiesForTest(testSlug: string): InternalLink[] {
  // این تابع باید از دیتابیس شهرهای مرتبط با تست را بخواند
  // فعلاً شهرهای پیش‌فرض برمی‌گردانیم
  const cities = ['tehran', 'mashhad', 'isfahan']
  
  return cities.map(citySlug => {
    const cityData = getCityData(citySlug)
    if (!cityData) return null
    
    return {
      url: cityData.canonical,
      title: `تست‌های روانشناسی در ${cityData.name}`,
      description: cityData.description,
      type: 'city',
      priority: 0.6
    }
  }).filter(Boolean) as InternalLink[]
}

export function getRelatedTestsForCategory(categorySlug: string): InternalLink[] {
  const categoryData = getCategoryData(categorySlug)
  if (!categoryData) return []

  return categoryData.tests.map(testSlug => {
    const testData = getTestMetadata(testSlug)
    if (!testData) return null
    
    return {
      url: testData.canonical,
      title: testData.title,
      description: testData.description,
      type: 'test',
      priority: 0.8
    }
  }).filter(Boolean) as InternalLink[]
}

export function getRelatedCategoriesForCategory(categorySlug: string): InternalLink[] {
  // این تابع باید دسته‌بندی‌های مرتبط را از دیتابیس بخواند
  // فعلاً دسته‌بندی‌های پیش‌فرض برمی‌گردانیم
  const allCategories = ['personality', 'mental-health', 'wellbeing', 'anxiety']
  
  return allCategories
    .filter(slug => slug !== categorySlug)
    .map(slug => {
      const categoryData = getCategoryData(slug)
      if (!categoryData) return null
      
      return {
        url: categoryData.canonical,
        title: categoryData.name,
        description: categoryData.description,
        type: 'category',
        priority: 0.6
      }
    })
    .filter(Boolean) as InternalLink[]
}

export function getRelatedTestsForCity(citySlug: string): InternalLink[] {
  const cityData = getCityData(citySlug)
  if (!cityData) return []

  return cityData.relatedTests.map(testSlug => {
    const testData = getTestMetadata(testSlug)
    if (!testData) return null
    
    return {
      url: testData.canonical,
      title: testData.title,
      description: testData.description,
      type: 'test',
      priority: 0.8
    }
  }).filter(Boolean) as InternalLink[]
}

export function getRelatedCitiesForCity(citySlug: string): InternalLink[] {
  const allCities = ['tehran', 'mashhad', 'isfahan', 'shiraz', 'tabriz']
  
  return allCities
    .filter(slug => slug !== citySlug)
    .map(slug => {
      const cityData = getCityData(slug)
      if (!cityData) return null
      
      return {
        url: cityData.canonical,
        title: `تست‌های روانشناسی در ${cityData.name}`,
        description: cityData.description,
        type: 'city',
        priority: 0.6
      }
    })
    .filter(Boolean) as InternalLink[]
}

export function getBreadcrumbLinks(currentPath: string): InternalLink[] {
  const pathSegments = currentPath.split('/').filter(Boolean)
  const breadcrumbs: InternalLink[] = []
  
  // صفحه اصلی
  breadcrumbs.push({
    url: '/',
    title: 'خانه',
    description: 'صفحه اصلی تستولوژی',
    type: 'page',
    priority: 1
  })
  
  // مسیرهای میانی
  let currentUrl = ''
  for (let i = 0; i < pathSegments.length - 1; i++) {
    currentUrl += `/${pathSegments[i]}`
    
    if (pathSegments[i] === 'tests') {
      breadcrumbs.push({
        url: '/tests',
        title: 'تست‌ها',
        description: 'لیست تمام تست‌های روانشناسی',
        type: 'page',
        priority: 0.8
      })
    } else if (pathSegments[i] === 'categories') {
      breadcrumbs.push({
        url: '/categories',
        title: 'دسته‌بندی‌ها',
        description: 'دسته‌بندی‌های تست‌های روانشناسی',
        type: 'page',
        priority: 0.8
      })
    } else if (pathSegments[i] === 'places') {
      breadcrumbs.push({
        url: '/places',
        title: 'شهرها',
        description: 'تست‌های روانشناسی در شهرهای مختلف',
        type: 'page',
        priority: 0.8
      })
    }
  }
  
  return breadcrumbs
}

















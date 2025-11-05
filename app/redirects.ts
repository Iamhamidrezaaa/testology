// مدیریت redirects برای URLهای قدیمی
export const redirects = {
  // Redirects برای تست‌های قدیمی
  '/tests/rosenberg': '/tests/self-esteem',
  '/tests/pss': '/tests/stress',
  '/tests/gad7': '/tests/anxiety',
  '/tests/phq9': '/tests/depression',
  '/tests/swls': '/tests/life-satisfaction',
  
  // Redirects برای دسته‌بندی‌های قدیمی
  '/category/personality': '/categories/personality',
  '/category/mental-health': '/categories/mental-health',
  '/category/wellbeing': '/categories/wellbeing',
  '/category/anxiety': '/categories/anxiety',
  
  // Redirects برای شهرهای قدیمی
  '/city/tehran': '/places/tehran',
  '/city/mashhad': '/places/mashhad',
  '/city/isfahan': '/places/isfahan',
  '/city/shiraz': '/places/shiraz',
  '/city/tabriz': '/places/tabriz',
};

export function getRedirectUrl(pathname: string): string | null {
  return redirects[pathname as keyof typeof redirects] || null;
}

















// سیستم کش ساده برای بهبود عملکرد
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // حداکثر تعداد آیتم‌ها

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 دقیقه پیش‌فرض
    // اگر کش پر است، قدیمی‌ترین آیتم را حذف کن
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // بررسی انقضا
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // دریافت آمار کش
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }

  // پاک کردن آیتم‌های منقضی
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// نمونه سراسری کش
export const cache = new SimpleCache();

// تابع کمکی برای کش کردن API calls
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // ابتدا از کش بخوان
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  // اگر در کش نیست، از منبع اصلی بخوان
  const data = await fetcher();
  
  // در کش ذخیره کن
  cache.set(key, data, ttl);
  
  return data;
}

// تابع برای باطل کردن کش
export function invalidateCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }

  const stats = cache.getStats();
  for (const key of stats.keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

// پاک‌سازی خودکار هر 10 دقیقه
if (typeof window === 'undefined') { // فقط در سرور
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}






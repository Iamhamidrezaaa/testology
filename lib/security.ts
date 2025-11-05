// سیستم امنیت و Rate Limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private defaultLimit = 100; // درخواست در ساعت
  private defaultWindow = 60 * 60 * 1000; // 1 ساعت

  // بررسی محدودیت
  isAllowed(
    key: string, 
    limit: number = this.defaultLimit, 
    window: number = this.defaultWindow
  ): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // ایجاد یا بازنشانی ورودی
      this.limits.set(key, {
        count: 1,
        resetTime: now + window
      });
      return true;
    }

    if (entry.count >= limit) {
      return false;
    }

    entry.count++;
    return true;
  }

  // دریافت اطلاعات محدودیت
  getLimitInfo(key: string): { count: number; resetTime: number; remaining: number } | null {
    const entry = this.limits.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.resetTime) {
      this.limits.delete(key);
      return null;
    }

    return {
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, this.defaultLimit - entry.count)
    };
  }

  // پاک کردن محدودیت‌های منقضی
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// پاک‌سازی خودکار هر 5 دقیقه
if (typeof window === 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

// تابع middleware برای Rate Limiting
export function withRateLimit(
  limit: number = 100,
  window: number = 60 * 60 * 1000,
  keyGenerator?: (req: Request) => string
) {
  return (req: Request) => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req);
    
    if (!rateLimiter.isAllowed(key, limit, window)) {
      return new Response(
        JSON.stringify({ 
          error: 'Too Many Requests',
          message: 'درخواست‌های شما بیش از حد مجاز است'
        }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return null; // مجاز است
  };
}

// تولید کلید پیش‌فرض
function getDefaultKey(req: Request): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`.substring(0, 50);
}

// Security Headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// تابع اعتبارسنجی ورودی
export function validateInput(data: any, schema: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // بررسی وجود فیلد
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`فیلد ${field} الزامی است`);
      continue;
    }

    // بررسی نوع داده
    if (value !== undefined && rules.type) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`فیلد ${field} باید رشته باشد`);
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`فیلد ${field} باید عدد باشد`);
      } else if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`فیلد ${field} باید ایمیل معتبر باشد`);
      }
    }

    // بررسی طول
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`فیلد ${field} باید حداقل ${rules.minLength} کاراکتر باشد`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`فیلد ${field} باید حداکثر ${rules.maxLength} کاراکتر باشد`);
    }

    // بررسی محدوده عددی
    if (rules.min && value < rules.min) {
      errors.push(`فیلد ${field} باید حداقل ${rules.min} باشد`);
    }
    if (rules.max && value > rules.max) {
      errors.push(`فیلد ${field} باید حداکثر ${rules.max} باشد`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// اسکیماهای پیش‌فرض
export const ValidationSchemas = {
  email: {
    required: true,
    type: 'email',
    maxLength: 255
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128
  },
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50
  },
  phone: {
    required: false,
    type: 'string',
    minLength: 10,
    maxLength: 15
  },
  age: {
    required: false,
    type: 'number',
    min: 1,
    max: 120
  }
};






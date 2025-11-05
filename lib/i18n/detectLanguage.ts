import parser from "accept-language-parser";

const fallbackLang = "en";
const supported = ["en", "fa", "ar", "fr", "ru", "tr", "es"];

/**
 * تشخیص زبان کاربر از هدر مرورگر
 * این تابع فقط در محیط Edge اجرا می‌شود (بدون geoip)
 * @param req - Request object
 * @returns کد زبان تشخیص داده شده
 */
export function detectLanguage(req: Request): string {
  try {
    // دریافت زبان مرورگر
    const acceptLang = req.headers.get("accept-language");
    const parsed = parser.pick(supported, acceptLang || "", { loose: true });
    
    // اولویت: زبان مرورگر > fallback
    return parsed || fallbackLang;
  } catch (error) {
    console.error('Language detection error:', error);
    return fallbackLang;
  }
}

/**
 * تبدیل کد کشور به کد زبان
 * @param country - کد کشور (مثل IR, SA, FR)
 * @returns کد زبان
 */
function getLanguageFromCountry(country?: string): string {
  const countryLanguageMap: Record<string, string> = {
    'IR': 'fa',  // ایران → فارسی
    'AF': 'fa',  // افغانستان → فارسی
    'TJ': 'fa',  // تاجیکستان → فارسی
    'SA': 'ar',  // عربستان → عربی
    'AE': 'ar',  // امارات → عربی
    'EG': 'ar',  // مصر → عربی
    'IQ': 'ar',  // عراق → عربی
    'SY': 'ar',  // سوریه → عربی
    'JO': 'ar',  // اردن → عربی
    'LB': 'ar',  // لبنان → عربی
    'PS': 'ar',  // فلسطین → عربی
    'MA': 'ar',  // مراکش → عربی
    'TN': 'ar',  // تونس → عربی
    'DZ': 'ar',  // الجزایر → عربی
    'LY': 'ar',  // لیبی → عربی
    'SD': 'ar',  // سودان → عربی
    'FR': 'fr',  // فرانسه → فرانسوی
    'BE': 'fr',  // بلژیک → فرانسوی
    'CH': 'fr',  // سوئیس → فرانسوی
    'CA': 'fr',  // کانادا → فرانسوی
    'RU': 'ru',  // روسیه → روسی
    'BY': 'ru',  // بلاروس → روسی
    'KZ': 'ru',  // قزاقستان → روسی
    'KG': 'ru',  // قرقیزستان → روسی
    'UZ': 'ru',  // ازبکستان → روسی
    'TR': 'tr',  // ترکیه → ترکی
    'CY': 'tr',  // قبرس → ترکی
    'ES': 'es',  // اسپانیا → اسپانیایی
    'MX': 'es',  // مکزیک → اسپانیایی
    'AR': 'es',  // آرژانتین → اسپانیایی
    'CO': 'es',  // کلمبیا → اسپانیایی
    'PE': 'es',  // پرو → اسپانیایی
    'VE': 'es',  // ونزوئلا → اسپانیایی
    'CL': 'es',  // شیلی → اسپانیایی
    'EC': 'es',  // اکوادور → اسپانیایی
    'BO': 'es',  // بولیوی → اسپانیایی
    'PY': 'es',  // پاراگوئه → اسپانیایی
    'UY': 'es',  // اروگوئه → اسپانیایی
    'CR': 'es',  // کاستاریکا → اسپانیایی
    'PA': 'es',  // پاناما → اسپانیایی
    'GT': 'es',  // گواتمالا → اسپانیایی
    'HN': 'es',  // هندوراس → اسپانیایی
    'SV': 'es',  // السالوادور → اسپانیایی
    'NI': 'es',  // نیکاراگوئه → اسپانیایی
    'CU': 'es',  // کوبا → اسپانیایی
    'DO': 'es',  // جمهوری دومینیکن → اسپانیایی
    'PR': 'es',  // پورتوریکو → اسپانیایی
  };

  return countryLanguageMap[country || ''] || 'en';
}

/**
 * تشخیص زبان از User-Agent (اختیاری)
 * @param userAgent - User-Agent string
 * @returns کد زبان
 */
export function detectLanguageFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  // تشخیص زبان از User-Agent
  if (ua.includes('fa') || ua.includes('persian')) return 'fa';
  if (ua.includes('ar') || ua.includes('arabic')) return 'ar';
  if (ua.includes('fr') || ua.includes('french')) return 'fr';
  if (ua.includes('ru') || ua.includes('russian')) return 'ru';
  if (ua.includes('tr') || ua.includes('turkish')) return 'tr';
  if (ua.includes('es') || ua.includes('spanish')) return 'es';
  
  return 'en';
}

/**
 * تشخیص زبان از Cookie (اختیاری)
 * @param cookieHeader - Cookie header
 * @returns کد زبان
 */
export function detectLanguageFromCookie(cookieHeader: string): string {
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const langCookie = cookies['testology-language'] || cookies['lang'];
  
  if (langCookie && supported.includes(langCookie)) {
    return langCookie;
  }
  
  return 'en';
}

/**
 * تشخیص زبان ترکیبی (IP + Browser + Cookie)
 * @param req - Request object
 * @returns کد زبان
 */
export function detectLanguageAdvanced(req: Request): string {
  try {
    // 1. بررسی Cookie (اولویت اول)
    const cookieLang = detectLanguageFromCookie(req.headers.get("cookie") || "");
    if (cookieLang !== 'en') return cookieLang;
    
    // 2. بررسی User-Agent
    const uaLang = detectLanguageFromUserAgent(req.headers.get("user-agent") || "");
    if (uaLang !== 'en') return uaLang;
    
    // 3. تشخیص از IP و Browser
    return detectLanguage(req);
  } catch (error) {
    console.error('Advanced language detection error:', error);
    return fallbackLang;
  }
}





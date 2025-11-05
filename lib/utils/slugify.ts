/**
 * تبدیل متن فارسی به اسلاگ مناسب برای URL
 * @param text متن ورودی
 * @returns اسلاگ مناسب برای URL
 */
export function slugify(text: string): string {
  // تبدیل به حروف کوچک
  let slug = text.toLowerCase()

  // تبدیل حروف فارسی به معادل انگلیسی
  const persianToEnglish: { [key: string]: string } = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
    'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd',
    'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k',
    'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v',
    'ه': 'h', 'ی': 'y', 'ئ': 'y', 'ء': 'a',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  }

  // جایگزینی حروف فارسی با معادل انگلیسی
  Object.keys(persianToEnglish).forEach(persian => {
    slug = slug.replace(new RegExp(persian, 'g'), persianToEnglish[persian])
  })

  // حذف کاراکترهای غیرمجاز و تبدیل فاصله به خط تیره
  slug = slug
    .replace(/[\s_]+/g, '-') // تبدیل فاصله و آندرلاین به خط تیره
    .replace(/[^\w\-]+/g, '') // حذف کاراکترهای غیرمجاز
    .replace(/\-\-+/g, '-') // حذف خط تیره‌های تکراری
    .replace(/^-+/, '') // حذف خط تیره از ابتدا
    .replace(/-+$/, '') // حذف خط تیره از انتها

  return slug
} 
import { prisma } from '@/lib/prisma';

/**
 * دریافت ترجمه از دیتابیس
 * @param key - کلید ترجمه (مثل article_123 یا test_456)
 * @param lang - زبان مورد نظر
 * @returns متن ترجمه شده یا متن اصلی
 */
export async function getTranslation(key: string, lang: string): Promise<string> {
  try {
    // جستجوی ترجمه در زبان مورد نظر
    const translation = await prisma.translation.findUnique({
      where: { 
        key_lang: { 
          key, 
          lang 
        } 
      },
    });

    if (translation) {
      return translation.text;
    }

    // اگر ترجمه موجود نبود، زبان انگلیسی را برگردان
    if (lang !== 'en') {
      const fallback = await prisma.translation.findUnique({
        where: { 
          key_lang: { 
            key, 
            lang: 'en' 
          } 
        },
      });

      if (fallback) {
        return fallback.text;
      }
    }

    // اگر هیچ ترجمه‌ای موجود نبود، کلید را برگردان
    return key;

  } catch (error) {
    console.error('Get translation error:', error);
    return key;
  }
}

/**
 * دریافت تمام ترجمه‌های یک کلید
 * @param key - کلید ترجمه
 * @returns آرایه‌ای از ترجمه‌ها
 */
export async function getAllTranslations(key: string) {
  try {
    const translations = await prisma.translation.findMany({
      where: { key },
      orderBy: { lang: 'asc' }
    });

    return translations;
  } catch (error) {
    console.error('Get all translations error:', error);
    return [];
  }
}

/**
 * بررسی وجود ترجمه
 * @param key - کلید ترجمه
 * @param lang - زبان مورد نظر
 * @returns true اگر ترجمه موجود باشد
 */
export async function hasTranslation(key: string, lang: string): Promise<boolean> {
  try {
    const translation = await prisma.translation.findUnique({
      where: { 
        key_lang: { 
          key, 
          lang 
        } 
      },
    });

    return !!translation;
  } catch (error) {
    console.error('Check translation error:', error);
    return false;
  }
}

/**
 * دریافت ترجمه‌های موجود برای یک کلید
 * @param key - کلید ترجمه
 * @returns آرایه‌ای از زبان‌های موجود
 */
export async function getAvailableLanguages(key: string): Promise<string[]> {
  try {
    const translations = await prisma.translation.findMany({
      where: { key },
      select: { lang: true }
    });

    return translations.map(t => t.lang);
  } catch (error) {
    console.error('Get available languages error:', error);
    return [];
  }
}

/**
 * حذف ترجمه
 * @param key - کلید ترجمه
 * @param lang - زبان مورد نظر
 */
export async function deleteTranslation(key: string, lang: string): Promise<boolean> {
  try {
    await prisma.translation.delete({
      where: { 
        key_lang: { 
          key, 
          lang 
        } 
      },
    });

    return true;
  } catch (error) {
    console.error('Delete translation error:', error);
    return false;
  }
}

/**
 * حذف تمام ترجمه‌های یک کلید
 * @param key - کلید ترجمه
 */
export async function deleteAllTranslations(key: string): Promise<boolean> {
  try {
    await prisma.translation.deleteMany({
      where: { key }
    });

    return true;
  } catch (error) {
    console.error('Delete all translations error:', error);
    return false;
  }
}















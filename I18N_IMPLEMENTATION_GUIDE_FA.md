# 🌍 راهنمای چندزبانه‌سازی Testology

## ✅ پیاده‌سازی کامل شد!

سیستم i18n با پشتیبانی از **7 زبان** آماده است:

---

## 🌐 زبان‌های پشتیبانی شده

| زبان | کد | جهت | پرچم | بازار هدف |
|------|-----|------|------|-----------|
| فارسی | `fa` | RTL | 🇮🇷 | ایران، افغانستان، تاجیکستان |
| English | `en` | LTR | 🇺🇸 | جهانی |
| العربية | `ar` | RTL | 🇸🇦 | خاورمیانه، شمال آفریقا (400M+) |
| Français | `fr` | LTR | 🇫🇷 | فرانسه، آفریقا، کانادا |
| Русский | `ru` | LTR | 🇷🇺 | روسیه، CIS countries |
| Türkçe | `tr` | RTL | 🇹🇷 | ترکیه |
| Español | `es` | LTR | 🇪🇸 | اسپانیا، آمریکای لاتین |

---

## 📁 ساختار فایل‌ها

```
i18n/
├── config.ts              # تنظیمات اصلی
├── languages.ts           # اطلاعات زبان‌ها
├── index.ts              # سیستم ترجمه
└── translations/
    ├── fa/
    │   └── common.json
    ├── en/
    │   └── common.json
    ├── ar/
    │   └── common.json
    ├── fr/
    │   └── common.json
    ├── ru/
    │   └── common.json
    ├── tr/
    │   └── common.json
    └── es/
        └── common.json

lib/
├── i18n/
│   └── translator.ts     # Helper functions
└── seo/
    └── hreflang.ts       # SEO چندزبانه

components/
└── LanguageSwitcher.tsx  # سوییچر زبان

app/api/
└── translate/route.ts    # ترجمه خودکار با GPT
```

---

## 🔧 نحوه استفاده

### 1️⃣ در کامپوننت‌های Server:

```tsx
import { getTranslation } from '@/i18n';

export default function Page({ params }: { params: { lang: string } }) {
  const t = (key: string) => getTranslation(params.lang, key);

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('home.cta')}</button>
    </div>
  );
}
```

### 2️⃣ در کامپوننت‌های Client:

```tsx
'use client';
import { useTranslations } from '@/lib/i18n/translator';

export default function MyComponent({ lang }: { lang: string }) {
  const { t, isRTL } = useTranslations(lang);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('dashboard.welcome', { name: 'User' })}</h1>
    </div>
  );
}
```

### 3️⃣ Language Switcher:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

---

## 🎯 ترجمه خودکار با GPT

### استفاده از API:

```javascript
const translation = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'متن فارسی',
    sourceLang: 'fa',
    targetLang: 'en'
  })
});

const result = await translation.json();
console.log(result.translation); // "Persian text"
```

### ترجمه تست‌ها و مقالات:

```typescript
import { translateWithGPT, batchTranslate } from '@/lib/i18n/translator';

// تک متن
const translated = await translateWithGPT(
  'پرسشنامه افسردگی',
  'fa',
  'en'
);

// دسته‌ای
const questions = [
  { id: 'q1', text: 'چقدر احساس خستگی می‌کنید?' },
  { id: 'q2', text: 'چقدر مضطرب هستید?' }
];

const translations = await batchTranslate(questions, 'fa', 'en');
```

---

## 🔍 SEO چندزبانه

### تولید hreflang tags:

```typescript
import { generateHreflangTags, generateMultilingualMetadata } from '@/lib/seo/hreflang';

// در metadata صفحات
export const metadata = generateMultilingualMetadata(
  'en',
  'tests/anxiety',
  'Anxiety Test - GAD-7',
  'Assess your anxiety level with scientific test'
);
```

### نتیجه:

```html
<link rel="alternate" hreflang="en" href="https://testology.com/en/tests/anxiety" />
<link rel="alternate" hreflang="ar" href="https://testology.com/ar/tests/anxiety" />
<link rel="alternate" hreflang="fr" href="https://testology.com/fr/tests/anxiety" />
...
<link rel="alternate" hreflang="x-default" href="https://testology.com/en/tests/anxiety" />
```

---

## 📊 بازار هدف هر زبان

### 🇺🇸 English (en)
- **بازار:** جهانی
- **تعداد:** 1.5 میلیارد نفر
- **اولویت:** بالا ⭐⭐⭐
- **درآمد:** $$$

### 🇸🇦 Arabic (ar)
- **بازار:** خاورمیانه، شمال آفریقا
- **تعداد:** 400+ میلیون نفر
- **اولویت:** بالا ⭐⭐⭐
- **درآمد:** $$$ (کشورهای نفتی)
- **رقابت:** کم 🎯

### 🇫🇷 French (fr)
- **بازار:** فرانسه، بلژیک، سوئیس، کانادا، آفریقا
- **تعداد:** 300+ میلیون نفر
- **اولویت:** متوسط ⭐⭐
- **درآمد:** $$

### 🇷🇺 Russian (ru)
- **بازار:** روسیه، قزاقستان، اوکراین، CIS
- **تعداد:** 250+ میلیون نفر
- **اولویت:** متوسط ⭐⭐
- **درآمد:** $$

### 🇹🇷 Turkish (tr)
- **بازار:** ترکیه
- **تعداد:** 80+ میلیون نفر
- **اولویت:** متوسط ⭐⭐
- **درآمد:** $$

### 🇪🇸 Spanish (es)
- **بازار:** اسپانیا، آمریکای لاتین
- **تعداد:** 500+ میلیون نفر
- **اولویت:** بالا ⭐⭐⭐
- **درآمد:** $$$

---

## 🎯 استراتژی ترجمه

### فاز 1: UI و Navigation (الان)
- ✅ Header, Footer, Buttons
- ✅ Forms, Labels
- ✅ Navigation menus
- ✅ Common phrases

### فاز 2: محتوای استاتیک (هفته 1)
- [ ] صفحه خانه
- [ ] صفحه درباره ما
- [ ] راهنماها
- [ ] FAQ

### فاز 3: تست‌ها (هفته 2-3)
- [ ] PHQ-9 (7 زبان)
- [ ] GAD-7 (7 زبان)
- [ ] PSS (7 زبان)
- [ ] Rosenberg (7 زبان)
- [ ] بقیه تست‌ها...

### فاز 4: مقالات (ماه 1-2)
- [ ] ترجمه خودکار با GPT
- [ ] ویراستاری انسانی
- [ ] SEO optimization

### فاز 5: محتوای کاربران (ماه 2-3)
- [ ] پیام‌های سیستم
- [ ] نوتیفیکیشن‌ها
- [ ] ایمیل‌ها

---

## 💰 هزینه ترجمه

### با GPT:
```
هر 1000 کلمه: ~$0.03 (GPT-4)
کل UI (5000 کلمه): ~$0.15
کل تست‌ها (20,000 کلمه): ~$0.60
کل مقالات (100,000 کلمه): ~$3

جمع برای 6 زبان: ~$24
```

### با مترجم انسانی:
```
هر 1000 کلمه: $50-100
کل پروژه: $5,000-10,000

توصیه: GPT + ویراستاری = $500-1000
```

---

## 🚀 مراحل فعال‌سازی

### 1. نصب پکیج (اگر لازم باشه):
```bash
npm install next-intl
# یا از سیستم داخلی استفاده کن (قبلاً نوشتیم)
```

### 2. تنظیم middleware:
فایل `middleware.ts` در root پروژه قبلاً آماده است.

### 3. اضافه کردن Language Switcher:
```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// در Header یا Navigation
<LanguageSwitcher />
```

### 4. استفاده در صفحات:
```tsx
import { getTranslation } from '@/i18n';

const t = (key: string) => getTranslation(params.lang, key);
```

---

## 🎨 UI چندزبانه

### Language Switcher:
- Dropdown زیبا با پرچم و نام زبان
- ذخیره در Cookie
- تغییر خودکار مسیر
- انیمیشن نرم

### RTL Support:
- خودکار برای fa, ar, tr
- Tailwind RTL classes
- Flip icons و layout

---

## 📈 مزایای چندزبانه‌سازی

### SEO:
- ✅ Rank در Google هر کشور
- ✅ Traffic از 100+ کشور
- ✅ Backlinks بین‌المللی

### کاربر:
- ✅ راحتی استفاده با زبان مادری
- ✅ اعتماد بیشتر
- ✅ Conversion rate بالاتر

### کسب‌وکار:
- ✅ بازار 2+ میلیارد نفری
- ✅ جذب سرمایه‌گذار خارجی
- ✅ ارزش‌گذاری بالاتر

---

## 🎊 وضعیت فعلی

```
✅ سیستم i18n: آماده
✅ 7 زبان: تنظیم شده
✅ ترجمه‌های UI: Complete
✅ GPT Translation API: Working
✅ Language Switcher: Ready
✅ SEO hreflang: Configured
✅ RTL Support: Full
```

---

## 🔮 گام‌های بعدی

1. **ترجمه تست‌ها:**
   - استفاده از GPT API
   - ویراستاری تخصصی
   - تست و QA

2. **ترجمه مقالات:**
   - ترجمه خودکار
   - بررسی محتوا
   - SEO optimization

3. **محلی‌سازی:**
   - تاریخ و ساعت
   - واحد پول
   - فرمت اعداد

4. **بازاریابی:**
   - SEO هر کشور
   - تبلیغات محلی
   - شبکه‌های اجتماعی

---

## 💡 نکات مهم

### Cache:
- ترجمه‌ها cache میشن
- سرعت بالا
- بدون overhead

### Fallback:
- اگه ترجمه‌ای نبود → انگلیسی
- هیچوقت کلید خام نمایش نمیده

### Performance:
- JSON files کوچک
- Static Generation
- Edge Caching

---

## 🌟 Testology = پلتفرم جهانی!

**با این سیستم:**
- 7 زبان فعال
- 2+ میلیارد نفر بازار
- SEO بین‌المللی
- ترجمه خودکار GPT

**آماده برای فتح جهان! 🚀🌍✨**
















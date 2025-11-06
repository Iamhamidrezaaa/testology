# راهنمای تنظیم فونت Vazirmatn

## وضعیت فعلی

فونت Vazirmatn در `app/globals.css` تنظیم شده است و از فایل‌های محلی استفاده می‌کند. اگر فایل‌ها وجود نداشته باشند، از Google Fonts (که در `app/layout.tsx` تنظیم شده) به عنوان fallback استفاده می‌شود.

## فایل‌های مورد نیاز

برای استفاده کامل از فونت‌های محلی (که روی هاست بهتر کار می‌کند)، باید این فایل‌ها را در `public/fonts/` قرار دهی:

- `Vazirmatn-Regular.woff2`
- `Vazirmatn-Bold.woff2`

## دانلود فونت

می‌توانی فونت Vazirmatn را از این منابع دانلود کنی:

1. **GitHub**: https://github.com/rastikerdar/vazirmatn
2. **Google Fonts**: https://fonts.google.com/specimen/Vazirmatn

## نصب

1. فایل‌های `.woff2` را دانلود کن
2. آن‌ها را در پوشه `public/fonts/` قرار بده
3. نام فایل‌ها باید دقیقاً این باشد:
   - `Vazirmatn-Regular.woff2`
   - `Vazirmatn-Bold.woff2`

## بررسی

بعد از اضافه کردن فایل‌ها، می‌توانی در Developer Tools مرورگر بررسی کنی که فونت از فایل محلی لود می‌شود یا از Google Fonts.

## نکته مهم

- اگر فایل‌های محلی وجود نداشته باشند، از Google Fonts استفاده می‌شود (که در `layout.tsx` تنظیم شده)
- برای دیپلوی روی هاست، بهتر است فایل‌های محلی را اضافه کنی تا مشکل لود نشدن فونت روی هاست حل شود
- بعد از دیپلوی، کش مرورگر/Cloudflare را پاک کن


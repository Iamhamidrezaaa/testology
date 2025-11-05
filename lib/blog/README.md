# بلاگ تستولوژی - سیستم مدیریت محتوا

این پکیج شامل تمام ابزارها و فایل‌های مورد نیاز برای پیاده‌سازی بلاگ حرفه‌ای و CMS در پلتفرم Testology است.

## ساختار فایل‌ها

### 1️⃣ مدل‌های دیتابیس (Prisma)
- `BlogCategory` - دسته‌بندی‌های بلاگ
- `BlogPost` - مقالات بلاگ
- `BlogComment` - نظرات مقالات

### 2️⃣ APIهای بلاگ
- `app/api/blog/route.ts` - CRUD عملیات برای مقالات
- `app/api/blog/[slug]/route.ts` - عملیات روی مقاله خاص
- `app/api/blog/categories/route.ts` - مدیریت دسته‌بندی‌ها
- `app/api/blog/comments/route.ts` - مدیریت نظرات
- `app/api/admin/blog/import/route.ts` - وارد کردن مقالات

### 3️⃣ صفحات عمومی
- `app/blog/page.tsx` - صفحه اصلی بلاگ
- `app/blog/[slug]/page.tsx` - صفحه مقاله خاص
- `app/blog/rss.xml/route.ts` - فید RSS

### 4️⃣ صفحات مدیریت
- `app/admin/blog/page.tsx` - مدیریت مقالات
- `app/admin/blog/new/page.tsx` - ایجاد مقاله جدید

### 5️⃣ ابزارهای سئو
- `lib/seo/blog-seo.ts` - سئو اختصاصی بلاگ
- `lib/blog/blog-sitemap.ts` - تولید sitemap
- `lib/blog/blog-utils.ts` - ابزارهای کمکی

### 6️⃣ وارد کردن محتوا
- `lib/blog/article-importer.ts` - وارد کردن مقالات
- `scripts/seed-blog.ts` - seed مقالات نمونه (50 مقاله)
- `lib/blog/articles/` - فایل‌های مقالات (50 فایل Markdown)

## ویژگی‌های پیاده‌سازی شده

### ✅ سیستم مدیریت محتوا (CMS)
- ایجاد، ویرایش و حذف مقالات
- مدیریت دسته‌بندی‌ها
- سیستم نظردهی
- پیش‌نمایش مقالات

### ✅ سئو پیشرفته
- متادیتای کامل برای هر مقاله
- Schema.org structured data
- Open Graph و Twitter Cards
- Sitemap داینامیک
- RSS feed

### ✅ رابط کاربری
- طراحی responsive
- جستجو در مقالات
- فیلتر بر اساس دسته‌بندی
- مقالات مرتبط
- سایدبار با آمار

### ✅ عملکرد
- Lazy loading تصاویر
- Cache optimization
- Performance monitoring
- Analytics integration

## نحوه استفاده

### 1. اجرای Migration
```bash
npx prisma migrate dev --name add-blog-models
```

### 2. Seed کردن داده‌های نمونه
```bash
npx ts-node scripts/seed-blog.ts
```

### 3. وارد کردن مقالات ترجمه‌شده
```bash
# از طریق API
POST /api/admin/blog/import
```

### 4. دسترسی به صفحات
- صفحه اصلی بلاگ: `/blog`
- مدیریت بلاگ: `/admin/blog`
- RSS feed: `/blog/rss.xml`

## API Endpoints

### مقالات
- `GET /api/blog` - دریافت لیست مقالات
- `GET /api/blog/[slug]` - دریافت مقاله خاص
- `POST /api/blog` - ایجاد مقاله جدید
- `PUT /api/blog/[slug]` - ویرایش مقاله
- `DELETE /api/blog/[slug]` - حذف مقاله

### دسته‌بندی‌ها
- `GET /api/blog/categories` - دریافت دسته‌بندی‌ها

### نظرات
- `POST /api/blog/comments` - ایجاد نظر جدید

## سئو و بهینه‌سازی

### Meta Tags
هر مقاله شامل:
- Title و Description بهینه
- Keywords مرتبط
- Open Graph tags
- Twitter Cards
- Canonical URL

### Structured Data
- BlogPosting schema
- BreadcrumbList
- FAQPage (در صورت نیاز)
- Organization info

### Performance
- Image optimization
- Lazy loading
- Critical CSS
- Service Worker

## دسته‌بندی‌های پیش‌فرض

1. **سلامت روان** - مقالات مربوط به سلامت روان
2. **رشد شخصی** - مقالات رشد شخصی
3. **روابط** - مقالات مربوط به روابط
4. **خانواده** - مقالات خانواده و تربیت
5. **عمومی** - مقالات عمومی

## تگ‌های رایج

- استرس، اضطراب، افسردگی
- عزت نفس، اعتماد به نفس
- روابط، خانواده، زوج
- کودک، نوجوان، تربیت
- درمان، مشاوره، مدیریت

## تصاویر مورد نیاز

### تصاویر مقالات
- `/images/blog/[slug].jpg` - تصویر کاور هر مقاله
- `/images/blog-og.jpg` - تصویر OG صفحه اصلی بلاگ

### تصاویر نویسندگان
- `/images/authors/[author-slug].jpg` - تصاویر نویسندگان

## Analytics و Tracking

### رویدادهای ردیابی شده
- مشاهده مقاله
- کلیک روی لینک‌ها
- اشتراک‌گذاری
- نظردهی
- جستجو

### معیارهای عملکرد
- تعداد بازدید
- زمان مطالعه
- نرخ تعامل
- مقالات محبوب

## نکات مهم

1. **تصاویر**: تمام تصاویر باید با ابعاد مناسب و بهینه باشند
2. **محتوا**: مقالات باید کیفیت بالا و مفید باشند
3. **سئو**: هر مقاله باید کلمات کلیدی مناسب داشته باشد
4. **عملکرد**: صفحات باید سریع لود شوند
5. **امنیت**: نظرات نیاز به تایید دارند

## پشتیبانی

برای سوالات و مشکلات، با تیم توسعه تماس بگیرید.

---

**آخرین به‌روزرسانی**: 2024-01-20
**نسخه**: 1.0.0

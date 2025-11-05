# سیستم بلاگ تستولوژی - راهنمای کامل

## 🎯 **مرور کلی**

سیستم بلاگ تستولوژی یک CMS کامل برای مدیریت مقالات روانشناسی است که شامل:
- ✅ **مدل دیتابیس Blog** با فیلدهای کامل
- ✅ **API endpoints** برای CRUD عملیات
- ✅ **صفحه اصلی بلاگ** با طراحی مدرن
- ✅ **کامپوننت BlogCard** برای نمایش مقالات
- ✅ **استایل‌های CSS** کامل و responsive
- ✅ **سئو بهینه** با meta tags

## 📁 **ساختار فایل‌ها**

```
├── prisma/schema.prisma          # مدل Blog در دیتابیس
├── app/api/admin/blogs/
│   ├── create/route.ts           # API ایجاد مقاله
│   └── route.ts                  # API دریافت مقالات
├── app/blog/page.tsx             # صفحه اصلی بلاگ
├── components/blog/
│   └── BlogCard.tsx              # کامپوننت کارت مقاله
├── styles/blog.css               # استایل‌های بلاگ
└── scripts/
    └── test-blog-import.js       # اسکریپت تست import
```

## 🗄️ **مدل دیتابیس**

### Blog Model
```prisma
model Blog {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  content         String
  imageUrl        String
  tags            String   // JSON string
  metaTitle       String
  metaDescription String
  ogImage         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 🔌 **API Endpoints**

### 1. ایجاد مقاله
```http
POST /api/admin/blogs/create
Content-Type: application/json

{
  "slug": "article-slug",
  "title": "عنوان مقاله",
  "content": "<h1>محتوای HTML</h1>",
  "imageUrl": "/media/blogs/image.jpg",
  "tags": ["تگ1", "تگ2"],
  "meta": {
    "title": "عنوان SEO",
    "description": "توضیحات SEO",
    "ogImage": "/media/blogs/og-image.jpg"
  }
}
```

### 2. دریافت مقالات
```http
GET /api/admin/blogs
```

**پاسخ:**
```json
{
  "success": true,
  "blogs": [
    {
      "id": "blog-id",
      "slug": "article-slug",
      "title": "عنوان مقاله",
      "content": "محتوای مقاله",
      "imageUrl": "/media/blogs/image.jpg",
      "tags": "[\"تگ1\", \"تگ2\"]",
      "metaTitle": "عنوان SEO",
      "metaDescription": "توضیحات SEO",
      "ogImage": "/media/blogs/og-image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🎨 **کامپوننت‌ها**

### BlogCard
کامپوننت نمایش کارت مقاله با ویژگی‌های:
- ✅ تصویر مقاله
- ✅ عنوان و توضیحات
- ✅ تگ‌های مقاله
- ✅ لینک ادامه مطلب
- ✅ تاریخ انتشار
- ✅ Hover effects

### صفحه اصلی بلاگ
- ✅ Grid layout responsive
- ✅ نمایش همه مقالات
- ✅ پیام عدم وجود مقاله
- ✅ طراحی مدرن و زیبا

## 🎨 **استایل‌ها**

### ویژگی‌های CSS:
- ✅ **Grid Layout**: نمایش مقالات در grid responsive
- ✅ **Hover Effects**: انیمیشن‌های زیبا
- ✅ **Dark Mode**: پشتیبانی از حالت تاریک
- ✅ **Mobile First**: طراحی موبایل اول
- ✅ **Typography**: فونت‌های بهینه

### کلاس‌های اصلی:
```css
.blog-grid          # Grid container
.blog-card          # کارت مقاله
.blog-card-image    # تصویر مقاله
.blog-card-content  # محتوای کارت
.blog-card-tags     # تگ‌های مقاله
.blog-card-footer   # فوتر کارت
```

## 🚀 **مراحل اجرا**

### 1. Migration دیتابیس
```bash
npx prisma migrate dev --name add-blog-model
```

### 2. تست API
```bash
node scripts/test-blog-import.js
```

### 3. مشاهده بلاگ
```
http://localhost:3000/blog
```

## 📝 **نحوه استفاده**

### ایجاد مقاله جدید:
```javascript
const response = await fetch('/api/admin/blogs/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'new-article',
    title: 'عنوان جدید',
    content: '<h1>محتوای مقاله</h1>',
    imageUrl: '/media/blogs/image.jpg',
    tags: ['تگ1', 'تگ2'],
    meta: {
      title: 'عنوان SEO',
      description: 'توضیحات SEO',
      ogImage: '/media/blogs/og-image.jpg'
    }
  })
});
```

### دریافت مقالات:
```javascript
const response = await fetch('/api/admin/blogs');
const data = await response.json();
const blogs = data.blogs;
```

## 🔧 **تنظیمات**

### متغیرهای محیطی:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
```

### پوشه تصاویر:
```
public/media/blogs/
├── article-1.jpg
├── article-2.jpg
└── ...
```

## 🐛 **عیب‌یابی**

### خطاهای رایج:

1. **خطای دیتابیس**: بررسی migration
2. **خطای API**: بررسی سرور
3. **خطای تصاویر**: بررسی مسیر فایل‌ها
4. **خطای تگ‌ها**: بررسی JSON format

### لاگ‌ها:
- ✅ موفق: مقاله ایجاد شد
- ❌ خطا: بررسی پیام خطا
- 📊 خلاصه: تعداد موفق و خطا

## 📈 **آمار سیستم**

- ✅ **مدل Blog** کامل
- ✅ **API endpoints** فعال
- ✅ **صفحه بلاگ** responsive
- ✅ **کامپوننت‌ها** مدرن
- ✅ **استایل‌ها** کامل
- ✅ **سئو** بهینه

## 🎯 **نتیجه**

سیستم بلاگ تستولوژی آماده است و می‌توانید:
- ✅ مقالات جدید ایجاد کنید
- ✅ مقالات موجود را مدیریت کنید
- ✅ تصاویر و تگ‌ها اضافه کنید
- ✅ سئو بهینه داشته باشید
- ✅ طراحی مدرن و responsive

**🚀 سیستم بلاگ تستولوژی آماده استفاده است!**

















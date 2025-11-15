# 🔧 حل مشکل Migration

## مشکل

خطای `P3006` در migration به دلیل encoding اشتباه فایل migration اولیه (`000_init/migration.sql`) بود.

## راه‌حل

به جای استفاده از `prisma migrate dev`، از `prisma db push` استفاده شد:

```bash
npx prisma db push --skip-generate
npx prisma generate
```

این دستورات:
- Schema را مستقیماً به دیتابیس اعمال می‌کنند (بدون نیاز به migration files)
- Prisma Client را regenerate می‌کنند
- فیلد `subscales` را به جدول `TestResult` اضافه می‌کنند

## ✅ وضعیت

- [x] فیلد `subscales` به schema اضافه شده
- [x] Schema به دیتابیس اعمال شده (`prisma db push`)
- [x] Prisma Client regenerate شده
- [x] همه چیز آماده است!

## 🔄 برای آینده

اگر می‌خواهی از migration files استفاده کنی:

1. فایل `prisma/migrations/000_init/migration.sql` را با encoding UTF-8 بدون BOM ذخیره کن
2. یا migration اولیه را حذف کن و از اول migration بساز

ولی برای development، `prisma db push` کافی است.

## ✅ تست

برای تست کردن:

```bash
# بررسی schema
npx prisma studio
# یا
npx prisma db pull  # برای دیدن schema از دیتابیس
```

همه چیز آماده است! 🎉


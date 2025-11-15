# دستورات Deploy - Testology

## 📋 تغییرات این Commit

### 1. سیستم Debug برای تست‌ها
- ✅ افزودن تابع `scoreTestWithDebug` در `lib/scoring-engine-v2.ts`
- ✅ افزودن مود `?debug=1` به API endpoint `/api/tests/[testId]/submit`
- ✅ ساخت اسکریپت تست خودکار `scripts/debug-gad7.ts`

### 2. بهبود Video Player
- ✅ حذف لودینگ دایره‌ای در حالت عادی (فقط بعد از play)
- ✅ بزرگ‌تر کردن دکمه Play (32px → 56px)

### 3. بهبود Deduplication سوالات
- ✅ بهبود نرمال‌سازی متن سوالات
- ✅ افزودن لاگ‌های بیشتر برای دیباگ

---

## 🚀 دستورات Deploy

### مرحله 1: Push به GitHub

```bash
# بررسی وضعیت
git status

# Push به origin/main
git push origin main
```

### مرحله 2: Build و Deploy روی سرور

#### اگر از Vercel استفاده می‌کنید:
```bash
# Vercel به صورت خودکار build می‌کند
# فقط push کنید و منتظر بمانید
```

#### اگر سرور خودتان دارید:

```bash
# 1. Pull آخرین تغییرات
git pull origin main

# 2. نصب dependencies (اگر نیاز باشد)
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Build پروژه
npm run build

# 5. Restart سرور
# اگر از PM2 استفاده می‌کنید:
pm2 restart testology

# یا اگر از systemd استفاده می‌کنید:
sudo systemctl restart testology

# یا اگر مستقیماً اجرا می‌کنید:
npm run start
```

### مرحله 3: بررسی Deploy

```bash
# بررسی لاگ‌ها
pm2 logs testology

# یا
sudo journalctl -u testology -f
```

---

## ✅ چک‌لیست بعد از Deploy

- [ ] صفحه اصلی لود می‌شود
- [ ] Video Player بدون لودینگ اولیه نمایش داده می‌شود
- [ ] دکمه Play بزرگ‌تر است
- [ ] تست‌ها کار می‌کنند (مثلاً GAD-7)
- [ ] API debug mode کار می‌کند: `/api/tests/gad7/submit?debug=1`
- [ ] سوال‌های تکراری حذف می‌شوند

---

## 🔍 تست Debug Mode

بعد از deploy، می‌توانید debug mode را تست کنید:

```bash
# با curl
curl -X POST "https://testology.me/api/tests/gad7/submit?debug=1" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "value": 0},
      {"questionId": 2, "value": 1},
      {"questionId": 3, "value": 2},
      {"questionId": 4, "value": 3},
      {"questionId": 5, "value": 0},
      {"questionId": 6, "value": 1},
      {"questionId": 7, "value": 2}
    ],
    "email": "test@example.com"
  }'
```

یا از Postman/Thunder Client استفاده کنید.

---

## 📝 نکات مهم

1. **Prisma Generate**: حتماً بعد از pull، `npx prisma generate` را اجرا کنید
2. **Environment Variables**: مطمئن شوید که `.env` درست تنظیم شده است
3. **Database**: اگر migration جدیدی دارید، `npx prisma migrate deploy` را اجرا کنید
4. **Cache**: در صورت نیاز، cache را پاک کنید: `rm -rf .next`

---

## 🆘 در صورت مشکل

```bash
# بررسی خطاهای build
npm run build 2>&1 | tee build.log

# بررسی TypeScript errors
npm run typecheck

# بررسی lint errors
npm run lint
```


# راه‌حل مشکل Git Push

## ❌ خطا
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

## 🔍 علت
Remote repository (GitHub) تغییراتی دارد که در local repository شما نیست.

## ✅ راه‌حل‌ها

### راه‌حل 1: Pull با Rebase (پیشنهادی) ⭐

```bash
# 1. Pull تغییرات remote با rebase
git pull origin main --rebase

# 2. اگر conflict داشت، حل کنید و سپس:
git add .
git rebase --continue

# 3. Push کنید
git push origin main
```

**مزایا:**
- تاریخچه commit تمیز می‌ماند
- تغییرات شما بالای تغییرات remote قرار می‌گیرد

---

### راه‌حل 2: Pull معمولی

```bash
# 1. Pull تغییرات remote
git pull origin main

# 2. اگر conflict داشت، حل کنید و سپس:
git add .
git commit -m "Merge remote changes"

# 3. Push کنید
git push origin main
```

**مزایا:**
- ساده‌تر است
- یک merge commit اضافه می‌شود

---

### راه‌حل 3: Force Push (⚠️ فقط در صورت ضرورت)

```bash
# ⚠️ هشدار: این کار تغییرات remote را حذف می‌کند!
git push origin main --force
```

**⚠️ فقط استفاده کنید اگر:**
- مطمئن هستید که تغییرات remote مهم نیستند
- یا می‌خواهید تاریخچه را بازنویسی کنید

---

## 📋 دستورات کامل (روی سرور)

```bash
# وارد دایرکتوری پروژه شوید
cd ~/testology

# بررسی وضعیت
git status

# Pull با rebase
git pull origin main --rebase

# اگر conflict نداشت، push کنید
git push origin main

# اگر conflict داشت:
# 1. فایل‌های conflict را باز کنید
# 2. conflict را حل کنید
# 3. سپس:
git add .
git rebase --continue
git push origin main
```

---

## 🔍 بررسی تغییرات Remote

قبل از pull، می‌توانید ببینید چه تغییراتی در remote است:

```bash
# Fetch تغییرات (بدون merge)
git fetch origin

# دیدن تفاوت‌ها
git log HEAD..origin/main

# دیدن فایل‌های تغییر یافته
git diff HEAD origin/main --name-only
```

---

## 💡 نکات

1. **همیشه pull کنید قبل از push** - این کار از conflict جلوگیری می‌کند
2. **از rebase استفاده کنید** - تاریخچه تمیزتر می‌شود
3. **Force push نکنید** - مگر اینکه واقعاً لازم باشد
4. **Backup بگیرید** - قبل از force push، یک backup از کد داشته باشید

---

## 🆘 در صورت مشکل

اگر rebase مشکل داشت:

```bash
# لغو rebase
git rebase --abort

# استفاده از pull معمولی
git pull origin main
git push origin main
```


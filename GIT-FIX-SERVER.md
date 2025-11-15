# راه‌حل مشکل Git روی سرور

## 🔍 وضعیت فعلی
- شما uncommitted changes دارید
- Remote تغییراتی دارد که local نیست

## ✅ راه‌حل گام به گام

### مرحله 1: بررسی وضعیت

```bash
# ببینید چه فایل‌هایی تغییر کرده‌اند
git status

# ببینید چه تغییراتی دارید
git diff
```

### مرحله 2: Stash تغییرات (اگر نمی‌خواهید commit کنید)

```bash
# ذخیره موقت تغییرات
git stash

# Pull تغییرات remote
git pull origin main --rebase

# برگرداندن تغییرات
git stash pop

# اگر conflict داشت، حل کنید و سپس:
git add .
git commit -m "Merge local changes"
git push origin main
```

### مرحله 3: Commit تغییرات (پیشنهادی)

```bash
# اضافه کردن همه تغییرات
git add .

# Commit کردن
git commit -m "Server changes - $(date +%Y-%m-%d)"

# Pull با rebase
git pull origin main --rebase

# اگر conflict داشت:
# 1. فایل‌های conflict را باز کنید
# 2. conflict را حل کنید
# 3. سپس:
git add .
git rebase --continue

# Push
git push origin main
```

### مرحله 4: اگر فقط می‌خواهید تغییرات remote را بگیرید

```bash
# Discard تغییرات local (⚠️ مراقب باشید!)
git reset --hard HEAD

# Pull تغییرات remote
git pull origin main

# Push (اگر تغییرات جدیدی دارید)
git push origin main
```

---

## 🎯 دستورات سریع (کپی-پیست)

### گزینه 1: Stash (اگر تغییرات مهم نیستند)

```bash
git stash
git pull origin main --rebase
git stash pop
git add .
git commit -m "Merge changes"
git push origin main
```

### گزینه 2: Commit (پیشنهادی)

```bash
git add .
git commit -m "Server updates"
git pull origin main --rebase
git push origin main
```

### گزینه 3: Reset (⚠️ فقط اگر تغییرات local مهم نیستند)

```bash
git reset --hard HEAD
git pull origin main
```

---

## 🔍 بررسی قبل از عمل

```bash
# ببینید چه فایل‌هایی تغییر کرده‌اند
git status

# ببینید چه تغییراتی دارید
git diff --name-only

# ببینید تغییرات remote چیست
git fetch origin
git log HEAD..origin/main --oneline
```

---

## 💡 توصیه

**بهترین راه:**
1. ابتدا `git status` بزنید و ببینید چه فایل‌هایی تغییر کرده‌اند
2. اگر تغییرات مهم هستند → Commit کنید
3. اگر تغییرات مهم نیستند → Stash کنید
4. سپس pull و push کنید


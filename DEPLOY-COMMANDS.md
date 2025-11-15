# دستورات Deploy بعد از Push موفق

## ✅ Push موفق بود!
حالا باید پروژه را build و restart کنید.

---

## 📋 دستورات Deploy (گام به گام)

### مرحله 1: نصب Dependencies (اگر نیاز باشد)

```bash
# بررسی کنید که node_modules به‌روز است
npm install
```

### مرحله 2: Generate Prisma Client

```bash
# این کار مهم است! Prisma Client باید generate شود
npx prisma generate
```

### مرحله 3: Build پروژه

```bash
# Build پروژه Next.js
npm run build
```

**نکته:** اگر خطا داشت، لاگ را بررسی کنید:
```bash
npm run build 2>&1 | tee build.log
```

### مرحله 4: Restart سرور

#### اگر از PM2 استفاده می‌کنید:
```bash
# Restart با PM2
pm2 restart testology

# یا اگر نام دیگری دارد:
pm2 list  # برای دیدن لیست process ها
pm2 restart <name>
```

#### اگر از systemd استفاده می‌کنید:
```bash
sudo systemctl restart testology
```

#### اگر مستقیماً اجرا می‌کنید:
```bash
# متوقف کردن process قبلی (Ctrl+C یا kill)
# سپس:
npm run start
```

---

## 🔍 بررسی Deploy

### بررسی لاگ‌ها

```bash
# اگر از PM2 استفاده می‌کنید:
pm2 logs testology --lines 50

# اگر از systemd استفاده می‌کنید:
sudo journalctl -u testology -f

# یا لاگ Next.js:
tail -f .next/trace
```

### بررسی وضعیت سرور

```bash
# بررسی PM2
pm2 status

# بررسی systemd
sudo systemctl status testology

# بررسی پورت (معمولاً 3000)
netstat -tulpn | grep 3000
# یا
ss -tulpn | grep 3000
```

---

## ✅ چک‌لیست بعد از Deploy

- [ ] Build بدون خطا انجام شد
- [ ] Prisma Client generate شد
- [ ] سرور restart شد
- [ ] لاگ‌ها خطایی نشان نمی‌دهند
- [ ] صفحه اصلی لود می‌شود
- [ ] Video Player بدون لودینگ اولیه نمایش داده می‌شود
- [ ] دکمه Play بزرگ‌تر است
- [ ] تست‌ها کار می‌کنند

---

## 🆘 در صورت مشکل

### اگر Build خطا داد:

```bash
# بررسی TypeScript errors
npm run typecheck

# بررسی lint errors
npm run lint

# پاک کردن cache و rebuild
rm -rf .next
npm run build
```

### اگر Prisma خطا داد:

```bash
# بررسی schema
npx prisma validate

# Generate دوباره
npx prisma generate
```

### اگر سرور start نشد:

```bash
# بررسی لاگ‌ها
pm2 logs testology --err

# یا
sudo journalctl -u testology -n 50
```

---

## 📝 دستورات کامل (یکجا)

```bash
# 1. نصب dependencies
npm install

# 2. Generate Prisma
npx prisma generate

# 3. Build
npm run build

# 4. Restart (PM2)
pm2 restart testology

# 5. بررسی لاگ
pm2 logs testology --lines 20
```


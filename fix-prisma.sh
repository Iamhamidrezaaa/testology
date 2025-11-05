#!/bin/bash

echo "🧹 پاک‌سازی کش‌ها و node_modules..."
rm -rf node_modules .next

echo "📦 نصب مجدد پکیج‌ها..."
npm install

echo "🔄 اجرای prisma generate و db push..."
npx prisma generate
npx prisma db push

echo "✅ تمام شد! حالا VSCode و سرور dev را ری‌استارت کن." 
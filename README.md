# Testology

یک پلتفرم تست روانشناختی آنلاین که به کاربران امکان می‌دهد تست‌های مختلف روانشناختی را انجام دهند و نتایج را با تحلیل هوش مصنوعی دریافت کنند.

## ویژگی‌ها

- تست افسردگی PHQ-9+
- تست اضطراب GAD-7+
- تحلیل نتایج با استفاده از GPT-4
- ذخیره نتایج در localStorage
- رابط کاربری زیبا و واکنش‌گرا

## تکنولوژی‌ها

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API

## نصب و راه‌اندازی

1. کلون کردن مخزن:
```bash
git clone https://github.com/yourusername/testology.git
cd testology
```

2. نصب وابستگی‌ها:
```bash
npm install
```

3. تنظیم متغیرهای محیطی:
```bash
cp .env.example .env.local
```
و سپس مقدار `OPENAI_API_KEY` را در فایل `.env.local` تنظیم کنید.

4. اجرای پروژه در محیط توسعه:
```bash
npm run dev
```

5. ساخت نسخه تولید:
```bash
npm run build
npm start
```

## ساختار پروژه

```
testology/
├── components/     # کامپوننت‌های React
├── data/          # داده‌های تست‌ها
├── lib/           # توابع کمکی
├── pages/         # صفحات Next.js
│   ├── api/       # API endpoints
│   └── test/      # صفحات تست‌ها
├── public/        # فایل‌های استاتیک
└── types/         # تعاریف TypeScript
```

## مجوز

MIT 
#!/bin/bash

echo "🧠 راه‌اندازی مغز یادگیرنده Testology"
echo "=================================="

# بررسی وجود Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 یافت نشد. لطفاً Python3 را نصب کنید."
    exit 1
fi

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفاً Node.js را نصب کنید."
    exit 1
fi

echo "✅ Python3 و Node.js موجود هستند"

# تغییر مسیر به فولدر ml
cd ml

echo "📦 نصب dependencies پایتون..."
pip3 install -r requirements.txt

echo "🔧 راه‌اندازی سیستم..."
python3 setup.py

echo "🧪 تست سیستم..."
python3 test_system.py

echo "🎉 مغز یادگیرنده Testology آماده است!"
echo ""
echo "📝 مراحل بعدی:"
echo "1. اجرای Next.js: npm run dev"
echo "2. مشاهده داشبورد AI: http://localhost:3000/admin/ai-dashboard"
echo "3. تست API: POST /api/ml/predict"
echo ""
echo "🔗 لینک‌های مفید:"
echo "- داشبورد AI: /admin/ai-dashboard"
echo "- API پیش‌بینی: /api/ml/predict"
echo "- API تحلیل: /api/admin/ai/analyze"














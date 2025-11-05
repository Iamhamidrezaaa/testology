#!/bin/bash

echo "🔄 راه‌اندازی سیستم آموزش خودکار Testology"
echo "=========================================="

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

echo "🔧 راه‌اندازی سیستم آموزش خودکار..."
python3 setup.py

echo "🧪 تست سیستم Self-Retrain..."
python3 core/self_retrain.py

echo "📊 ایجاد داده‌های نمونه برای تست..."
python3 -c "
import json
import os
from datetime import datetime, timedelta
import random

# ایجاد فولدر data
os.makedirs('data', exist_ok=True)

# ایجاد داده‌های نمونه تست‌ها
import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 1000

data = {
    'score': np.random.normal(50, 15, n_samples),
    'gender': np.random.choice(['male', 'female', 'other'], n_samples),
    'age': np.random.randint(18, 65, n_samples),
    'category': np.random.choice(['anxiety', 'depression', 'focus', 'confidence', 'stress'], n_samples)
}

df = pd.DataFrame(data)
df.to_csv('data/user_tests.csv', index=False)

# ایجاد داده‌های نمونه چت
chat_data = []
for i in range(200):
    chat_data.append({
        'date': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
        'message': f'پیام نمونه {i}',
        'sentiment': random.choice(['positive', 'negative', 'neutral']),
        'category': random.choice(['anxiety', 'depression', 'focus', 'confidence', 'stress'])
    })

with open('data/chat_sentiments.json', 'w', encoding='utf-8') as f:
    json.dump(chat_data, f, ensure_ascii=False, indent=2)

print('✅ داده‌های نمونه ایجاد شدند')
"

echo "🎉 سیستم آموزش خودکار Testology آماده است!"
echo ""
echo "📝 مراحل بعدی:"
echo "1. اجرای Next.js: npm run dev"
echo "2. مشاهده داشبورد AI: http://localhost:3000/admin/ai-dashboard"
echo "3. تست آموزش مجدد: npm run retrain"
echo "4. تنظیم Cron Job برای اجرای هفتگی:"
echo "   # هر هفته شنبه ساعت 2 صبح"
echo "   0 2 * * 0 cd /path/to/testology && npm run retrain-weekly"
echo ""
echo "🔗 لینک‌های مفید:"
echo "- داشبورد AI: /admin/ai-dashboard"
echo "- API آموزش مجدد: /api/ml/retrain"
echo "- تاریخچه آموزش‌ها: /api/admin/ai/retrain-log"
echo ""
echo "⚡️ Testology حالا یک موجود زنده‌ی خودآموز است!"














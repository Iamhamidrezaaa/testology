"use client";

import React, { useState } from 'react';

export function SendExercise({ patientId, onSuccess }: { patientId: string; onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert('لطفاً عنوان و توضیحات را وارد کنید');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/therapist/exercises/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: patientId,
          title,
          description
        })
      });

      if (response.ok) {
        alert('✅ تمرین با موفقیت ارسال شد!');
        setTitle('');
        setDescription('');
        onSuccess?.();
      } else {
        const error = await response.json();
        alert(`خطا: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sending exercise:', error);
      alert('خطا در ارسال تمرین');
    } finally {
      setSending(false);
    }
  };

  // تمرین‌های پیشنهادی
  const templates = [
    {
      title: 'تمرین تنفس عمیق',
      description: 'هر روز 10 دقیقه تمرین تنفس عمیق انجام دهید:\n1. در یک مکان آرام بنشینید\n2. چشمان خود را ببندید\n3. از طریق بینی نفس عمیق بکشید (4 ثانیه)\n4. نفس را نگه دارید (4 ثانیه)\n5. از طریق دهان نفس خارج کنید (6 ثانیه)\n6. این چرخه را 10 بار تکرار کنید'
    },
    {
      title: 'یادداشت قدردانی روزانه',
      description: 'هر شب قبل از خواب، 3 چیزی را که امروز برایشان سپاسگزار هستید بنویسید. می‌تواند چیزهای کوچک باشد:\n- یک لحظه خوب\n- یک فرد مهربان\n- یک موفقیت کوچک\n\nاین تمرین به تقویت ذهنیت مثبت کمک می‌کند.'
    },
    {
      title: 'پیاده‌روی روزانه',
      description: 'هر روز حداقل 20 دقیقه پیاده‌روی کنید، ترجیحاً در فضای باز و طبیعت. این فعالیت:\n- استرس را کاهش می‌دهد\n- خلق و خو را بهبود می‌بخشد\n- کیفیت خواب را افزایش می‌دهد\n\nسعی کنید بدون گوشی و به دور از حواس‌پرتی‌ها پیاده‌روی کنید.'
    },
    {
      title: 'چالش مواجهه تدریجی',
      description: 'برای کاهش اضطراب، مواجهه تدریجی با موقعیت‌های نگران‌کننده:\n1. لیستی از موقعیت‌های نگران‌کننده بسازید\n2. آنها را از کم‌استرس به پراسترس رتبه‌بندی کنید\n3. از آسان‌ترین شروع کنید\n4. هر روز کمی بیشتر با آن موقعیت مواجه شوید\n5. بعد از تسلط، به مرحله بعد بروید'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>📝</span>
        ارسال تمرین به بیمار
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* عنوان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عنوان تمرین
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="مثال: تمرین تنفس عمیق"
            required
          />
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            توضیحات و دستورالعمل
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={6}
            placeholder="دستورالعمل کامل تمرین را بنویسید..."
            required
          />
        </div>

        {/* تمرین‌های پیشنهادی */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تمرین‌های پیشنهادی (کلیک کنید تا استفاده کنید):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setTitle(template.title);
                  setDescription(template.description);
                }}
                className="text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <div className="font-medium text-gray-800 dark:text-white">
                  {template.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* دکمه ارسال */}
        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-md"
        >
          {sending ? 'در حال ارسال...' : '📤 ارسال تمرین'}
        </button>
      </form>
    </div>
  );
}

export default SendExercise;

















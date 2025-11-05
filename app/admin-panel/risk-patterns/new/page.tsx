'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRiskPatternForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    keywords: '',
    severity: 'medium',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/risk-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          keywords: form.keywords.split(',').map(k => k.trim())
        }),
      });

      if (!response.ok) {
        throw new Error('خطا در ثبت الگو');
      }

      router.push('/admin-panel/risk-patterns');
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ثبت الگو. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">افزودن الگوی خطر روانی</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              نام الگو
            </label>
            <input
              type="text"
              id="name"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              کلمات کلیدی (با کاما جدا شوند)
            </label>
            <input
              type="text"
              id="keywords"
              required
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="مثال: اضطراب، بی‌خوابی، تنهایی"
            />
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              شدت خطر
            </label>
            <select
              id="severity"
              required
              value={form.severity}
              onChange={e => setForm({ ...form, severity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="low">خطر کم</option>
              <option value="medium">خطر متوسط</option>
              <option value="high">خطر شدید</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              پیام هشدار یا راهنمایی
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            ثبت الگو
          </button>
        </div>
      </form>
    </div>
  );
} 
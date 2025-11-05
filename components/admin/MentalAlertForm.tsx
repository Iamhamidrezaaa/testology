'use client';

import { useState } from 'react';

export default function AlertForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    userId: '',
    title: '',
    message: '',
    level: 'medium',
    relatedTest: '',
    source: 'manual',
  });

  const submit = async () => {
    await fetch('/api/admin/mental-alerts', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    onSuccess();
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-lg font-semibold">افزودن هشدار جدید</h2>
      <input className="input" placeholder="ID کاربر" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} />
      <input className="input" placeholder="عنوان هشدار" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea className="textarea" placeholder="متن هشدار" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <select className="select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
        <option value="low">کم</option>
        <option value="medium">متوسط</option>
        <option value="high">زیاد</option>
      </select>
      <input className="input" placeholder="نام تست مرتبط (اختیاری)" value={form.relatedTest} onChange={e => setForm({ ...form, relatedTest: e.target.value })} />
      <button className="btn btn-primary" onClick={submit}>ایجاد هشدار</button>
    </div>
  );
} 
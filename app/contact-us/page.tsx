"use client";
import { useState } from "react";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", department: "عمومی", message: "" });
  const [sent, setSent] = useState(false);

  const departments = ["عمومی", "پشتیبانی فنی", "محتوا و رسانه", "تحلیل‌های روان‌شناسی"];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
    setForm({ name: "", email: "", department: "عمومی", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold text-center">تماس با تیم تستولوژی 📞</h1>
      <p className="text-gray-500 text-center">در صورتی‌که سوالی دارید یا نیاز به ارتباط با بخش خاصی دارید، از فرم زیر استفاده کنید.</p>

      {sent && (
        <div className="p-4 rounded-xl bg-green-100 text-green-700 border border-green-300 text-center">
          پیام شما با موفقیت ارسال شد! 💌
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/70 dark:bg-gray-900/70 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <label className="block mb-1 text-sm font-medium">نام شما</label>
          <input type="text" required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"/>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">ایمیل</label>
          <input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"/>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">دپارتمان</label>
          <select value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
            {departments.map((d)=> <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">پیام شما</label>
          <textarea required rows={5} value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"></textarea>
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">ارسال پیام</button>
      </form>

      <div className="mt-10 text-center text-gray-600 space-y-1">
        <p>📍 تهران، ایران</p>
        <p>📧 info@testology.me</p>
        <p>📞 09101962026</p>
      </div>
    </div>
  );
}



"use client";
import { useState, useEffect } from "react";

export default function EthicsMonitor() {
  const [reports, setReports] = useState([
    { id: 1, type: "bias", message: "احتمال سوگیری جنسیتی در پاسخ GPT تشخیص داده شد.", time: "14:10" },
    { id: 2, type: "overclaim", message: "پاسخ GPT با قطعیت بیش از حد بیان شد.", time: "14:32" },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setReports((r) => [
        ...r,
        {
          id: r.length + 1,
          type: ["bias", "tone", "overclaim"][Math.floor(Math.random() * 3)],
          message: "تحلیل اخلاقی جدید ثبت شد.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-3">
      <div className="font-medium">🧬 Ethical Transparency Reports</div>
      <div className="text-xs text-gray-500">ثبت ارزیابی‌های اخلاقی پاسخ‌های GPT</div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60 h-64 overflow-auto text-sm space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="border-b border-gray-100 dark:border-gray-800 pb-2">
            <b>[{r.type}]</b> — {r.message}
            <div className="text-xs text-gray-400">{r.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



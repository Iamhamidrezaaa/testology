"use client";

import { useEffect, useState } from "react";

export default function MetaFeedbackDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/get-meta-feedback")
      .then((r) => r.json())
      .then((res) => {
        setData(res.feedbacks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <p className="text-gray-400">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">🧩 Meta-Feedback Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-700 text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">درمانگر</th>
              <th className="p-3">بازخورد</th>
              <th className="p-3">نوع</th>
              <th className="p-3">امتیاز</th>
              <th className="p-3">قابلیت اعتماد</th>
              <th className="p-3">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((f: any) => (
              <tr key={f.id} className="border-t border-gray-800">
                <td className="p-3">{f.clinicianId || "-"}</td>
                <td className="p-3 text-gray-300 truncate max-w-xs">
                  {f.feedbackNote || "—"}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    f.feedbackType === "approved" 
                      ? "bg-green-800/50 text-green-300" 
                      : f.feedbackType === "revised"
                      ? "bg-yellow-800/50 text-yellow-300"
                      : "bg-red-800/50 text-red-300"
                  }`}>
                    {f.feedbackType}
                  </span>
                </td>
                <td className="p-3 text-teal-400">
                  {f.feedbackScore ? `${(f.feedbackScore * 100).toFixed(0)}%` : "—"}
                </td>
                <td className="p-3 text-indigo-400">
                  {f.reliability ? `${(f.reliability * 100).toFixed(0)}%` : "—"}
                </td>
                <td className="p-3 text-gray-400 text-xs">
                  {new Date(f.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">کل بازخوردها</h3>
          <p className="text-2xl font-bold text-white">{data.length}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">میانگین اعتماد</h3>
          <p className="text-2xl font-bold text-indigo-400">
            {data.length > 0 
              ? `${(data.reduce((sum, f) => sum + (f.reliability || 0), 0) / data.length * 100).toFixed(0)}%`
              : "—"
            }
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-2">تأیید شده</h3>
          <p className="text-2xl font-bold text-green-400">
            {data.filter(f => f.feedbackType === "approved").length}
          </p>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        🔹 این جدول نشان می‌دهد کدام بازخوردها در بهبود یادگیری سیستم بیشترین
        تأثیر را داشته‌اند.
      </p>
    </div>
  );
}












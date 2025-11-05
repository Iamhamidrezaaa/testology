"use client";

import { useEffect, useState } from "react";

export default function ConsensusPage({ params }: { params: { id: string } }) {
  const reportId = params.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function runConsensus() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ai/consensus-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.error || "خطا در اجرای اجماع");
      } else {
        setData(result);
      }
    } catch (e: any) {
      setError(e?.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runConsensus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">
        در حال جمع‌بندی نظر مدل‌ها...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">
        {error}
      </div>
    );
  }

  const c = data?.consensus;
  const modelsUsed: string[] = c?.modelsUsed ? JSON.parse(c.modelsUsed) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🤝 AI Consensus Engine</h1>

      <div className="bg-white/10 rounded-2xl p-8 border border-white/10 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-teal-400 mb-3">خلاصه اجماعی مدل‌ها:</h2>
        <p className="text-gray-200 mb-6 whitespace-pre-line">{c.consensusText}</p>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <h3 className="text-gray-400 text-sm mb-1">میانگین دقت (اعتماد)</h3>
            <p className="text-2xl font-bold text-green-400">{(c.confidence * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <h3 className="text-gray-400 text-sm mb-1">اختلاف مدل‌ها</h3>
            <p className="text-2xl font-bold text-yellow-400">{(c.divergence * 100).toFixed(1)}%</p>
          </div>
          <div
            className={`p-4 rounded-lg text-center ${
              c.riskLevel === "high"
                ? "bg-red-900/50"
                : c.riskLevel === "medium"
                ? "bg-yellow-800/50"
                : "bg-green-800/40"
            }`}
          >
            <h3 className="text-gray-400 text-sm mb-1">سطح ریسک اجماعی</h3>
            <p className="text-2xl font-bold">{c.riskLevel}</p>
          </div>
        </div>

        <h3 className="text-gray-400 text-sm mt-8 mb-2">مدل‌های مشارکت‌کننده:</h3>
        <p className="text-teal-300 text-sm">{modelsUsed.join(" • ")}</p>

        <div className="text-center mt-8">
          <button onClick={runConsensus} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
            🔄 اجرای دوباره اجماع
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
          ⚖️ این گزارش توسط چند مدل تحلیلی بررسی و با روش اجماع وزنی ترکیب شده است. هدف: کاهش خطا و افزایش دقت روان‌شناختی در تحلیل نهایی.
        </p>
      </div>
    </div>
  );
}












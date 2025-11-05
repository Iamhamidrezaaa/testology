"use client";

import { useEffect, useState } from "react";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const reportId = params.id;
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  async function runReview() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ai/review-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "خطا در بازبینی AI");
      } else {
        setReview(data.review);
      }
    } catch (e: any) {
      setError(e?.message || "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(type: "approved" | "revised") {
    try {
      setUpdating(true);
      // Fetch last consensus for this report to obtain modelsUsed
      const consensusRes = await fetch("/api/ai/consensus-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId })
      });
      const consensusData = await consensusRes.json();
      const modelsUsed = consensusData?.consensus?.modelsUsed ? JSON.parse(consensusData.consensus.modelsUsed) : [];

      const feedbackNote = prompt("لطفاً نظر خود را در مورد این گزارش بنویسید (اختیاری):") || "";
      const timeTaken = Math.floor(Math.random() * 300 + 60); // شبیه‌سازی زمان بازبینی

      const response = await fetch("/api/ai/update-model-weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelsUsed,
          feedback: type,
          confidence: review?.reviewScore || 0.8,
          clinicianId: "clinician-001", // در آینده از authentication بیاید
          reportId,
          feedbackNote,
          timeTaken,
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`بازخورد ثبت شد و وزن مدل‌ها بروزرسانی گردید. (اعتماد: ${(result.reliability * 100).toFixed(0)}%)`);
      } else {
        alert("خطا در ثبت بازخورد");
      }
    } catch (e) {
      alert("خطا در ثبت بازخورد");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    runReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🧠 AI Clinical Review</h1>

      {loading && (
        <p className="text-gray-400 text-center">در حال بازبینی گزارش...</p>
      )}

      {!loading && error && (
        <div className="text-center text-red-300">{error}</div>
      )}

      {!loading && !error && review && (
        <div className="bg-white/10 rounded-2xl p-8 border border-white/10 shadow-xl max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">خلاصه بازبینی:</h2>
          <p className="text-gray-200 mb-6 whitespace-pre-line">{review.reviewSummary}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-xl text-center">
              <h3 className="text-gray-400 text-sm">درجه دقت</h3>
              <p className="text-2xl font-bold text-green-400">{(review.reviewScore * 100).toFixed(0)}%</p>
            </div>
            <div
              className={`p-4 rounded-xl text-center ${review.riskLevel === "high" ? "bg-red-900/50" : review.riskLevel === "medium" ? "bg-yellow-800/50" : "bg-green-800/40"}`}
            >
              <h3 className="text-gray-400 text-sm">ریسک تحلیل</h3>
              <p className="text-2xl font-bold">{review.riskLevel}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-indigo-400 mb-2">پیشنهادات اصلاحی:</h3>
          <p className="text-gray-300 whitespace-pre-line mb-8">{review.revisionNotes || "هیچ پیشنهادی وجود ندارد."}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => sendFeedback("approved")}
              disabled={updating}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              ✅ تأیید گزارش
            </button>
            <button
              onClick={() => sendFeedback("revised")}
              disabled={updating}
              className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
            >
              ✍️ نیاز به اصلاح
            </button>
            <button
              onClick={runReview}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              🔄 بازبینی مجدد
            </button>
          </div>

          <p className="text-sm text-gray-500 border-t border-gray-700 pt-4 mt-6">
            🧩 این گزارش توسط سیستم دوم هوش بالینی Testology بازبینی شده است. هدف از این لایه، اطمینان از بی‌طرفی و کیفیت تحلیلی است و جایگزین بازبینی انسانی نیست.
          </p>
        </div>
      )}
    </div>
  );
}

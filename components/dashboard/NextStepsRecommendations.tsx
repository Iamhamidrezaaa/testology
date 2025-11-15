/**
 * کامپوننت UI: بلوک «قدم‌های بعدی پیشنهادی» در داشبورد
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface GlobalRecommendationItem {
  testId: string;
  reason: string;
  source: string;
  priority: number;
}

interface GlobalRecommendationsPayload {
  items: GlobalRecommendationItem[];
}

interface NextStepsRecommendationsProps {
  userId: string;
}

export default function NextStepsRecommendations({
  userId,
}: NextStepsRecommendationsProps) {
  const [nextSteps, setNextSteps] = useState<GlobalRecommendationItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/dashboard/recommendations?userId=${userId}`
        );
        if (!res.ok) {
          console.error("Failed to fetch recommendations");
          return;
        }
        const data: GlobalRecommendationsPayload = await res.json();
        setNextSteps(data.items || []);
      } catch (e) {
        console.error("Failed to load recommendations", e);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  if (loading) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
        </div>
      </section>
    );
  }

  if (!nextSteps || nextSteps.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm dark:border-purple-800 dark:from-purple-900/20 dark:to-indigo-900/20">
      <h2 className="mb-2 text-xl font-bold text-purple-900 dark:text-purple-200">
        قدم‌های بعدی پیشنهادی برای تو
      </h2>
      <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
        بر اساس تست‌هایی که تا الان در Testology انجام داده‌ای، این چند تست
        می‌توانند تصویر کامل‌تری از خودت بهت بدهند:
      </p>

      <ul className="space-y-3">
        {nextSteps.map((item) => (
          <li
            key={item.testId}
            className="rounded-lg border border-purple-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-purple-800 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Link
                    href={`/tests/${item.testId.toLowerCase()}`}
                    className="font-semibold text-purple-700 hover:underline dark:text-purple-300"
                  >
                    {item.testId}
                  </Link>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    بر اساس: {item.source}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {item.reason}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {nextSteps.length >= 6 && (
        <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
          💡 با انجام تست‌های بیشتر، پیشنهادهای دقیق‌تری دریافت می‌کنی
        </p>
      )}
    </section>
  );
}


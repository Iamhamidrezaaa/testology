/**
 * کامپوننت کارت فشرده "قدم‌های بعدی پیشنهادی"
 * برای نمایش در بالای داشبورد/هوم
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

interface NextStepsCompactCardProps {
  userId?: string;
  limit?: number;
}

export function NextStepsCompactCard({
  userId,
  limit = 3,
}: NextStepsCompactCardProps) {
  const [items, setItems] = useState<GlobalRecommendationItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // اگر userId داده نشده، از session یا localStorage بگیر
        let finalUserId = userId;
        if (!finalUserId) {
          // سعی کن از session بگیر
          try {
            const sessionRes = await fetch('/api/auth/session');
            const session = await sessionRes.json();
            if (session?.user?.id) {
              finalUserId = session.user.id;
            } else if (session?.user?.email) {
              // اگر id نبود، از email استفاده کن (موقت)
              finalUserId = session.user.email;
            }
          } catch (e) {
            // ignore
          }
          // اگر هنوز نداریم، از localStorage بگیر
          if (!finalUserId) {
            finalUserId = localStorage.getItem("testology_userId") || undefined;
          }
        }
        if (!finalUserId) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/dashboard/recommendations?userId=${finalUserId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        // فقط چند تای اول برای کارت جمع‌وجور
        setItems((data.items || []).slice(0, limit));
      } catch (e) {
        console.error("Failed to load global recommendations", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, limit]);

  if (loading) {
    return (
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800/70">
        <div className="animate-pulse">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
          <div className="space-y-2.5">
            <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
            <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-gray-800/70">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          قدم‌های بعدی پیشنهادی برای تو
        </h2>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          بر اساس تست‌هایی که تا الان زده‌ای
        </span>
      </div>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.testId}
            className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/tests/${item.testId.toLowerCase()}`}
                className="text-xs font-semibold text-slate-900 hover:text-indigo-600 hover:underline dark:text-slate-100 dark:hover:text-indigo-400"
              >
                {item.testId}
              </Link>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-2">
                {item.reason}
              </p>
            </div>
            <span className="ml-2 mt-0.5 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-gray-600 dark:text-slate-300">
              {item.source}
            </span>
          </li>
        ))}
      </ul>

      {items.length >= limit && (
        <div className="mt-3 text-center">
          <Link
            href="/dashboard/tests"
            className="text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
          >
            مشاهده همه پیشنهادها →
          </Link>
        </div>
      )}
    </section>
  );
}


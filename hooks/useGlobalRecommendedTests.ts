/**
 * هوک برای دریافت لیست testIdهای پیشنهادی از Global Recommendations
 * استفاده در لیست تست‌ها برای نمایش badge "پیشنهادشده برای تو"
 */

import { useEffect, useState } from "react";

interface GlobalRecommendationItem {
  testId: string;
  reason: string;
  source: string;
  priority: number;
}

export function useGlobalRecommendedTests(userId?: string) {
  const [recommendedIds, setRecommendedIds] = useState<Set<string> | null>(
    null
  );
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
          setRecommendedIds(new Set());
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/dashboard/recommendations?userId=${finalUserId}`
        );
        if (!res.ok) {
          setRecommendedIds(new Set());
          return;
        }
        const data = await res.json();
        const items: GlobalRecommendationItem[] = data.items || [];
        // تبدیل به lowercase برای matching با test.id در UI
        setRecommendedIds(new Set(items.map((i) => i.testId.toLowerCase())));
      } catch (e) {
        console.error("Failed to load recommendations", e);
        setRecommendedIds(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    recommendedIds,
    isLoading: loading,
    isRecommended: (testId: string) =>
      recommendedIds ? recommendedIds.has(testId.toLowerCase()) : false,
  };
}


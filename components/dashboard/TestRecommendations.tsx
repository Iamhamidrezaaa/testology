"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type TestRecommendation = {
  testId: string;
  title: string;
  description: string;
  reason: string;
  priority: number;
};

type RecommendationsData = {
  recommendations: TestRecommendation[];
  summary: string;
};

export default function TestRecommendations() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get<{ data: RecommendationsData }>(
          "/api/user/test-recommendations"
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("خطا در دریافت پیشنهادات تست");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">تست‌های پیشنهادی</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">{data.summary}</p>
      </div>

      <div className="space-y-4">
        {data.recommendations.map((rec) => (
          <div
            key={rec.testId}
            className="border-r-4 border-indigo-500 bg-indigo-50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-indigo-800">{rec.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {rec.description}
                </p>
              </div>
              <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                اولویت {rec.priority}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-2">{rec.reason}</p>
            <div className="mt-3">
              <Link
                href={`/tests/${rec.testId}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                شروع تست
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
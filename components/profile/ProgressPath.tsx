"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { StepProgress } from "./StepProgress";
import { NextStepCard } from "./NextStepCard";
import { ProgressAnimation } from "./ProgressAnimation";

interface ProgressStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
  date?: string;
}

interface ProgressData {
  steps: ProgressStep[];
  nextStep: {
    title: string;
    description: string;
    action: string;
    priority: "low" | "medium" | "high";
  };
  overallProgress: number;
}

export function ProgressPath() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/user/progress");
        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات");
        }
        const progressData = await response.json();
        setData(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg mb-2">⚠️ خطا</div>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">اطلاعاتی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* نمایش پیشرفت کلی */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            پیشرفت کلی شما
          </h2>
          <span className="text-2xl font-bold text-blue-600">
            {data.overallProgress}%
          </span>
        </div>
        <ProgressAnimation progress={data.overallProgress} />
        <p className="text-sm text-gray-600 mt-2">
          {data.overallProgress < 25 && "شما در ابتدای مسیر هستید. ادامه دهید! 🌱"}
          {data.overallProgress >= 25 && data.overallProgress < 50 && "پیشرفت خوبی داشته‌اید! 💪"}
          {data.overallProgress >= 50 && data.overallProgress < 75 && "نیمه راه را طی کرده‌اید! 🚀"}
          {data.overallProgress >= 75 && data.overallProgress < 100 && "تقریباً به مقصد رسیده‌اید! 🎯"}
          {data.overallProgress === 100 && "تبریک! مسیر رشد شما کامل شده است! 🎉"}
        </p>
        <div className="mt-4 text-xs text-gray-500">
          {data.totalTests} تست انجام داده‌اید • {data.completedSteps} از {data.steps.length} مرحله تکمیل شده
        </div>
      </div>

      {/* نمایش مراحل */}
      <StepProgress steps={data.steps} />

      {/* پیشنهاد مرحله بعدی */}
      <NextStepCard nextStep={data.nextStep} />
    </div>
  );
}

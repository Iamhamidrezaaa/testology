"use client";

import React, { useEffect, useState } from 'react';

interface PatientReportData {
  patient: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: string;
  };
  totalTests: number;
  testsByType: Record<string, any[]>;
  trends: Record<string, string>;
  strengths: string[];
  concerns: string[];
  recentMoods: any[];
  progress: any;
  summary: string;
}

export function PatientReport({ patientId }: { patientId: string }) {
  const [report, setReport] = useState<PatientReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [patientId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/therapist/report/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-red-500">خطا در بارگذاری گزارش</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* اطلاعات بیمار */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          گزارش جامع بیمار
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">نام</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {report.patient.name || 'نامشخص'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">ایمیل</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {report.patient.email || 'نامشخص'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">تعداد تست‌ها</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {report.totalTests}
            </p>
          </div>
        </div>
      </div>

      {/* خلاصه */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <span>📋</span>
          خلاصه وضعیت
        </h3>
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
          {report.summary}
        </pre>
      </div>

      {/* نقاط نگران‌کننده */}
      {report.concerns.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            نقاط نیازمند توجه ({report.concerns.length})
          </h3>
          <ul className="space-y-2">
            {report.concerns.map((concern, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 mt-1">•</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* نقاط قوت */}
      {report.strengths.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
            <span>✅</span>
            نقاط قوت ({report.strengths.length})
          </h3>
          <ul className="space-y-2">
            {report.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* روند تست‌ها */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          روند تست‌ها
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(report.trends).map(([testSlug, trend]) => (
            <div
              key={testSlug}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-white">
                  {testSlug}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trend === 'بهتر شده'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : trend === 'بدتر شده'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  {trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* احساسات اخیر */}
      {report.recentMoods.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>💭</span>
            احساسات اخیر (7 روز گذشته)
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {report.recentMoods.map((mood, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm"
                title={new Date(mood.date).toLocaleDateString('fa-IR')}
              >
                {mood.mood}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* پیشرفت */}
      {report.progress && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🎯</span>
            پیشرفت کاربر
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {report.progress.level}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">سطح</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {report.progress.xp}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {report.progress.totalTests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">تست</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {report.progress.streakDays}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">روز تداوم</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientReport;

















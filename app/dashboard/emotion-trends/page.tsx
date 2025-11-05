"use client";

import { useEffect, useState } from "react";

export default function EmotionTrends() {
  const [data, setData] = useState<any>({ data: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/get-emotions?userId=demo-user-123")
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: "text-yellow-400",
      sadness: "text-blue-400", 
      anger: "text-red-400",
      anxiety: "text-orange-400",
      calm: "text-green-400",
      hope: "text-purple-400"
    };
    return colors[emotion] || "text-gray-400";
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: { [key: string]: string } = {
      joy: "😊",
      sadness: "😢",
      anger: "😠",
      anxiety: "😰",
      calm: "😌",
      hope: "🌟"
    };
    return icons[emotion] || "😐";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10">
        <p className="text-gray-400 text-center">در حال بارگذاری نمودار هیجان‌ها...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">💫 Emotion Timeline</h1>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">کل تحلیل‌های هیجانی</h3>
          <p className="text-3xl font-bold text-indigo-400">{data.stats.totalEmotions || 0}</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">میانگین شدت احساس</h3>
          <p className="text-3xl font-bold text-purple-400">
            {((data.stats.avgIntensity || 0) * 100).toFixed(0)}%
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">آخرین بروزرسانی</h3>
          <p className="text-lg font-bold text-teal-400">
            {new Date(data.stats.lastUpdated).toLocaleTimeString("fa-IR")}
          </p>
        </div>
      </div>

      {/* نمودار خطی شدت احساسات */}
      {data.data.length > 0 ? (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">
            📈 نمودار شدت احساسات در طول زمان
          </h2>
          
          <div className="space-y-4">
            {data.data.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getEmotionIcon(item.dominantEmotion)}</span>
                  <span className="text-gray-300">{item.date}</span>
                  <span className={`text-sm ${getEmotionColor(item.dominantEmotion)}`}>
                    {item.dominantEmotion}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-48 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.intensity * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-indigo-400 font-mono w-12 text-right">
                    {(item.intensity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
          <p className="text-gray-400 text-center">هنوز داده‌ای برای نمایش وجود ندارد.</p>
        </div>
      )}

      {/* توزیع احساسات */}
      {data.stats.emotionDistribution && Object.keys(data.stats.emotionDistribution).length > 0 && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-6 text-purple-400">
            🎭 توزیع احساسات شما
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.stats.emotionDistribution).map(([emotion, count]: [string, any]) => (
              <div key={emotion} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{getEmotionIcon(emotion)}</div>
                <div className={`text-lg font-semibold ${getEmotionColor(emotion)}`}>
                  {emotion}
                </div>
                <div className="text-gray-400 text-sm">{count} بار</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🔹 شدت احساسات شما در جلسات اخیر بر اساس تحلیل زبان و الگوی تایپ</p>
        <p>این نمودارها به شما کمک می‌کنند تا الگوهای احساسی خود را بهتر درک کنید.</p>
      </div>
    </div>
  );
}












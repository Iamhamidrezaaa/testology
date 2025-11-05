"use client";

import { useState, useEffect } from "react";

export default function VoiceSettings() {
  const [tone, setTone] = useState("warm");
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [userId] = useState("demo-user-123"); // در آینده از authentication بیاید

  const tones = [
    { value: "warm", label: "گرم و دوستانه", description: "لحن گرم و صمیمی" },
    { value: "calm", label: "آرام و آرامش‌بخش", description: "لحن ملایم و تسکین‌دهنده" },
    { value: "supportive", label: "حمایت‌گر و تشویق‌کننده", description: "لحن انگیزه‌بخش و مثبت" },
    { value: "hopeful", label: "امیدوار و خوشبین", description: "لحن مثبت و آینده‌نگر" }
  ];

  useEffect(() => {
    // بارگذاری تنظیمات فعلی
    fetch(`/api/user/get-voice-profile?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.voiceProfile) {
          setTone(data.voiceProfile.tone);
          setRate(data.voiceProfile.rate);
          setPitch(data.voiceProfile.pitch);
        }
      })
      .catch(console.error);
  }, [userId]);

  async function saveProfile() {
    setLoading(true);
    try {
      const response = await fetch("/api/user/set-voice-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tone, rate, pitch }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert("تنظیمات صوتی ذخیره شد ✅");
      } else {
        alert("خطا در ذخیره تنظیمات");
      }
    } catch (error) {
      alert("خطا در ذخیره تنظیمات");
    } finally {
      setLoading(false);
    }
  }

  async function testVoice() {
    const testText = "سلام! این صدای درمانگر Testology است. چطور می‌تونم کمکت کنم؟";
    
    try {
      const response = await fetch("/api/ai/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: testText }),
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.warn("Audio play failed:", e));
      }
    } catch (error) {
      alert("خطا در تست صدا");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎙️ Voice Profile Settings</h1>
        
        <div className="bg-white/10 rounded-2xl p-8 border border-white/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">
            انتخاب لحن درمانگر
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tones.map((t) => (
              <div
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  tone === t.value
                    ? "bg-purple-600 border-purple-400"
                    : "bg-white/5 border-white/20 hover:bg-white/10"
                }`}
              >
                <h3 className="font-semibold mb-2">{t.label}</h3>
                <p className="text-sm text-gray-300">{t.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-6 text-indigo-400">
            تنظیمات پیشرفته
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                سرعت گفتار: {rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>آهسته</span>
                <span>سریع</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                زیر و بمی صدا: {pitch.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>کم</span>
                <span>زیاد</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={saveProfile}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-xl transition-colors"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
            
            <button
              onClick={testVoice}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              🎧 تست صدا
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>🔹 این تنظیمات بر روی صدای درمانگر در گفت‌وگوهای شما تأثیر می‌گذارد.</p>
          <p>لحن درمانگر همچنین بر اساس احساس شما در هر لحظه تطبیق می‌یابد.</p>
        </div>
      </div>
    </div>
  );
}












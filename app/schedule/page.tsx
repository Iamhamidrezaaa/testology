"use client";

import { useState, useEffect } from "react";

export default function SchedulePage() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [choice, setChoice] = useState<"AI" | "HUMAN" | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "",
    mode: "online"
  });

  useEffect(() => {
    if (choice === "HUMAN") {
      setLoading(true);
      fetch("/api/schedule/get-therapists")
        .then((r) => r.json())
        .then((res) => {
          setTherapists(res.therapists || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [choice]);

  async function bookSession() {
    if (!bookingData.date || !bookingData.timeSlot) {
      alert("لطفاً تاریخ و زمان را انتخاب کنید");
      return;
    }

    try {
      // ابتدا رزرو جلسه
      const bookingResponse = await fetch("/api/schedule/book-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user-123",
          type: choice,
          therapistId: selectedTherapist?.id,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          mode: bookingData.mode
        })
      });

      const bookingResult = await bookingResponse.json();
      
      if (bookingResult.success) {
        // اگر جلسه انسانی است، پرداخت انجام می‌شود
        if (choice === "HUMAN" && selectedTherapist) {
          const paymentResponse = await fetch("/api/payment/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "demo-user-123",
              therapistId: selectedTherapist.id,
              bookingId: bookingResult.booking.id,
              amount: selectedTherapist.pricePerSession || 50000
            })
          });

          const paymentResult = await paymentResponse.json();
          
          if (paymentResult.success) {
            alert("✅ پرداخت با موفقیت انجام شد و جلسه تأیید شد!");
          } else {
            alert("❌ خطا در پرداخت: " + paymentResult.error);
            return;
          }
        } else {
          alert("✅ جلسه با درمانگر مجازی رزرو شد!");
        }

        // پاک کردن فرم
        setChoice(null);
        setSelectedTherapist(null);
        setBookingData({ date: "", timeSlot: "", mode: "online" });
      } else {
        alert("❌ خطا در رزرو جلسه: " + bookingResult.error);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ خطا در رزرو جلسه");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🗓️ انتخاب نوع جلسه درمانی
        </h1>

        {!choice && (
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setChoice("AI")}
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-xl font-semibold mb-2">جلسه با درمانگر مجازی</h3>
                <p className="text-sm text-gray-300">همیشه در دسترس، رایگان با اشتراک</p>
                <div className="mt-3 text-xs text-green-300">✅ فوری • 24/7 • هوشمند</div>
              </div>
            </button>

            <button
              onClick={() => setChoice("HUMAN")}
              className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">👩‍⚕️</div>
                <h3 className="text-xl font-semibold mb-2">جلسه با روان‌شناس انسانی</h3>
                <p className="text-sm text-gray-300">رزرو تایم با متخصص تأیید‌شده</p>
                <div className="mt-3 text-xs text-blue-300">👨‍⚕️ متخصص • تأیید‌شده • شخصی</div>
              </div>
            </button>
          </div>
        )}

        {choice === "AI" && (
          <div className="text-center mt-10">
            <div className="bg-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                🤖 درمانگر مجازی Testology
              </h2>
              <p className="text-gray-300 mb-6">
                جلسه با درمانگر هوشمند در هر زمانی قابل آغاز است. 
                درمانگر مجازی بر اساس حافظه و احساسات شما پاسخ می‌دهد.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <span>🧠</span>
                  <span>تحلیل احساسات پیشرفته</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <span>🎙️</span>
                  <span>صدای همدلانه و تطبیقی</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <span>💭</span>
                  <span>حافظه گفت‌وگوهای گذشته</span>
                </div>
              </div>
              <a
                href="/chat/therapy"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-4 rounded-xl font-semibold transition-all"
              >
                🚀 شروع جلسه هوشمند
              </a>
            </div>
          </div>
        )}

        {choice === "HUMAN" && (
          <div className="mt-10">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-400">در حال بارگذاری روان‌شناسان...</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-6 text-center">
                  👩‍⚕️ روان‌شناسان تأیید‌شده
                </h2>
                
                {therapists.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">هیچ روان‌شناسی در حال حاضر در دسترس نیست</p>
                    <button
                      onClick={() => setChoice(null)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl"
                    >
                      بازگشت
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {therapists.map((t: any) => (
                      <div
                        key={t.id}
                        className={`bg-white/10 p-6 rounded-xl border transition-all cursor-pointer ${
                          selectedTherapist?.id === t.id 
                            ? "border-emerald-500 bg-emerald-900/20" 
                            : "border-white/10 hover:border-emerald-500/50"
                        }`}
                        onClick={() => setSelectedTherapist(t)}
                      >
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                            {t.name.charAt(0)}
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{t.name}</h3>
                          <p className="text-sm text-emerald-400 mb-2">{t.specialty}</p>
                          {t.description && (
                            <p className="text-xs text-gray-400 mb-3">{t.description}</p>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-emerald-300">
                              💰 {t.pricePerSession?.toLocaleString() || "رایگان"} تومان
                            </span>
                            {t.verified && (
                              <span className="text-green-400">✅ تأیید‌شده</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTherapist && (
                  <div className="mt-8 bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                      رزرو جلسه با {selectedTherapist.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">تاریخ جلسه</label>
                        <input
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">زمان جلسه</label>
                        <select
                          value={bookingData.timeSlot}
                          onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                        >
                          <option value="">انتخاب زمان</option>
                          <option value="09:00">9:00 صبح</option>
                          <option value="10:30">10:30 صبح</option>
                          <option value="14:00">2:00 بعدازظهر</option>
                          <option value="15:30">3:30 بعدازظهر</option>
                          <option value="17:00">5:00 بعدازظهر</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">نوع جلسه</label>
                        <select
                          value={bookingData.mode}
                          onChange={(e) => setBookingData({...bookingData, mode: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                        >
                          <option value="online">آنلاین</option>
                          <option value="voice">صوتی</option>
                          <option value="text">متنی</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={bookSession}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                      >
                        رزرو جلسه
                      </button>
                      <button
                        onClick={() => setSelectedTherapist(null)}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl"
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setChoice(null)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl"
                  >
                    بازگشت به انتخاب نوع جلسه
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

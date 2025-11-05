"use client";
import { useState, useEffect } from "react";

export default function MoodTrackerCard() {
  const [val, setVal] = useState(5);
  const [note, setNote] = useState("");

  // Adaptive Interface - تغییر رنگ پس‌زمینه بر اساس mood
  useEffect(() => {
    document.body.style.backgroundColor =
      val >= 8 ? "#dbeafe" : val <= 3 ? "#fef2f2" : "#f9fafb";
  }, [val]);

  const save = async () => {
    await fetch("/api/mood/save", {
      method:"POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ score: val, note }),
    });
    setNote("");
    alert("ذخیره شد");
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60">
      <div className="font-medium mb-2">حالت امروزت چطوره؟</div>
      <input type="range" min={1} max={10} value={val} onChange={e=>setVal(parseInt(e.target.value))}
             className="w-full"/>
      <div className="text-sm mt-2">امتیاز: {val}/10</div>
      <textarea className="mt-3 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                placeholder="اگر دوست داری توضیح بده…" value={note} onChange={e=>setNote(e.target.value)} />
      <button onClick={save} className="mt-3 rounded-xl px-4 py-2 bg-blue-600 text-white">ثبت</button>
    </div>
  );
}

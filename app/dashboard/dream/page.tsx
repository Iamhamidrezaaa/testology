"use client";
import { useState } from "react";

export default function DreamPage(){
  const [t, setT] = useState("");
  const [res, setRes] = useState<string>("");

  const go = async()=>{
    const r = await fetch("/api/dream/analyze", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text: t }),
    });
    const j = await r.json(); setRes(j.analysis || "");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-xl font-bold">تحلیل خواب‌ها 🌙</h1>
      <textarea value={t} onChange={e=>setT(e.target.value)}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 h-40"
        placeholder="خوابت را با جزئیات بنویس…"/>
      <button onClick={go} className="rounded-xl px-4 py-2 bg-blue-600 text-white">تحلیل کن</button>
      {res && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60 whitespace-pre-wrap">
          {res}
        </div>
      )}
    </div>
  );
}



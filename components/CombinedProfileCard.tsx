"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CombinedProfileCard() {
  const [data, setData] = useState<any>(null);

  useEffect(()=>{
    (async ()=>{
      // API خودت: /api/analyze/combined
      const r = await fetch("/api/analyze/combined");
      const j = await r.json().catch(()=>null);
      setData(j);
    })();
  },[]);

  const pie = (data?.dimensions || [
    { name:"تاب‌آوری", value: 65 },
    { name:"اضطراب", value: 35 },
    { name:"رضایت", value: 58 },
    { name:"خودارزیابی", value: 50 },
  ]);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60">
      <div className="font-medium mb-1">پروفایل روانی ترکیبی</div>
      <div className="text-xs text-gray-500 mb-3">تحلیل خودکار بر اساس تست‌های اخیر</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90}>
              {pie.map((_:any, idx:number)=><Cell key={idx} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm">
        {data?.summary || "خلاصه تحلیل اینجا نمایش داده می‌شود. (اتصال به API شما انجام شدنی است)"}
      </div>
      <a href="/api/report/pdf" className="inline-block mt-3 text-blue-600 underline">دانلود گزارش کامل من (PDF)</a>
    </div>
  );
}



"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CombinedProfileCard() {
  const [data, setData] = useState<any>(null);

  useEffect(()=>{
    (async ()=>{
      // دریافت userEmail از localStorage
      const userEmail = localStorage.getItem("testology_email");
      if (!userEmail) {
        console.log("❌ No user email found");
        return;
      }
      
      // API خودت: /api/analyze/combined
      const r = await fetch("/api/analyze/combined", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail })
      });
      const j = await r.json().catch(()=>null);
      
      if (j && j.success) {
        // تبدیل داده‌های API به فرمت مورد نیاز
        const dimensions = [
          { name: "تاب‌آوری", value: j.chartData?.[0]?.averageScore || 65 },
          { name: "اضطراب", value: j.chartData?.[1]?.averageScore || 35 },
          { name: "رضایت", value: j.chartData?.[2]?.averageScore || 58 },
          { name: "خودارزیابی", value: j.chartData?.[3]?.averageScore || 50 },
        ];
        setData({
          ...j,
          dimensions,
          summary: j.combinedReport || j.summary || "تحلیل بر اساس تست‌های انجام شده"
        });
      } else {
        console.error("❌ Failed to fetch combined analysis:", j);
      }
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



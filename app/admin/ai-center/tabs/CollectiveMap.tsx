"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ZAxis } from "recharts";

export default function CollectiveMap() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // شبیه‌سازی داده جمعی کاربران (می‌تونی بعداً از Prisma بگیری)
    const temp = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.floor(Math.random() * 20) + 5,
      mood: ["شاد", "غمگین", "خنثی", "پرانرژی", "نگران"][Math.floor(Math.random() * 5)],
    }));
    setData(temp);
  }, []);

  const moodColor = (m: string) =>
    m === "شاد"
      ? "#22c55e"
      : m === "غمگین"
      ? "#3b82f6"
      : m === "پرانرژی"
      ? "#eab308"
      : m === "نگران"
      ? "#f43f5e"
      : "#94a3b8";

  return (
    <div className="space-y-4">
      <div className="font-medium">🧠 نقشه هوش جمعی (Collective Intelligence Map)</div>
      <div className="text-xs text-gray-500">هر نقطه یک کاربر است — رنگ و موقعیت نمایانگر احساس کلی</div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis dataKey="x" hide />
            <YAxis dataKey="y" hide />
            <ZAxis dataKey="z" range={[30, 100]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data}>
              {data.map((entry, index) => (
                <circle
                  key={index}
                  cx={entry.x}
                  cy={entry.y}
                  r={entry.z / 3}
                  fill={moodColor(entry.mood)}
                  fillOpacity="0.6"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



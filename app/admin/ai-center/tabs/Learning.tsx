"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AIC_TabLearning() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/ml/update", { method: "POST" });
      const data = await res.json();
      setMetrics((prev) => [...prev.slice(-10), { time: new Date().toLocaleTimeString(), accuracy: data.accuracy, loss: data.loss }]);
    };
    fetchData();
    const t = setInterval(fetchData, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-3">
      <div className="font-medium">Learning Engine Status</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="accuracy" stroke="#22c55e" name="Accuracy" />
            <Line type="monotone" dataKey="loss" stroke="#f43f5e" name="Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-gray-500 text-center">
        وضعیت مدل‌ها در حال یادگیری مداوم با داده‌های رفتاری کاربران است.
      </div>
    </div>
  );
}

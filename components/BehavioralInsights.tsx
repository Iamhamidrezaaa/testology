"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "مدت حضور", value: 42 },
  { name: "میانگین تمرکز", value: 85 },
  { name: "تکمیل تست", value: 78 },
  { name: "تعامل با چت", value: 60 },
];

export default function BehavioralInsights() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60">
      <div className="font-medium mb-2">رفتار تحلیلی کاربر 📊</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



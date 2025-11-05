"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

const dailyUsers = [
  { day: "شنبه", users: 32 },
  { day: "یکشنبه", users: 51 },
  { day: "دوشنبه", users: 46 },
  { day: "سه‌شنبه", users: 58 },
  { day: "چهارشنبه", users: 62 },
  { day: "پنجشنبه", users: 70 },
  { day: "جمعه", users: 44 },
];

const testAvg = [
  { name: "PHQ-9", score: 9.2 },
  { name: "GAD-7", score: 8.6 },
  { name: "SWLS", score: 23.1 },
  { name: "Rosenberg", score: 18.7 },
];

export default function AIC_TabUserAnalytics() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">نمای کلی کاربران و میانگین نمره تست‌ها</div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
          <div className="mb-2 font-medium">فعالیت کاربران</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
          <div className="mb-2 font-medium">میانگین نمرات تست</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testAvg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



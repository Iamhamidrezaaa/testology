"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const latency = [
  { t:"10:00", ms: 820 },
  { t:"10:10", ms: 760 },
  { t:"10:20", ms: 680 },
  { t:"10:30", ms: 920 },
  { t:"10:40", ms: 740 },
];
export default function AIC_TabAIHealth() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
        <div className="mb-2 font-medium">زمان پاسخ GPT (ms)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latency}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="t"/><YAxis/><Tooltip/>
              <Area type="monotone" dataKey="ms"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="text-sm text-gray-500">نرخ موفقیت تحلیل‌ها، خطاهای اخلاقی و امتیاز کیفیت تحلیل را هم می‌توان افزود (API واقعی/Mock).</div>
    </div>
  );
}



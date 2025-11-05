"use client";

import { useEffect, useState } from "react";

export default function SystemMonitor() {
  const [data, setData] = useState<any>({ metrics: [], recentLogs: [] });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  async function load() {
    try {
      const res = await fetch("/api/admin/get-metrics");
      const result = await res.json();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString("fa-IR"));
    } catch (e) {
      console.error("Failed to load metrics:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000); // هر ۱۰ ثانیه آپدیت
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (successRate: number) => {
    if (successRate >= 0.95) return "text-green-400";
    if (successRate >= 0.85) return "text-yellow-400";
    return "text-red-400";
  };

  const getLatencyColor = (latency: number) => {
    if (latency <= 1000) return "text-green-400";
    if (latency <= 3000) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <p className="text-gray-400">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧠 System Monitoring Dashboard</h1>
        <div className="text-sm text-gray-400">
          آخرین بروزرسانی: {lastUpdate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.metrics.map((m: any) => (
          <div
            key={m.layer}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-teal-400">
              {m.layer}
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">⏱️ میانگین تأخیر:</span>
                <span className={`font-mono ${getLatencyColor(m.avgLatencyMs || 0)}`}>
                  {Math.round(m.avgLatencyMs || 0)}ms
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">✅ نرخ موفقیت:</span>
                <span className={`font-mono ${getStatusColor(m.successRate || 0)}`}>
                  {((m.successRate || 0) * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">📊 تنوع عملکرد:</span>
                <span className="font-mono text-indigo-400">
                  {((m.divergence || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Logs Section */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">
          📋 Recent Activity (Last 24h)
        </h2>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.recentLogs.slice(0, 20).map((log: any) => (
            <div
              key={log.id}
              className={`flex justify-between items-center p-3 rounded-lg text-sm ${
                log.status === "success" 
                  ? "bg-green-900/20 text-green-300" 
                  : log.status === "warning"
                  ? "bg-yellow-900/20 text-yellow-300"
                  : "bg-red-900/20 text-red-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs">{log.layer}</span>
                <span>{log.action}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs">{log.latencyMs}ms</span>
                <span className="text-xs">
                  {new Date(log.createdAt).toLocaleTimeString("fa-IR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          🔹 این داشبورد تمام لایه‌های هوش Testology را از نظر سرعت و پایداری بررسی
          می‌کند.
        </p>
        <button
          onClick={load}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
        >
          🔄 بروزرسانی دستی
        </button>
      </div>
    </div>
  );
}












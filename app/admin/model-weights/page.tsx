"use client";

import { useEffect, useState } from "react";

export default function ModelWeights() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/get-model-weights").then((r) => r.json());
    setModels(res.models || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">⚙️ AI Model Weights</h1>

      {loading ? (
        <p className="text-gray-400">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-4">
          {models.map((m: any) => (
            <div
              key={m.modelName}
              className="flex justify-between items-center bg-white/10 p-4 rounded-xl"
            >
              <span className="text-indigo-200">{m.modelName}</span>
              <span className="font-mono text-teal-400">{(m.weight * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-gray-400">
        🔹 این وزن‌ها بر اساس بازخوردهای درمانگران و صحت گزارش‌ها به‌صورت خودکار
        یادگیری می‌شوند.
      </p>
    </div>
  );
}












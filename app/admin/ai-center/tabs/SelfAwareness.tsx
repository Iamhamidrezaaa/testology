"use client";
import { useEffect, useState } from "react";

export default function SelfAwareness() {
  const [state, setState] = useState({
    awareness: 0.76,
    ethicalScore: 0.91,
    adaptive: 0.83,
    retrainReady: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => ({
        ...s,
        awareness: Math.min(1, s.awareness + Math.random() * 0.01 - 0.005),
        ethicalScore: Math.min(1, s.ethicalScore + Math.random() * 0.01 - 0.005),
        adaptive: Math.min(1, s.adaptive + Math.random() * 0.01 - 0.005),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="font-medium">🤖 AI Self-Awareness Panel</div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-gray-900/60 space-y-3">
        <div>سطح آگاهی درونی: <span className="font-bold">{(state.awareness * 100).toFixed(1)}%</span></div>
        <div>پایداری اخلاقی: <span className="font-bold text-green-500">{(state.ethicalScore * 100).toFixed(1)}%</span></div>
        <div>انطباق محیطی: <span className="font-bold text-blue-500">{(state.adaptive * 100).toFixed(1)}%</span></div>
        <div>حالت یادگیری خودکار: {state.retrainReady ? "فعال" : "در انتظار داده جدید"}</div>
      </div>
    </div>
  );
}



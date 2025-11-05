"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function PsychologistChatBot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // بارگذاری تاریخچه چت (در آینده از /api/history)
    setMessages([
      { role: "bot", text: "سلام 👋 من روان‌شناس هوشمند تستولوژی‌ام. آماده‌ام باهات صحبت کنم." },
    ]);
  }, []);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/psychologist-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", messages: newMessages }),
    });

    const data = await res.json();
    const updated = [...newMessages, { role: "bot", text: data.reply }];
    setMessages(updated);
    setLoading(false);

    // پخش صدا
    if (data.audioUrl) {
      audioRef.current = new Audio(data.audioUrl);
      audioRef.current.play().catch(() => {});
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-3 text-indigo-600">روان‌شناس هوشمند تستولوژی 🧠</h2>

      <div className="h-72 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-100 dark:bg-indigo-800 text-right"
                : "bg-blue-50 dark:bg-gray-700"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        {loading && <p className="text-gray-400 text-center text-sm">در حال فکر کردن...</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="در مورد چی می‌خوای صحبت کنیم؟"
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:opacity-90 transition"
        >
          ارسال
        </button>
      </form>
    </div>
  );
}

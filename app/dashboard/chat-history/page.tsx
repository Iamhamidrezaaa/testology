"use client";

import { useEffect, useState } from "react";
import PDFExportButton from "@/components/PDFExportButton";

export default function ChatHistoryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const userEmail = localStorage.getItem('userEmail') || 'user2@testology.me';
        const res = await fetch(`/api/chat/history?userEmail=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          // تبدیل تاریخچه چت به فرمت مناسب
          const chatHistory = data.data.map((chat: any) => ({
            id: chat.id,
            messages: JSON.parse(chat.messages || "[]"),
            createdAt: chat.createdAt,
            type: "psychologist"
          }));
          setHistory(chatHistory);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setHistory([]);
      }
    }
    fetchHistory();
  }, [filter]);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">
          🧠 تاریخچه گفتگوهای شما
        </h2>
        <PDFExportButton 
          userId="demo-user" 
          type="chat-history"
          className="ml-4"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">همه گفتگوها</option>
          <option value="psychologist">روان‌شناس</option>
          <option value="support">پشتیبان</option>
        </select>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            هیچ گفت‌وگویی یافت نشد
          </div>
        ) : (
          history.map((chat: any) => (
            <div key={chat.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-indigo-600">گفت‌وگو با روان‌شناس</h3>
                <span className="text-xs text-gray-400">
                  {new Date(chat.createdAt).toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="space-y-2">
                {chat.messages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-indigo-100 dark:bg-indigo-800 text-right"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

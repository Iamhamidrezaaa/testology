"use client";

import { useState, useEffect } from "react";

export default function TherapyChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId] = useState("demo-user-123"); // در آینده از authentication بیاید

  // پیام خوش‌آمدگویی اولیه
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "سلام! من درمانگر هوشمند Testology هستم. چطور می‌تونم کمکت کنم؟ 😊"
      }
    ]);
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    
    setLoading(true);
    const startTime = performance.now();
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      // تحلیل هیجان پیام کاربر
      const typingTime = (performance.now() - startTime) / 1000;
      
      await fetch("/api/ai/analyze-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input, typingTime }),
      });

      // ارسال پیام به درمانگر
      const res = await fetch("/api/ai/therapy-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        
        // پخش صوت تطبیقی پاسخ
        try {
          const voiceResponse = await fetch("/api/ai/generate-voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, text: data.reply }),
          });
          
          if (voiceResponse.ok) {
            const audioBlob = await voiceResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play().catch(e => console.warn("Audio play failed:", e));
          }
        } catch (voiceError) {
          console.warn("Voice generation failed:", voiceError);
        }
      } else {
        setMessages([...newMessages, { 
          role: "assistant", 
          content: "متأسفانه خطایی رخ داده. لطفاً دوباره تلاش کنید." 
        }]);
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "خطا در ارتباط. لطفاً دوباره تلاش کنید." 
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          💬 Therapy Assistant Chat
        </h1>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="h-96 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-lg ${
                    m.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">در حال نوشتن...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="احساست رو بنویس..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              {loading ? "..." : "ارسال"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🔹 این گفت‌وگو با درمانگر هوشمند Testology است و جایگزین مشاوره حرفه‌ای نیست.</p>
          <p>در صورت نیاز به کمک فوری، با مراکز مشاوره تماس بگیرید.</p>
        </div>
      </div>
    </div>
  );
}

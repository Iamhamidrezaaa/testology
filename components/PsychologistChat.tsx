"use client";
import { useState, useRef } from "react";

export default function PsychologistChat({ userId }: { userId?: string }) {
  const [msgs, setMsgs] = useState<{role:"user"|"assistant", content:string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement|null>(null);

  const send = async () => {
    if (!input.trim()) return;
    const newMsgs = [...msgs, { role: "user" as const, content: input }];
    setMsgs(newMsgs); setInput(""); setLoading(true);

    try {
      console.log("🚀 Sending message:", input);
      
      const r = await fetch("/api/chat/psychologist", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ userId, messages: newMsgs }),
      });
      
      console.log("📡 Response status:", r.status);
      
      const data = await r.json();
      console.log("📦 Response data:", data);
      
      const reply = data.reply || data.error || "متأسفانه نمی‌توانم پاسخ دهم.";
      setMsgs(prev => [...prev, { role:"assistant", content: reply }]);
      setLoading(false);

      // TTS (اختیاری)
      try {
        const t = await fetch("/api/tts", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ text: reply, voice:"alloy", format:"mp3" })
        });
        if (t.ok) {
          const blob = await t.blob();
          const url = URL.createObjectURL(blob);
          if (!audioRef.current) {
            const a = new Audio(url);
            audioRef.current = a;
          } else {
            audioRef.current.src = url;
          }
          audioRef.current.play().catch(()=>{});
        }
      } catch (ttsError) {
        console.log("🔊 TTS Error:", ttsError);
      }
    } catch (error) {
      console.log("💥 Send Error:", error);
      setMsgs(prev => [...prev, { 
        role:"assistant", 
        content: "متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید." 
      }]);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl p-4 md:p-6 bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="text-lg font-semibold mb-3">روان‌شناس هوشمند 🧠</div>
      <div className="h-64 overflow-auto rounded-xl p-3 bg-gray-50 dark:bg-gray-800 text-sm space-y-3">
        {msgs.map((m,i)=>(
          <div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl ${m.role==="user" ? "bg-blue-600 text-white ml-auto" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">… در حال فکر کردن</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none"
          placeholder="هرچه دوست داری بگو…"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=> e.key==="Enter" && send()}
        />
        <button onClick={send} className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
          ارسال
        </button>
      </div>
    </div>
  );
}

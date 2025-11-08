"use client";
import { useState } from "react";

export default function SupportWidget({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{role:"user"|"assistant", content:string}[]>([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const newMsgs = [...msgs, { role: "user" as const, content: input }];
    setMsgs(newMsgs); setInput("");

    const r = await fetch("/api/chat/support", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ userId, messages: newMsgs }),
    });
    const data = await r.json();
    const reply = data.reply || "…";
    setMsgs(prev => [...prev, { role:"assistant", content: reply }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 h-96 mb-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 font-medium">پشتیبانی تستولوژی 💬</div>
          <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
            {msgs.map((m,i)=>(
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl ${m.role==="user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 dark:bg-gray-800"}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-2 flex gap-2">
            <input className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                   placeholder="سریع بپرس…" value={input}
                   onChange={(e)=>setInput(e.target.value)}
                   onKeyDown={(e)=> e.key==="Enter" && send()} />
            <button onClick={send} className="rounded-xl px-3 bg-blue-600 text-white">ارسال</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 text-white shadow-lg hover:scale-105 transition">
        {open ? "×" : "?"}
      </button>
    </div>
  );
}



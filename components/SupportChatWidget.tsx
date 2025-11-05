"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "سلام 😊 من دستیار تستولوژی هستم. سوالی داری؟" },
  ]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: "user", text: input }];
    setMessages(newMsgs);
    setInput("");

    const res = await fetch("/api/support-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMsgs }),
    });
    const data = await res.json();
    setMessages([...newMsgs, { role: "bot", text: data.reply }]);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <span>پشتیبان تستولوژی 🤖</span>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`my-1 p-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-100 dark:bg-indigo-700 ml-auto"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="بنویس..."
                className="flex-1 px-3 py-2 rounded-lg text-sm border dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-3 rounded-lg"
              >
                ارسال
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full shadow-xl p-4 hover:scale-105 transition"
      >
        <MessageCircle />
      </button>
    </>
  );
}




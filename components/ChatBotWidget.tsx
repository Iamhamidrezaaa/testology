import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Loader2 } from "lucide-react";

export default function ChatBotWidget({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `سلام! من ${user?.gender === "female" ? "آناهیتا" : "کاوه"} هستم، مشاور روان‌شناسی شما در تستولوژی. هر سوالی داری بپرس تا با هم بررسی کنیم.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // اضافه کردن پیام کاربر به لیست
    setMessages(prev => [...prev, { sender: "user", text: message }]);
    
    try {
      const response = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('خطا در ارسال پیام');
      }

      const data = await response.json();
      
      // اضافه کردن پاسخ ربات
      setMessages(prev => [...prev, { sender: "bot", text: data.message }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "متأسفانه خطایی رخ داده. لطفاً دوباره تلاش کنید." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    sendMessage(message);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* آیکون شناور چت */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-sky-500 hover:bg-sky-600 text-white rounded-full p-4 shadow-lg z-50"
        >
          <Bot size={24} />
        </button>
      )}

      {/* پنجره چت */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
        >
          {/* هدر */}
          <div className="bg-sky-500 text-white p-4 flex justify-between items-center">
            <span>{user?.gender === "female" ? "آناهیتا" : "کاوه"}</span>
            <button onClick={() => setIsOpen(false)} className="text-white font-bold">×</button>
          </div>

          {/* بدنه چت */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl px-3 py-2 max-w-[75%] shadow text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 text-right"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* نمایش loading state */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl px-3 py-2 max-w-[75%] shadow text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال پاسخ...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* فوتر با اینپوت */}
          <div className="p-2 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="سوالی داری؟ اینجا بنویس..."
              disabled={isLoading}
              className="flex-1 border rounded-md px-3 py-1 text-sm disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-sky-500 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  ...
                </>
              ) : (
                'ارسال'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

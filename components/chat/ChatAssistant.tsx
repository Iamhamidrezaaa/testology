import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          sessionId 
        })
      });

      const data = await res.json();
      if (data && data.response) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById("chat-scroll");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col border rounded-2xl shadow-lg p-4 w-full max-w-lg bg-white">
      <ScrollArea className="h-96 overflow-y-auto px-2" id="chat-scroll">
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block px-4 py-2 rounded-xl ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-sm text-gray-500 italic mt-2">در حال تحلیل...</div>
        )}
      </ScrollArea>
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پیامت را بنویس..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button onClick={handleSend} disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 
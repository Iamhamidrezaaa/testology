"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Edit, 
  Trash2, 
  MessageSquare,
  User,
  Calendar,
  Mail
} from "lucide-react";
import { format } from "date-fns-jalali";

interface AdvisorMessage {
  id: string;
  content: string;
  fromAdmin: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface PrivateMessagesProps {
  userId: string;
}

export default function PrivateMessages({ userId }: PrivateMessagesProps) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/advisor-messages?userId=${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/advisor-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          content: newMessage,
          fromAdmin: true 
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages([newMsg, ...messages]);
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (message: AdvisorMessage) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/advisor-messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(m => m.id === messageId ? updatedMessage : m));
        setEditingMessage(null);
        setEditContent("");
      }
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/advisor-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          پیام‌های خصوصی مشاور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* فرم ارسال پیام جدید */}
        <div className="space-y-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="پیام خود را برای کاربر بنویسید..."
            rows={3}
            className="w-full"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || loading}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'در حال ارسال...' : 'ارسال پیام'}
          </Button>
        </div>

        {/* لیست پیام‌ها */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز پیامی ارسال نشده است</p>
            </div>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className={`border-l-4 ${
                message.fromAdmin ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500 bg-blue-50'
              }`}>
                <CardContent className="p-4">
                  {editingMessage === message.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(message.id)}
                          disabled={!editContent.trim() || loading}
                        >
                          {loading ? 'در حال ذخیره...' : 'ذخیره'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          لغو
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {message.fromAdmin ? (
                              <User className="w-4 h-4 text-green-600" />
                            ) : (
                              <Mail className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="text-sm font-medium">
                              {message.fromAdmin ? 'مشاور' : 'کاربر'}
                            </span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        {message.fromAdmin && (
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(message)}
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(message.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(message.createdAt), 'yyyy/MM/dd HH:mm')}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}























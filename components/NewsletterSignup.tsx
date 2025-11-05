"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("لطفاً ایمیل خود را وارد کنید");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("با موفقیت در خبرنامه عضو شدید! 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "خطایی رخ داده است");
      }
    } catch (error) {
      setStatus("error");
      setMessage("خطا در اتصال به سرور");
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-gray-900 mb-2">عضویت در خبرنامه</h4>
      <p className="text-sm text-gray-600 mb-3">
        آخرین مقالات و اخبار روان‌شناسی را دریافت کنید
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            placeholder="ایمیل شما"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pr-10 pl-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={status === "loading"}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              در حال عضویت...
            </>
          ) : (
            "عضویت در خبرنامه"
          )}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
          status === "success" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : status === "error"
            ? "bg-red-100 text-red-700 border border-red-200"
            : ""
        }`}>
          {status === "success" ? (
            <Check className="w-4 h-4" />
          ) : status === "error" ? (
            <AlertCircle className="w-4 h-4" />
          ) : null}
          {message}
        </div>
      )}
    </div>
  );
}


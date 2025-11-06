"use client";

import { useState } from "react";

export default function TestLoginHelper() {
  const [showHelper, setShowHelper] = useState(false);

  const testUsers = [
    { email: "admin@testology.me", password: "Admin@1234", name: "ادمین", role: "ADMIN" },
    { email: "user@testology.me", password: "User@1234", name: "کاربر تست", role: "USER" },
    { email: "user1@testology.me", password: "User@1234", name: "کاربر 1", role: "USER" },
    { email: "user2@testology.me", password: "User@1234", name: "کاربر 2", role: "USER" },
    { email: "user3@testology.me", password: "User@1234", name: "کاربر 3", role: "USER" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("کپی شد!");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowHelper(!showHelper)}
        className="bg-white/10 backdrop-blur border border-white/20 text-white/90 px-3 py-1.5 rounded-lg text-xs hover:bg-white/20 transition-colors"
      >
        {showHelper ? "❌ بستن" : "🧪 کاربران تست"}
      </button>

      {showHelper && (
        <div className="absolute bottom-10 left-0 bg-white/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] z-50">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">👥 کاربران تست</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {testUsers.map((user, index) => (
              <div key={index} className="bg-gray-50 p-2.5 rounded-lg text-xs border border-gray-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-gray-800">{user.name}</span>
                  {user.role && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-gray-600 text-[11px] flex-1 truncate">{user.email}</span>
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className="text-blue-600 hover:text-blue-800 text-[10px] px-1.5 py-0.5 bg-blue-50 rounded"
                  >
                    کپی
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600 text-[11px] flex-1 truncate">{user.password}</span>
                  <button
                    onClick={() => copyToClipboard(user.password)}
                    className="text-blue-600 hover:text-blue-800 text-[10px] px-1.5 py-0.5 bg-blue-50 rounded"
                  >
                    کپی
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-gray-500 pt-2 border-t border-gray-200">
            💡 روی "کپی" کلیک کنید تا ایمیل/رمز کپی شود
          </div>
        </div>
      )}
    </div>
  );
}





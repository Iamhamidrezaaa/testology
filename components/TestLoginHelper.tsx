"use client";

import { useState } from "react";

export default function TestLoginHelper() {
  const [showHelper, setShowHelper] = useState(false);

  const testUsers = [
    { email: "user1@testology.me", password: "user1123", name: "تست 1" },
    { email: "user2@testology.me", password: "user2123", name: "تست 2" },
    { email: "user3@testology.me", password: "user3123", name: "تست 3" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("کپی شد!");
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowHelper(!showHelper)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        {showHelper ? "❌ بستن" : "🧪 کاربران تست"}
      </button>

      {showHelper && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border rounded-lg shadow-xl p-4 min-w-80">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">👥 کاربران تست</h3>
          <div className="space-y-2">
            {testUsers.map((user, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">
                <div className="font-medium text-gray-800 dark:text-white">{user.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    کپی
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600 dark:text-gray-300">{user.password}</span>
                  <button
                    onClick={() => copyToClipboard(user.password)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    کپی
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            💡 روی "کپی" کلیک کنید تا ایمیل/رمز کپی شود
          </div>
        </div>
      )}
    </div>
  );
}





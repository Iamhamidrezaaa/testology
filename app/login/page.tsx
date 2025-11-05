"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TestLoginHelper from "@/components/TestLoginHelper";
import ClearDataButton from "@/components/ClearDataButton";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    
    console.log("🔍 تلاش لاگین:", { email: email.trim().toLowerCase(), password });

    if (email.trim().toLowerCase() === "admin@testology.me" && password === "admin123") {
      localStorage.setItem("testology_role", "admin");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      
      // Dispatch event برای اطلاع‌رسانی به Navbar
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      
      console.log("✅ Admin logged in successfully");
      router.push(callbackUrl);
      return;
    }

    if (email.trim().toLowerCase() === "user@testology.me" && password === "user123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      
      // Dispatch event برای اطلاع‌رسانی به Navbar
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      
      console.log("✅ User logged in successfully");
      router.push(callbackUrl);
      return;
    }

    // کاربران تست جدید
    if (email.trim().toLowerCase() === "user1@testology.me" && password === "user1123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      
      // Dispatch event برای اطلاع‌رسانی به Navbar
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      
      console.log("✅ User1 logged in successfully");
      router.push(callbackUrl);
      return;
    }

    if (email.trim().toLowerCase() === "user2@testology.me" && password === "user2123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      
      // Dispatch event برای اطلاع‌رسانی به Navbar
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      
      console.log("✅ User2 logged in successfully");
      router.push(callbackUrl);
      return;
    }

    if (email.trim().toLowerCase() === "user3@testology.me" && password === "user3123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      
      // Dispatch event برای اطلاع‌رسانی به Navbar
      window.dispatchEvent(new CustomEvent("localStorageChange"));
      
      console.log("✅ User3 logged in successfully");
      router.push(callbackUrl);
      return;
    }

    setErr("ایمیل یا رمز عبور اشتباه است.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-lg animate-bounce"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
              <span className="text-3xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Testology</h1>
            <p className="text-blue-200 text-sm">سفر خودشناسی شما از اینجا آغاز می‌شود</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="ایمیل"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>
            </div>

            {err && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center backdrop-blur-sm">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              ورود به پلتفرم
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-blue-200 text-xs">
              با ورود به Testology، سفر خودشناسی خود را آغاز کنید
            </p>
          </div>
        </div>
      </div>
      
      {/* Helper برای کاربران تست */}
      <TestLoginHelper />
      
      {/* دکمه پاک کردن داده‌ها */}
      <ClearDataButton />
    </div>
  );
}

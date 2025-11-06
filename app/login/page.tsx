'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TestLoginHelper from '@/components/TestLoginHelper';
import ClearDataButton from '@/components/ClearDataButton';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    setErr('');
  }, [email, password]);

  function handleLocalAuth() {
    const e = email.trim().toLowerCase();

    // ادمین
    if (e === 'admin@testology.me' && password === 'Admin@1234') {
      localStorage.setItem('testology_role', 'admin');
      localStorage.setItem('testology_email', e);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
      router.push('/admin/dashboard'); // داشبورد ادمین
      return true;
    }

    // کاربر عادی
    const demoUsers = [
      { email: 'user@testology.me', pass: 'User@1234' },
      { email: 'user1@testology.me', pass: 'User@1234' },
      { email: 'user2@testology.me', pass: 'User@1234' },
      { email: 'user3@testology.me', pass: 'User@1234' },
    ];
    const hit = demoUsers.find(u => u.email === e && u.pass === password);
    if (hit) {
      localStorage.setItem('testology_role', 'user');
      localStorage.setItem('testology_email', e);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
      
      // بررسی اینکه آیا کاربر جدید است یا نه
      // اگر callbackUrl مشخص شده، به آن برو
      if (callbackUrl && callbackUrl !== '/dashboard') {
        router.push(callbackUrl);
        return true;
      }
      
      // بررسی وضعیت کاربر (آیا غربالگری و تست انجام داده یا نه)
      const hasScreening = localStorage.getItem("testology_screening_completed");
      const hasResults = localStorage.getItem("testology_test_results");
      const hasProfile = localStorage.getItem("testology_profile_completed");
      
      // اگر کاربر جدید است (هیچ داده‌ای ندارد)، به صفحه غربالگری بفرست
      if (!hasScreening || !hasResults || !hasProfile) {
        router.push('/start');
      } else {
        // کاربر قبلاً همه مراحل را انجام داده - به داشبورد بفرست
        router.push('/dashboard');
      }
      return true;
    }

    return false;
  }

  async function handleLogin(ev: React.FormEvent) {
    ev.preventDefault();
    setErr('');

    // اگر بعداً NextAuth ایمیلی/اعتباری اضافه کردی، قبل از localAuth اینجا صدا بزن.
    const ok = handleLocalAuth();
    if (!ok) setErr('ایمیل یا رمز عبور اشتباه است.');
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-[#6d35ff] via-[#6d35ff] to-[#2a6ef1] flex items-center justify-center px-3 py-10">
      {/* کارت */}
      <div className="w-full max-w-md">
        {/* هدر کارت */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="mt-4 text-white text-3xl font-bold">Testology</h1>
          <p className="text-white/80 text-sm mt-1">سفر خودشناسی شما از اینجا آغاز می‌شود</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-5 sm:p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* ایمیل */}
            <div className="relative">
              <input
                type="email"
                autoComplete="username"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-2xl bg-white/15 border border-white/30 text-white placeholder:text-white/60 pr-11 pl-4 outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-white/70">📧</span>
            </div>

            {/* پسورد */}
            <div className="relative">
              <input
                type="password"
                autoComplete="current-password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-2xl bg-white/15 border border-white/30 text-white placeholder:text-white/60 pr-11 pl-4 outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-white/70">🔒</span>
            </div>

            {/* خطا */}
            {err && (
              <div className="bg-red-500/20 border border-red-400/30 text-white rounded-xl px-3 py-2 text-sm">
                {err}
              </div>
            )}

            {/* دکمه ورود */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#7b5cff] to-[#2b7cff] text-white font-semibold shadow-lg hover:opacity-95 active:opacity-90 transition"
            >
              ورود به پلتفرم
            </button>

            {/* لینک‌های کمکی */}
            <div className="flex items-center justify-between text-xs text-white/80">
              <Link href="/register" className="hover:text-white">ورود / عضویت</Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('testology_role');
                  localStorage.removeItem('testology_email');
                  window.dispatchEvent(new CustomEvent('localStorageChange'));
                }}
                className="flex items-center gap-1 hover:text-white"
                title="پاک‌کردن داده‌های تست"
              >
                🧹 پاک‌کردن داده‌های تست
              </button>
            </div>
          </form>
        </div>

        {/* نوار پایین کارت: کاربران تست و … */}
        <div className="mt-4 flex items-center justify-between text-[13px] text-white/90">
          <TestLoginHelper />
          <ClearDataButton />
        </div>
      </div>
    </div>
  );
}

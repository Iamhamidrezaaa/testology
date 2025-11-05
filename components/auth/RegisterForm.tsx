"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [step, setStep] = useState<"enter" | "verify">("enter");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // در اینجا باید به API ارسال کد متصل شویم
      // فعلاً شبیه‌سازی می‌کنیم
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep("verify");
    } catch (err) {
      setError("خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        identifier,
        code,
        isNewUser: true,
        redirect: false,
      });

      if (result?.error) {
        setError("کد وارد شده صحیح نیست.");
      } else {
        window.location.href = "/complete-profile";
      }
    } catch (err) {
      setError("خطا در تأیید کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={step === "enter" ? handleSendCode : handleVerify} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {step === "enter" ? (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ایمیل یا شماره موبایل
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@email.com یا ۰۹۱۲۳۴۵۶۷۸۹"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
          </button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              کد تأیید
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest"
              placeholder="کد ۶ رقمی"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "در حال بررسی..." : "ثبت‌نام"}
          </button>
          <button
            type="button"
            onClick={() => setStep("enter")}
            className="w-full text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            تغییر ایمیل/شماره موبایل
          </button>
        </>
      )}
    </form>
  );
} 
"use client";
import { useEffect } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function RTLHandler() {
  const { lang } = useLanguage();

  useEffect(() => {
    const dir = ["fa", "ar"].includes(lang) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.documentElement.lang = lang;
    
    // اضافه کردن کلاس‌های RTL/LTR به body
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(dir);
    
    // تنظیم font-family بر اساس زبان
    if (["fa", "ar"].includes(lang)) {
      document.body.style.fontFamily = 'var(--font-vazirmatn), system-ui, sans-serif';
    } else {
      document.body.style.fontFamily = 'var(--font-inter), system-ui, sans-serif';
    }
  }, [lang]);

  return null;
}















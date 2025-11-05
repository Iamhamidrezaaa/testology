// /app/therapists/page.tsx
"use client";
import { useState } from "react";
import { therapists } from "@/data/therapists";
import TherapistCard from "@/components/TherapistCard";

const categories = [
  "همه",
  "اضطراب و افسردگی",
  "روابط و ازدواج",
  "رشد فردی و کاری",
  "کودک و نوجوان",
  "خواب و تمرکز",
  "عمومی",
];

export default function TherapistsPage() {
  const [selected, setSelected] = useState("همه");
  const filtered =
    selected === "همه"
      ? therapists
      : therapists.filter((t) => t.category === selected);

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
          درمانگران تأییدشده‌ی Testology 🧠
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          همه‌ی درمانگران این بخش توسط تیم علمی Testology اعتبارسنجی شده‌اند و آماده‌ی
          مشاوره تخصصی در زمینه‌های مختلف روان‌شناسی هستند.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              selected === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <TherapistCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
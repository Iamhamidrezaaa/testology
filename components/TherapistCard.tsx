// /components/TherapistCard.tsx
"use client";
import Link from "next/link";

export default function TherapistCard({ t }: { t: any }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-md overflow-hidden hover:shadow-lg transition">
      <Link href={`/therapists/${t.slug}`}>
        <img
          src={t.image || "/images/default-therapist.jpg"}
          alt={t.name}
          className="w-full h-80 object-cover rounded-t-2xl cursor-pointer hover:opacity-90 transition"
        />
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{t.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              t.status === "آنلاین"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {t.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t.specialty}</p>
        <p className="text-xs text-gray-500">{t.experience}</p>
        <p className="text-xs text-gray-500">{t.education}</p>
        <div className="flex justify-between mt-3">
          <Link
            href={`/therapists/${t.slug}`}
            className="text-blue-600 text-sm underline hover:text-blue-700"
          >
            مشاهده پروفایل
          </Link>
          <button
            className={`text-sm px-3 py-1 rounded-xl ${
              t.status === "آنلاین"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white"
            }`}
            disabled={t.status !== "آنلاین"}
          >
            درخواست مشاوره
          </button>
        </div>
      </div>
    </div>
  );
}

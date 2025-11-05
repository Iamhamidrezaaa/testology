// /app/therapists/[id]/page.tsx
import { therapists } from "@/data/therapists";
import Link from "next/link";

export default function TherapistProfile({ params }: { params: { id: string } }) {
  const therapist = therapists.find((t) => t.slug === params.id);

  if (!therapist)
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-lg font-semibold">درمانگر یافت نشد</h1>
        <Link href="/therapists" className="text-blue-600 underline">
          بازگشت
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={therapist.image}
          alt={therapist.name}
          className="w-64 h-64 rounded-2xl object-cover shadow-md"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{therapist.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{therapist.specialty}</p>
          <p className="text-sm">{therapist.experience}</p>
          <p className="text-sm">{therapist.education}</p>
          <span
            className={`inline-block text-xs mt-2 px-2 py-1 rounded-full ${
              therapist.status === "آنلاین"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {therapist.status}
          </span>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {therapist.bio}
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/therapists"
              className="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              بازگشت
            </Link>
            <button
              className={`text-sm px-4 py-2 rounded-xl ${
                therapist.status === "آنلاین"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white"
              }`}
              disabled={therapist.status !== "آنلاین"}
            >
              رزرو جلسه
            </button>
          </div>
        </div>
      </div>

      {/* زیرمجموعه‌ها */}
      <div className="border-t pt-6">
        <h2 className="font-semibold mb-3">زمینه‌های تخصصی</h2>
        <ul className="list-disc pr-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>درمان شناختی-رفتاری (CBT)</li>
          <li>تمرکز بر ذهن‌آگاهی (Mindfulness)</li>
          <li>تحلیل احساسات و هیجانات</li>
        </ul>
      </div>

      <div className="border-t pt-6">
        <h2 className="font-semibold mb-3">نظر کاربران</h2>
        <p className="text-sm text-gray-500">به‌زودی اضافه می‌شود...</p>
      </div>
    </div>
  );
}

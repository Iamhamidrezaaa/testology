"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-3 max-w-3xl mx-auto -mt-8 relative z-10" dir="rtl">
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجو در تست‌ها، مقالات، درمانگران، گروه‌ها..."
            className="w-full rounded-xl p-4 pr-10 text-right placeholder:text-right border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white transition-all"
            dir="rtl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          جست‌وجو
        </button>
      </form>

      {/* پیشنهادهای سریع */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">جست‌وجوی محبوب:</span>
        {['اضطراب', 'افسردگی', 'استرس', 'عزت‌نفس', 'خواب'].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag);
              router.push(`/search?q=${encodeURIComponent(tag)}`);
            }}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
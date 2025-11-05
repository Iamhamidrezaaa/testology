"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  type: string;
  category: string;
  difficulty: string;
  author: {
    name: string | null;
  };
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ type?: string; category?: string }>({});

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.category) params.append('category', filter.category);

      const response = await fetch(`/api/marketplace?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          🛍 مارکت محتوا
        </h1>

        {/* فیلترها */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select
            value={filter.type || ''}
            onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="">همه انواع</option>
            <option value="exercise">تمرین</option>
            <option value="meditation">مراقبه</option>
            <option value="ebook">کتاب</option>
            <option value="audio">صوتی</option>
          </select>

          <select
            value={filter.category || ''}
            onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="">همه دسته‌ها</option>
            <option value="anxiety">اضطراب</option>
            <option value="depression">افسردگی</option>
            <option value="stress">استرس</option>
            <option value="self-esteem">عزت‌نفس</option>
          </select>
        </div>

        {/* آیتم‌ها */}
        {loading ? (
          <div className="text-center py-16">در حال بارگذاری...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">محتوایی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/marketplace/${item.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-6xl">
                  {item.type === 'exercise' ? '💪' :
                   item.type === 'meditation' ? '🧘' :
                   item.type === 'ebook' ? '📚' :
                   item.type === 'audio' ? '🎧' : '📦'}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {item.price === 0 ? 'رایگان' : `${item.price.toLocaleString('fa-IR')} تومان`}
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

















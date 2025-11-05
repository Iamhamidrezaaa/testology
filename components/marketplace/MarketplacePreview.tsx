'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  category: string;
  imageUrl: string | null;
}

export default function MarketplacePreview() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/marketplace?limit=6');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🛍 Marketplace - Exercises & Resources
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Professional content for your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/marketplace/${item.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-500"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-6xl">
                {item.type === 'exercise' ? '💪' :
                 item.type === 'meditation' ? '🧘' :
                 item.type === 'ebook' ? '📚' :
                 item.type === 'audio' ? '🎧' : '📦'}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                    {item.type}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {item.price === 0 ? 'Free' : `$${item.price}`}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/marketplace"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            View All Items
          </Link>
        </div>
      </div>
    </section>
  );
}

















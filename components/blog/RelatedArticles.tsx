'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RelatedArticlesProps {
  currentSlug: string;
}

export default function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchRelated();
  }, [currentSlug]);

  const fetchRelated = async () => {
    try {
      const response = await fetch(`/api/blog/related?slug=${currentSlug}&limit=3`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Related Articles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-500"
          >
            {article.coverUrl && (
              <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-500"></div>
            )}
            <div className="p-4">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

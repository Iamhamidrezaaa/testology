"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query || '')}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">
        <p className="text-gray-500">لطفاً یک عبارت جست‌وجو وارد کنید</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <p>در حال جست‌وجو...</p>
      </div>
    );
  }

  const totalResults = results
    ? Object.values(results).reduce((sum: number, arr: any) => sum + (arr?.length || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          نتایج جست‌وجو برای: "{query}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {totalResults} نتیجه یافت شد
        </p>

        {/* تست‌ها */}
        {results?.tests?.length > 0 && (
          <Section title="📊 تست‌های روان‌شناسی" count={results.tests.length}>
            {results.tests.map((test: any) => (
              <Link
                key={test.slug}
                href={`/tests/${test.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-800 dark:text-white">{test.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{test.category}</p>
              </Link>
            ))}
          </Section>
        )}

        {/* مقالات */}
        {results?.articles?.length > 0 && (
          <Section title="📚 مقالات" count={results.articles.length}>
            {results.articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{article.excerpt}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>👤 {article.author?.name}</span>
                  <span>•</span>
                  <span>👁️ {article.views}</span>
                </div>
              </Link>
            ))}
          </Section>
        )}

        {/* درمانگران */}
        {results?.therapists?.length > 0 && (
          <Section title="👨‍⚕️ درمانگران" count={results.therapists.length}>
            {results.therapists.map((therapist: any) => (
              <Link
                key={therapist.id}
                href={`/therapist/${therapist.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {therapist.name ? therapist.name.charAt(0) : '👨‍⚕️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{therapist.name}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{therapist.specialty}</p>
                  </div>
                </div>
              </Link>
            ))}
          </Section>
        )}

        {/* تمرین‌ها */}
        {results?.exercises?.length > 0 && (
          <Section title="💪 تمرین‌ها و محتوا" count={results.exercises.length}>
            {results.exercises.map((exercise: any) => (
              <Link
                key={exercise.id}
                href={`/marketplace/${exercise.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{exercise.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{exercise.description}</p>
                <div className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {exercise.price === 0 ? 'رایگان' : `${exercise.price.toLocaleString('fa-IR')} تومان`}
                </div>
              </Link>
            ))}
          </Section>
        )}

        {totalResults === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              نتیجه‌ای یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              لطفاً با کلمات دیگری جست‌وجو کنید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {title} ({count})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

















'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">خطا در جست‌وجو</p>
      </div>
    );
  }

  const totalResults = Object.values(results).reduce(
    (sum: number, arr: any) => sum + (arr?.length || 0),
    0
  );

  if (totalResults === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Search results for: "{query}"
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Found {totalResults} results
      </p>

      {/* Tests */}
      {results.tests?.length > 0 && (
        <Section title="📊 Psychology Tests" count={results.tests.length}>
          {results.tests.map((test: any) => (
            <Link
              key={test.slug}
              href={`/tests/${test.slug}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-purple-500 transition-all"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white">{test.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{test.category}</p>
            </Link>
          ))}
        </Section>
      )}

      {/* Articles */}
      {results.articles?.length > 0 && (
        <Section title="📚 Articles" count={results.articles.length}>
          {results.articles.map((article: any) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-purple-500 transition-all"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>👤 {article.author?.name}</span>
                <span>•</span>
                <span>👁️ {article.views}</span>
              </div>
            </Link>
          ))}
        </Section>
      )}

      {/* Therapists */}
      {results.therapists?.length > 0 && (
        <Section title="👨‍⚕️ Therapists" count={results.therapists.length}>
          {results.therapists.map((therapist: any) => (
            <Link
              key={therapist.id}
              href={`/therapist/${therapist.id}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-purple-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {therapist.name ? therapist.name.charAt(0) : '👨‍⚕️'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{therapist.name}</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{therapist.specialty}</p>
                </div>
              </div>
            </Link>
          ))}
        </Section>
      )}

      {/* Exercises */}
      {results.exercises?.length > 0 && (
        <Section title="💪 Exercises & Content" count={results.exercises.length}>
          {results.exercises.map((exercise: any) => (
            <Link
              key={exercise.id}
              href={`/marketplace/${exercise.id}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-purple-500 transition-all"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{exercise.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {exercise.description}
              </p>
            </Link>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {title} ({count})
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

















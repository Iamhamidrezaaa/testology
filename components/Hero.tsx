'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-100 to-white dark:from-gray-800 dark:to-gray-900 py-16 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
        Testology 🧠 | Scientific Psychology for Everyone
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
        Take accurate psychology tests, get AI-powered analysis, and access scientific content with just a few clicks!
      </p>
      <Link
        href="/tests"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Start Free Test
      </Link>
    </section>
  );
}

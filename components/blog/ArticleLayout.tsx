'use client';

import Image from 'next/image';
import { BookmarkButton } from '@/components/shared/BookmarkButton';
import { VoicePlayback } from '@/components/shared/VoicePlayback';
import FeedbackForm from '@/components/shared/FeedbackForm';

interface ArticleLayoutProps {
  article: {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    coverUrl?: string;
    author: {
      name: string | null;
      image: string | null;
    };
    category: {
      name: string;
      slug: string;
    };
    views: number;
    likes: number;
    createdAt: string;
    tags: string;
  };
}

export default function ArticleLayout({ article }: ArticleLayoutProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tags = JSON.parse(article.tags || '[]');

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/blog/category/${article.category.slug}`}
            className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-medium"
          >
            {article.category.name}
          </Link>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Author & Stats */}
        <div className="flex items-center justify-between border-y border-gray-200 dark:border-gray-700 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
              {article.author.name ? article.author.name.charAt(0) : '?'}
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {article.author.name || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-500">Author</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>👁️ {article.views} views</span>
            <span>❤️ {article.likes} likes</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverUrl && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={article.coverUrl}
            alt={article.title}
            width={1200}
            height={600}
            className="w-full"
          />
        </div>
      )}

      {/* Voice Playback */}
      <div className="mb-8">
        <VoicePlayback text={article.content} title={article.title} />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mb-12">
        <BookmarkButton targetId={article.id} targetType="article" />
        <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">
          Share
        </button>
      </div>

      {/* Feedback */}
      <div className="mb-8">
        <FeedbackForm targetId={article.id} targetType="article" title="Your feedback on this article" />
      </div>
    </article>
  );
}

















"use client";

import React, { useState } from 'react';

interface FeedbackFormProps {
  targetId?: string;
  targetType?: 'article' | 'exercise' | 'test' | 'therapist';
  title?: string;
}

export function FeedbackForm({ targetId, targetType, title }: FeedbackFormProps) {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('لطفاً پیام خود را وارد کنید');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          rating: rating > 0 ? rating : null,
          targetId,
          targetType,
          email: email || null
        })
      });

      if (response.ok) {
        setSuccess(true);
        setMessage('');
        setRating(0);
        setEmail('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('خطا در ارسال بازخورد');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('خطا در ارسال بازخورد');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>💬</span>
        {title || 'نظر شما'}
      </h3>

      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-green-700 dark:text-green-400 font-medium">
            بازخورد شما با موفقیت ارسال شد!
          </p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-2">
            از وقتی که گذاشتید متشکریم 🙏
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* امتیاز */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              امتیاز شما (اختیاری)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  {rating} از 5
                </span>
              )}
            </div>
          </div>

          {/* پیام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              پیام شما *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="نظر، پیشنهاد یا انتقاد خود را با ما در میان بگذارید..."
              required
            />
          </div>

          {/* ایمیل (اختیاری) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ایمیل (اختیاری - برای پاسخگویی)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          {/* دکمه ارسال */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-md"
          >
            {sending ? 'در حال ارسال...' : '📤 ارسال بازخورد'}
          </button>
        </form>
      )}
    </div>
  );
}

export default FeedbackForm;

















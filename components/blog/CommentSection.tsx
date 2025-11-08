import React, { useState, useEffect } from 'react';
import { BlogComment } from '@/types/blog';

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/comments?blogId=${blogId}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('خطا در دریافت نظرات:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          content: newComment,
          author,
          email: email || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewComment('');
        setAuthor('');
        setEmail('');
        fetchComments();
      }
    } catch (error) {
      console.error('خطا در ارسال نظر:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h3 className="text-xl font-bold mb-4">نظرات ({comments.length})</h3>
      
      {/* فرم ارسال نظر */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">نام شما:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">ایمیل (اختیاری):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">نظر شما:</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded h-24"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ارسال نظر'}
        </button>
      </form>

      {/* لیست نظرات */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{comment.authorName || comment.authorEmail || 'ناشناس'}</h4>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
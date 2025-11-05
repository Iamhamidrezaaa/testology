import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          width={320}
          height={180}
          className="blog-card-img"
        />
      </div>

      <div className="blog-card-content">
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-description">{blog.metaDescription}</p>

        <div className="blog-card-tags">
          {JSON.parse(blog.tags || '[]').slice(0, 3).map((tag: string, index: number) => (
            <span key={index} className="blog-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="blog-card-footer">
          <Link
            href={`/blog/${blog.slug}`}
            className="blog-card-link"
          >
            ادامه مطلب
          </Link>
          <span className="blog-card-date">
            {new Date(blog.createdAt).toLocaleDateString('fa-IR')}
          </span>
        </div>
      </div>
    </div>
  );
}
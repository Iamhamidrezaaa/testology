// انواع TypeScript برای سیستم بلاگ

export interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string; // JSON string
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  blogs: Blog[];
  message?: string;
}

export interface CreateBlogRequest {
  slug: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface CreateBlogResponse {
  success: boolean;
  blog: Blog;
  message?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  published?: boolean;
  publishedAt?: Date | string;
  featured?: boolean;
  viewCount?: number;
  views?: number;
  authorId?: string;
  category?: {
    id: string;
    slug: string;
    name: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId?: string | null;
  content: string;
  approved: boolean;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  blog?: {
    id: string;
    title: string;
  };
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  published?: boolean;
  publishedAt?: Date | string;
  featured?: boolean;
  viewCount?: number;
  views?: number;
  authorId?: string;
  category?: {
    id: string;
    slug: string;
    name: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId?: string | null;
  content: string;
  approved: boolean;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  blog?: {
    id: string;
    title: string;
  };
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  published?: boolean;
  publishedAt?: Date | string;
  featured?: boolean;
  viewCount?: number;
  views?: number;
  authorId?: string;
  category?: {
    id: string;
    slug: string;
    name: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId?: string | null;
  content: string;
  approved: boolean;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  blog?: {
    id: string;
    title: string;
  };
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}
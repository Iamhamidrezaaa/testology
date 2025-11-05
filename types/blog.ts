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
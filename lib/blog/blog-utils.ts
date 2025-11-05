// ابزارهای کمکی برای بلاگ
import { prisma } from '@/lib/prisma'

export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  categoriesCount: number
}

export async function getBlogStats(): Promise<BlogStats> {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalComments,
    categoriesCount
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: false } }),
    prisma.blogPost.aggregate({
      _sum: { views: true }
    }),
    prisma.blogPost.aggregate({
      _sum: { likes: true }
    }),
    prisma.blogComment.count(),
    prisma.blogCategory.count()
  ])

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: totalViews._sum.views || 0,
    totalLikes: totalLikes._sum.likes || 0,
    totalComments,
    categoriesCount
  }
}

export async function getPopularPosts(limit: number = 5) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { views: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getRecentPosts(limit: number = 5) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getRelatedPosts(postId: string, categoryId: string, limit: number = 3) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      categoryId,
      id: { not: postId }
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function searchPosts(query: string, limit: number = 10) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ]
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getPostsByCategory(categorySlug: string, limit: number = 10) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      category: { slug: categorySlug }
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getPostsByTag(tag: string, limit: number = 10) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      tags: { has: tag }
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })
}

export async function getAllTags() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true }
  })

  const allTags = posts.flatMap(post => post.tags)
  const uniqueTags = [...new Set(allTags)]
  
  return uniqueTags.map(tag => ({
    name: tag,
    count: allTags.filter(t => t === tag).length
  })).sort((a, b) => b.count - a.count)
}

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: { published: true }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // حذف HTML tags
  const plainText = content.replace(/<[^>]*>/g, '')
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.substring(0, maxLength).trim() + '...'
}

export function formatReadingTime(content: string): number {
  // تخمین زمان مطالعه بر اساس تعداد کلمات
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function validateBlogPost(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title || data.title.trim().length < 5) {
    errors.push('عنوان باید حداقل 5 کاراکتر باشد')
  }

  if (!data.slug || data.slug.trim().length < 3) {
    errors.push('آدرس مقاله باید حداقل 3 کاراکتر باشد')
  }

  if (!data.content || data.content.trim().length < 100) {
    errors.push('محتوای مقاله باید حداقل 100 کاراکتر باشد')
  }

  if (!data.categoryId) {
    errors.push('دسته‌بندی الزامی است')
  }

  if (!data.authorId) {
    errors.push('نویسنده الزامی است')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

















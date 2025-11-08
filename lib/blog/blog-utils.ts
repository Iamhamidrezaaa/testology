// ابزارهای کمکی برای بلاگ
import prisma from '@/lib/prisma'
import { IS_BUILD } from '@/lib/isBuild'

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
  if (IS_BUILD) {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      categoriesCount: 0
    }
  }

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalComments,
    categoriesCount
  ] = await Promise.all([
    prisma.blog.count().catch(() => 0),
    prisma.blog.count({ where: { published: true } }).catch(() => 0),
    prisma.blog.count({ where: { published: false } }).catch(() => 0),
    prisma.blog.aggregate({
      _sum: { viewCount: true }
    }).catch(() => ({ _sum: { viewCount: null } })),
    // likes field doesn't exist
    Promise.resolve({ _sum: { likes: null } }),
    // blogComment model doesn't exist
    Promise.resolve(0),
    prisma.blogCategory.count().catch(() => 0)
  ])

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: totalViews._sum.viewCount || 0,
    totalLikes: 0, // likes field doesn't exist
    totalComments,
    categoriesCount
  }
}

export async function getPopularPosts(limit: number = 5) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { viewCount: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      viewCount: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function getRecentPosts(limit: number = 5) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function getRelatedPosts(postId: string, category: string, limit: number = 3) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: {
      published: true,
      category,
      id: { not: postId }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function searchPosts(query: string, limit: number = 10) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { metaDescription: { contains: query } },
        { content: { contains: query } },
        { tags: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function getPostsByCategory(categorySlug: string, limit: number = 10) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: {
      published: true,
      category: categorySlug
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function getPostsByTag(tag: string, limit: number = 10) {
  if (IS_BUILD) return []
  return prisma.blog.findMany({
    where: {
      published: true,
      tags: { contains: tag }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  }).catch(() => [])
}

export async function getAllTags() {
  if (IS_BUILD) return []
  const posts = await prisma.blog.findMany({
    where: { published: true },
    select: { tags: true }
  }).catch(() => [])

  const allTags = posts
    .flatMap(post => post.tags ? post.tags.split(',').map((t: any) => t.trim()) : [])
    .filter((t: any) => t.length > 0)
  const uniqueTags = Array.from(new Set(allTags))
  
  return uniqueTags.map((tag: any) => ({
    name: tag,
    count: allTags.filter((t: any) => t === tag).length
  })).sort((a: any, b: any) => b.count - a.count)
}

export async function getBlogCategories() {
  if (IS_BUILD) return []
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' }
  }).catch(() => [])

  // محاسبه تعداد پست‌ها برای هر دسته
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const postCount = await prisma.blog.count({
        where: {
          category: category.slug,
          published: true
        }
      }).catch(() => 0)
      return {
        ...category,
        _count: { posts: postCount }
      }
    })
  )

  return categoriesWithCounts
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

  if (!data.category) {
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

















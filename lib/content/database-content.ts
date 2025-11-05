// اتصال محتوای مرتبط از دیتابیس
import { prisma } from '@/lib/prisma'

export interface RelatedContent {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'test' | 'category' | 'city';
  publishedAt: Date;
  updatedAt: Date;
}

export async function getRelatedTests(categorySlug: string): Promise<RelatedContent[]> {
  try {
    const tests = await prisma.test.findMany({
      where: {
        category: {
          slug: categorySlug
        },
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return tests.map(test => ({
      id: test.id,
      title: test.title,
      description: test.description,
      url: `/tests/${test.slug}`,
      type: 'test' as const,
      publishedAt: test.createdAt,
      updatedAt: test.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching related tests:', error)
    return []
  }
}

export async function getRelatedArticles(categorySlug: string): Promise<RelatedContent[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        category: {
          slug: categorySlug
        },
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 10
    })

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export async function getRelatedTestsByCity(citySlug: string): Promise<RelatedContent[]> {
  try {
    const tests = await prisma.test.findMany({
      where: {
        cities: {
          some: {
            slug: citySlug
          }
        },
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return tests.map(test => ({
      id: test.id,
      title: test.title,
      description: test.description,
      url: `/tests/${test.slug}`,
      type: 'test' as const,
      publishedAt: test.createdAt,
      updatedAt: test.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching tests by city:', error)
    return []
  }
}

export async function getRelatedArticlesByCity(citySlug: string): Promise<RelatedContent[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        cities: {
          some: {
            slug: citySlug
          }
        },
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 10
    })

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching articles by city:', error)
    return []
  }
}

export async function getPopularTests(limit: number = 5): Promise<RelatedContent[]> {
  try {
    const tests = await prisma.test.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
        _count: {
          select: {
            results: true
          }
        }
      },
      orderBy: {
        results: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return tests.map(test => ({
      id: test.id,
      title: test.title,
      description: test.description,
      url: `/tests/${test.slug}`,
      type: 'test' as const,
      publishedAt: test.createdAt,
      updatedAt: test.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching popular tests:', error)
    return []
  }
}

export async function getRecentArticles(limit: number = 5): Promise<RelatedContent[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        updatedAt: true,
        publishedAt: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    })

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching recent articles:', error)
    return []
  }
}

















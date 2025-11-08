// اتصال محتوای مرتبط از دیتابیس
import { prisma } from '@/lib/prisma'
import { IS_BUILD } from '@/lib/isBuild'

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
  if (IS_BUILD) return []
  try {
    const tests = await prisma.test.findMany({
      where: {
        category: categorySlug,
        isActive: true
      },
      select: {
        id: true,
        testName: true,
        description: true,
        testSlug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    }).catch(() => [])

    return tests.map((test: any) => ({
      id: test.id,
      title: test.testName || test.title,
      description: test.description,
      url: `/tests/${test.testSlug || test.slug}`,
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
  if (IS_BUILD) return []
  try {
    const articles = await prisma.article.findMany({
      where: {
        category: categorySlug,
        published: true
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc'
      },
      take: 10
    }).catch(() => [])

    return articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.excerpt || article.metaDescription,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.createdAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export async function getRelatedTestsByCity(citySlug: string): Promise<RelatedContent[]> {
  if (IS_BUILD) return []
  try {
    const tests = await prisma.test.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        testName: true,
        description: true,
        testSlug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    }).catch(() => [])

    return tests.map((test: any) => ({
      id: test.id,
      title: test.testName || test.title,
      description: test.description,
      url: `/tests/${test.testSlug || test.slug}`,
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
  if (IS_BUILD) return []
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    }).catch(() => [])

    return articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.excerpt || article.metaDescription,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.createdAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching articles by city:', error)
    return []
  }
}

export async function getPopularTests(limit: number = 5): Promise<RelatedContent[]> {
  if (IS_BUILD) return []
  try {
    const tests = await prisma.test.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        testName: true,
        description: true,
        testSlug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    }).catch(() => [])

    return tests.map((test: any) => ({
      id: test.id,
      title: test.testName || test.title,
      description: test.description,
      url: `/tests/${test.testSlug || test.slug}`,
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
  if (IS_BUILD) return []
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    }).catch(() => [])

    return articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.excerpt || article.metaDescription,
      url: `/blog/${article.slug}`,
      type: 'article' as const,
      publishedAt: article.createdAt,
      updatedAt: article.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching recent articles:', error)
    return []
  }
}

















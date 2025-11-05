// وارد کردن مقالات ترجمه‌شده
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export interface ArticleData {
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string
  tags: string[]
  category: string
  author: string
  published: boolean
}

export async function importArticlesFromFiles() {
  try {
    const articlesDir = path.join(process.cwd(), 'lib', 'blog', 'articles')
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'))
    
    console.log(`Found ${files.length} article files`)

    // ایجاد دسته‌بندی‌های پیش‌فرض
    const categories = await createDefaultCategories()
    
    // ایجاد نویسنده پیش‌فرض
    const author = await createDefaultAuthor()

    const importedArticles = []

    for (const file of files) {
      try {
        const filePath = path.join(articlesDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        
        const articleData = parseMarkdownFile(content, file)
        
        // ایجاد مقاله در دیتابیس
        const article = await prisma.blogPost.create({
          data: {
            title: articleData.title,
            slug: articleData.slug,
            excerpt: articleData.excerpt,
            content: articleData.content,
            coverUrl: articleData.coverUrl,
            tags: articleData.tags,
            published: articleData.published,
            publishedAt: articleData.published ? new Date() : null,
            categoryId: categories[articleData.category]?.id || categories['general'].id,
            authorId: author.id
          }
        })

        importedArticles.push(article)
        console.log(`Imported: ${article.title}`)
      } catch (error) {
        console.error(`Error importing ${file}:`, error)
      }
    }

    return importedArticles
  } catch (error) {
    console.error('Error importing articles:', error)
    throw error
  }
}

function parseMarkdownFile(content: string, filename: string): ArticleData {
  // تجزیه فایل markdown
  const lines = content.split('\n')
  
  // استخراج شماره مقاله از نام فایل
  const articleNumber = filename.replace('article_', '').replace('.md', '')
  
  // تولید عنوان و محتوا بر اساس شماره مقاله
  const title = `مقاله شماره ${articleNumber}`
  
  // تولید slug
  const slug = `article-${articleNumber}`
  
  // محتوای placeholder
  const excerpt = 'این مقاله ترجمه‌شده از PsychCentral است و محتوای آن به‌زودی تکمیل می‌شود.'
  const fullContent = content

  // تعیین دسته‌بندی بر اساس شماره مقاله
  const category = determineCategoryByNumber(parseInt(articleNumber))
  
  // تعیین تگ‌ها بر اساس شماره مقاله
  const tags = generateTagsByNumber(parseInt(articleNumber))

  return {
    title,
    slug,
    excerpt,
    content: fullContent,
    coverUrl: `/images/blog/article-${articleNumber}.jpg`,
    tags,
    category,
    author: 'تیم تستولوژی',
    published: true
  }
}

function determineCategoryByNumber(articleNumber: number): string {
  // توزیع مقالات در دسته‌بندی‌های مختلف
  if (articleNumber <= 10) return 'mental-health'
  if (articleNumber <= 20) return 'personal-growth'
  if (articleNumber <= 30) return 'relationships'
  if (articleNumber <= 40) return 'family'
  return 'general'
}

function determineCategory(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase()
  
  if (text.includes('استرس') || text.includes('اضطراب') || text.includes('depression') || text.includes('افسردگی')) {
    return 'mental-health'
  }
  if (text.includes('عزت نفس') || text.includes('اعتماد') || text.includes('self-esteem') || text.includes('confidence')) {
    return 'personal-growth'
  }
  if (text.includes('روابط') || text.includes('relationship') || text.includes('عشق') || text.includes('love')) {
    return 'relationships'
  }
  if (text.includes('خانواده') || text.includes('family') || text.includes('کودک') || text.includes('child')) {
    return 'family'
  }
  
  return 'general'
}

function generateTagsByNumber(articleNumber: number): string[] {
  const tagSets = [
    ['استرس', 'اضطراب', 'مدیریت استرس'], // مقالات 1-10
    ['عزت نفس', 'اعتماد به نفس', 'رشد شخصی'], // مقالات 11-20
    ['روابط', 'عشق', 'ارتباطات'], // مقالات 21-30
    ['خانواده', 'تربیت', 'کودک'], // مقالات 31-40
    ['روانشناسی', 'سلامت روان', 'مشاوره'] // مقالات 41-50
  ]
  
  const setIndex = Math.floor((articleNumber - 1) / 10)
  return tagSets[setIndex] || tagSets[4]
}

function extractTags(title: string, content: string): string[] {
  const text = (title + ' ' + content).toLowerCase()
  const tags: string[] = []
  
  const tagKeywords = {
    'استرس': ['استرس', 'stress'],
    'اضطراب': ['اضطراب', 'anxiety'],
    'افسردگی': ['افسردگی', 'depression'],
    'عزت نفس': ['عزت نفس', 'self-esteem'],
    'روابط': ['روابط', 'relationships'],
    'خانواده': ['خانواده', 'family'],
    'کودک': ['کودک', 'child'],
    'نوجوان': ['نوجوان', 'teen'],
    'زوج': ['زوج', 'couple'],
    'مدیریت': ['مدیریت', 'management'],
    'درمان': ['درمان', 'therapy'],
    'مشاوره': ['مشاوره', 'counseling']
  }

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag)
    }
  }

  return tags.slice(0, 5) // حداکثر 5 تگ
}

async function createDefaultCategories() {
  const categories = {
    'mental-health': {
      name: 'سلامت روان',
      slug: 'mental-health',
      description: 'مقالات مربوط به سلامت روان و اختلالات روانی',
      color: '#ef4444',
      icon: '🧠'
    },
    'personal-growth': {
      name: 'رشد شخصی',
      slug: 'personal-growth',
      description: 'مقالات رشد شخصی و توسعه فردی',
      color: '#3b82f6',
      icon: '🌱'
    },
    'relationships': {
      name: 'روابط',
      slug: 'relationships',
      description: 'مقالات مربوط به روابط و ارتباطات',
      color: '#10b981',
      icon: '💕'
    },
    'family': {
      name: 'خانواده',
      slug: 'family',
      description: 'مقالات مربوط به خانواده و تربیت',
      color: '#f59e0b',
      icon: '👨‍👩‍👧‍👦'
    },
    'general': {
      name: 'عمومی',
      slug: 'general',
      description: 'مقالات عمومی روانشناسی',
      color: '#6b7280',
      icon: '📚'
    }
  }

  const createdCategories: Record<string, any> = {}

  for (const [key, categoryData] of Object.entries(categories)) {
    const category = await prisma.blogCategory.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData
    })
    createdCategories[key] = category
  }

  return createdCategories
}

async function createDefaultAuthor() {
  // ایجاد کاربر ادمین پیش‌فرض
  const author = await prisma.user.upsert({
    where: { email: 'admin@testology.ir' },
    update: {},
    create: {
      name: 'تیم تستولوژی',
      email: 'admin@testology.ir',
      role: 'admin',
      isAdmin: true
    }
  })

  return author
}

export async function generateArticleImages() {
  // تولید تصاویر OG برای مقالات
  const articles = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      category: {
        select: {
          color: true,
          name: true
        }
      }
    }
  })

  const imagePromises = articles.map(article => {
    // در آینده اینجا تصاویر OG تولید می‌شوند
    console.log(`Generating OG image for: ${article.title}`)
    return Promise.resolve()
  })

  await Promise.all(imagePromises)
}

export async function updateArticleSEO() {
  // به‌روزرسانی سئو برای تمام مقالات
  const articles = await prisma.blogPost.findMany({
    include: {
      category: true,
      author: true
    }
  })

  for (const article of articles) {
    // در آینده اینجا سئو به‌روزرسانی می‌شود
    console.log(`Updating SEO for: ${article.title}`)
  }
}

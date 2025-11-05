// اسکریپت seed برای وارد کردن مقالات بلاگ
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedBlog() {
  try {
    console.log('🌱 Starting blog seed...')

    // ایجاد دسته‌بندی‌های پیش‌فرض
    const categories = await createBlogCategories()
    console.log('✅ Blog categories created')

    // ایجاد نویسنده پیش‌فرض
    const author = await createDefaultAuthor()
    console.log('✅ Default author created')

    // ایجاد مقالات نمونه
    const articles = await createSampleArticles(categories, author)
    console.log(`✅ ${articles.length} sample articles created`)

    console.log('🎉 Blog seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding blog:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function createBlogCategories() {
  const categories = [
    {
      name: 'سلامت روان',
      slug: 'mental-health',
      description: 'مقالات مربوط به سلامت روان و اختلالات روانی',
      color: '#ef4444',
      icon: '🧠'
    },
    {
      name: 'رشد شخصی',
      slug: 'personal-growth',
      description: 'مقالات رشد شخصی و توسعه فردی',
      color: '#3b82f6',
      icon: '🌱'
    },
    {
      name: 'روابط',
      slug: 'relationships',
      description: 'مقالات مربوط به روابط و ارتباطات',
      color: '#10b981',
      icon: '💕'
    },
    {
      name: 'خانواده',
      slug: 'family',
      description: 'مقالات مربوط به خانواده و تربیت',
      color: '#f59e0b',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      name: 'عمومی',
      slug: 'general',
      description: 'مقالات عمومی روانشناسی',
      color: '#6b7280',
      icon: '📚'
    }
  ]

  const createdCategories = []
  
  for (const categoryData of categories) {
    const category = await prisma.blogCategory.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData
    })
    createdCategories.push(category)
  }

  return createdCategories
}

async function createDefaultAuthor() {
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

async function createSampleArticles(categories: any[], author: any) {
  // ایجاد 50 مقاله نمونه
  const sampleArticles = []
  
  for (let i = 1; i <= 50; i++) {
    const articleNumber = i.toString().padStart(2, '0')
    const categorySlug = i <= 10 ? 'mental-health' : 
                        i <= 20 ? 'personal-growth' :
                        i <= 30 ? 'relationships' :
                        i <= 40 ? 'family' : 'general'
    
    const tags = i <= 10 ? ['استرس', 'اضطراب', 'مدیریت استرس'] :
                i <= 20 ? ['عزت نفس', 'اعتماد به نفس', 'رشد شخصی'] :
                i <= 30 ? ['روابط', 'عشق', 'ارتباطات'] :
                i <= 40 ? ['خانواده', 'تربیت', 'کودک'] :
                ['روانشناسی', 'سلامت روان', 'مشاوره']
    
    sampleArticles.push({
      title: `مقاله شماره ${i}`,
      slug: `article-${articleNumber}`,
      excerpt: 'این مقاله ترجمه‌شده از PsychCentral است و محتوای آن به‌زودی تکمیل می‌شود.',
      content: `<h2>مقاله شماره ${i}</h2><p>این مقاله ترجمه‌شده از PsychCentral است و محتوای آن به‌زودی تکمیل می‌شود.</p>`,
      coverUrl: `/images/blog/article-${articleNumber}.jpg`,
      tags,
      categorySlug,
      published: true
    })
  }

  const createdArticles = []

  for (const articleData of sampleArticles) {
    const category = categories.find(cat => cat.slug === articleData.categorySlug)
    
    if (!category) {
      console.warn(`Category not found for slug: ${articleData.categorySlug}`)
      continue
    }

    const article = await prisma.blogPost.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        coverUrl: articleData.coverUrl,
        tags: articleData.tags,
        published: articleData.published,
        categoryId: category.id,
        authorId: author.id,
        publishedAt: articleData.published ? new Date() : null
      },
      create: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        coverUrl: articleData.coverUrl,
        tags: articleData.tags,
        published: articleData.published,
        publishedAt: articleData.published ? new Date() : null,
        categoryId: category.id,
        authorId: author.id
      }
    })

    createdArticles.push(article)
  }

  return createdArticles
}

// اجرای seed
if (require.main === module) {
  seedBlog()
    .then(() => {
      console.log('✅ Blog seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Blog seeding failed:', error)
      process.exit(1)
    })
}

export { seedBlog }
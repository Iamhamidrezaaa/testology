// سئو اختصاصی برای بلاگ
import { Metadata } from 'next'

export interface BlogPostSEO {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  canonical: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
}

export function generateBlogPostSEO(post: BlogPostSEO): Metadata {
  return {
    title: `${post.title} | بلاگ تستولوژی`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonical,
      siteName: 'تستولوژی',
      images: [
        {
          url: post.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'fa_IR',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      section: post.category
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.ogImage],
      creator: '@testology'
    },
    alternates: {
      canonical: post.canonical,
    },
    other: {
      'article:author': post.author,
      'article:published_time': post.publishedAt,
      'article:section': post.category,
      'article:tag': post.tags.join(', ')
    }
  }
}

export function generateBlogListSEO(): Metadata {
  return {
    title: 'بلاگ تستولوژی | مقالات روانشناسی و سلامت روان',
    description: 'مجموعه‌ای از مقالات تخصصی روانشناسی، سلامت روان و بهبود شخصیت. راهنمای جامع برای شناخت خود و رشد شخصی.',
    keywords: ['بلاگ روانشناسی', 'مقالات سلامت روان', 'روانشناسی', 'تستولوژی', 'رشد شخصی'],
    openGraph: {
      title: 'بلاگ تستولوژی | مقالات روانشناسی و سلامت روان',
      description: 'مجموعه‌ای از مقالات تخصصی روانشناسی، سلامت روان و بهبود شخصیت.',
      url: 'https://testology.ir/blog',
      siteName: 'تستولوژی',
      images: [
        {
          url: '/images/blog-og.jpg',
          width: 1200,
          height: 630,
          alt: 'بلاگ تستولوژی'
        }
      ],
      locale: 'fa_IR',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'بلاگ تستولوژی | مقالات روانشناسی و سلامت روان',
      description: 'مجموعه‌ای از مقالات تخصصی روانشناسی، سلامت روان و بهبود شخصیت.',
      images: ['/images/blog-og.jpg']
    },
    alternates: {
      canonical: 'https://testology.ir/blog'
    }
  }
}

export function generateBlogPostStructuredData(post: {
  title: string
  description: string
  url: string
  publishedAt: string
  author: {
    name: string
    image?: string
  }
  category: string
  tags: string[]
  coverUrl: string
  content: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "url": post.url,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "image": post.author.image
    },
    "publisher": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir",
      "logo": {
        "@type": "ImageObject",
        "url": "https://testology.ir/images/logo.png"
      }
    },
    "image": post.coverUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url
    },
    "keywords": post.tags,
    "articleSection": post.category,
    "inLanguage": "fa-IR",
    "wordCount": post.content.length,
    "isPartOf": {
      "@type": "Blog",
      "name": "بلاگ تستولوژی",
      "url": "https://testology.ir/blog"
    }
  }
}

export function generateBlogListStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "بلاگ تستولوژی",
    "description": "مجموعه‌ای از مقالات تخصصی روانشناسی، سلامت روان و بهبود شخصیت",
    "url": "https://testology.ir/blog",
    "publisher": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    },
    "inLanguage": "fa-IR"
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  }
}

export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

export function generateArticleStructuredData(article: {
  title: string
  description: string
  url: string
  publishedAt: string
  author: string
  image?: string
  content: string
  tags: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    },
    "image": article.image,
    "keywords": article.tags,
    "inLanguage": "fa-IR",
    "wordCount": article.content.length
  }
}

















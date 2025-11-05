// تولید structured data برای سئو
import { TestMetadata } from './test-metadata'
import { CategoryData } from './categories'
import { CityData } from './cities'

export function generateTestStructuredData(testData: TestMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "PsychologicalTest",
    "name": testData.title,
    "description": testData.description,
    "url": testData.canonical,
    "provider": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    },
    "category": testData.category,
    "keywords": testData.keywords,
    "inLanguage": "fa-IR",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IRR"
    }
  }
}

export function generateCategoryStructuredData(categoryData: CategoryData) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryData.name,
    "description": categoryData.description,
    "url": categoryData.canonical,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categoryData.tests.map((testSlug, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "PsychologicalTest",
          "name": `تست ${testSlug}`,
          "url": `/tests/${testSlug}`
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    },
    "inLanguage": "fa-IR"
  }
}

export function generateCityStructuredData(cityData: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    "name": cityData.name,
    "description": cityData.description,
    "url": cityData.canonical,
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": cityData.province
    },
    "population": cityData.population,
    "geo": cityData.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": cityData.coordinates.lat,
      "longitude": cityData.coordinates.lng
    } : undefined,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": cityData.relatedTests.map((testSlug, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "PsychologicalTest",
          "name": `تست ${testSlug}`,
          "url": `/tests/${testSlug}`
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    },
    "inLanguage": "fa-IR"
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "تستولوژی",
    "description": "پلتفرم ارزیابی و بهبود مهارت‌ها",
    "url": "https://testology.ir",
    "inLanguage": "fa-IR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://testology.ir/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "تستولوژی",
      "url": "https://testology.ir"
    }
  }
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "تستولوژی",
    "description": "پلتفرم ارزیابی و بهبود مهارت‌ها",
    "url": "https://testology.ir",
    "logo": "https://testology.ir/images/logo.png",
    "sameAs": [
      "https://instagram.com/testology",
      "https://twitter.com/testology",
      "https://linkedin.com/company/testology"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+98-21-12345678",
      "contactType": "customer service",
      "availableLanguage": "Persian"
    }
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
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt: Date;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.publishedAt.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
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
    "inLanguage": "fa-IR"
  }
}

export function generateLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "تستولوژی",
    "description": "پلتفرم ارزیابی و بهبود مهارت‌ها",
    "url": "https://testology.ir",
    "telephone": "+98-21-12345678",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressLocality": "تهران",
      "addressRegion": "تهران"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.6892,
      "longitude": 51.3890
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "Free"
  }
}

export function generateSoftwareApplicationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "تستولوژی",
    "description": "پلتفرم ارزیابی و بهبود مهارت‌ها",
    "url": "https://testology.ir",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IRR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    }
  }
}

















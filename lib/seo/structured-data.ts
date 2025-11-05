/**
 * Structured Data برای SEO چندزبانه
 * تولید JSON-LD برای موتورهای جست‌وجو
 */

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const base = "https://testology.me";

interface StructuredDataProps {
  title: string;
  description: string;
  slug: string;
  currentLang?: string;
  type?: "WebPage" | "Article" | "Test" | "Organization";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * تولید JSON-LD برای صفحه وب
 */
export function generateWebPageSchema({
  title,
  description,
  slug,
  currentLang = "en",
  image,
  breadcrumbs = []
}: StructuredDataProps) {
  const currentUrl = `${base}/${currentLang}${slug}`;
  const ogImage = image || `${base}/og-image/${slug}.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": currentUrl,
    "image": ogImage,
    "inLanguage": languages.map((lang) => ({
      "@type": "Language",
      "name": lang.name,
      "alternateName": `${base}/${lang.code}${slug}`,
    })),
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "Testology",
      "url": base,
      "logo": {
        "@type": "ImageObject",
        "url": `${base}/logo.png`,
        "width": 200,
        "height": 200
      },
      "sameAs": [
        "https://twitter.com/testology",
        "https://linkedin.com/company/testology",
        "https://instagram.com/testology"
      ]
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Testology",
      "description": "AI-powered psychology platform for mental health assessment",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };
}

/**
 * تولید JSON-LD برای مقاله
 */
export function generateArticleSchema({
  title,
  description,
  slug,
  currentLang = "en",
  image,
  publishedTime,
  modifiedTime,
  author = "Testology",
  keywords = []
}: StructuredDataProps) {
  const currentUrl = `${base}/${currentLang}/blog/${slug}`;
  const ogImage = image || `${base}/og-image/blog/${slug}.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": currentUrl,
    "image": ogImage,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author,
      "url": `${base}/${currentLang}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Testology",
      "url": base,
      "logo": {
        "@type": "ImageObject",
        "url": `${base}/logo.png`
      }
    },
    "inLanguage": languages.map((lang) => ({
      "@type": "Language",
      "name": lang.name,
      "alternateName": `${base}/${lang.code}/blog/${slug}`,
    })),
    "keywords": keywords.join(", "),
    "articleSection": "Psychology",
    "wordCount": description.length,
    "isAccessibleForFree": true
  };
}

/**
 * تولید JSON-LD برای تست روان‌شناسی
 */
export function generateTestSchema({
  title,
  description,
  slug,
  currentLang = "en",
  image,
  keywords = []
}: StructuredDataProps) {
  const currentUrl = `${base}/${currentLang}/tests/${slug}`;
  const ogImage = image || `${base}/og-image/tests/${slug}.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Test",
    "name": title,
    "description": description,
    "url": currentUrl,
    "image": ogImage,
    "inLanguage": languages.map((lang) => ({
      "@type": "Language",
      "name": lang.name,
      "alternateName": `${base}/${lang.code}/tests/${slug}`,
    })),
    "keywords": keywords.join(", "),
    "category": "Psychology Test",
    "provider": {
      "@type": "Organization",
      "name": "Testology",
      "url": base
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "educationalLevel": "Beginner",
    "learningResourceType": "Assessment"
  };
}

/**
 * تولید JSON-LD برای سازمان
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Testology",
    "description": "AI-powered psychology platform for mental health assessment and improvement",
    "url": base,
    "logo": {
      "@type": "ImageObject",
      "url": `${base}/logo.png`,
      "width": 200,
      "height": 200
    },
    "sameAs": [
      "https://twitter.com/testology",
      "https://linkedin.com/company/testology",
      "https://instagram.com/testology",
      "https://facebook.com/testology"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-TESTOLOGY",
      "contactType": "customer service",
      "availableLanguage": languages.map(lang => lang.name)
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "San Francisco",
      "addressRegion": "CA"
    },
    "foundingDate": "2024",
    "numberOfEmployees": "10-50",
    "industry": "Health Technology"
  };
}

/**
 * تولید JSON-LD برای FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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
  };
}

/**
 * تولید JSON-LD برای Breadcrumb
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * تولید JSON-LD برای Local Business (در صورت نیاز)
 */
export function generateLocalBusinessSchema({
  name = "Testology",
  description = "AI-powered psychology platform",
  address = "San Francisco, CA",
  phone = "+1-555-TESTOLOGY",
  email = "info@testology.me"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": base,
    "telephone": phone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": address
    },
    "openingHours": "Mo-Fr 09:00-17:00",
    "priceRange": "Free"
  };
}
import Head from "next/head";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

interface SEOHeadProps {
  title: string;
  description: string;
  slug: string;
  currentLang?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  slug,
  currentLang = "en",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  canonical
}: SEOHeadProps) {
  const base = "https://testology.me";
  const currentUrl = canonical || `${base}/${currentLang}${slug}`;
  const ogImage = image || `${base}/og-image/${slug}.jpg`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author || "Testology"} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang Tags - برای SEO چندزبانه */}
      {languages.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`${base}/${lang.code}${slug}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${base}/en${slug}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Testology" />
      <meta property="og:locale" content={currentLang} />
      
      {/* Open Graph Hreflang */}
      {languages.map((lang) => (
        <meta
          key={`og-${lang.code}`}
          property="og:locale:alternate"
          content={lang.code}
        />
      ))}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@testology" />
      <meta name="twitter:creator" content="@testology" />
      
      {/* Article specific tags */}
      {type === "article" && (
        <>
          <meta property="article:author" content={author || "Testology"} />
          <meta property="article:section" content="Psychology" />
          <meta property="article:tag" content={keywords.join(", ")} />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
        </>
      )}
      
      {/* Language specific meta tags */}
      {currentLang === "fa" && (
        <>
          <meta name="language" content="Persian" />
          <meta name="geo.region" content="IR" />
          <meta name="geo.country" content="Iran" />
        </>
      )}
      
      {currentLang === "ar" && (
        <>
          <meta name="language" content="Arabic" />
          <meta name="geo.region" content="SA" />
          <meta name="geo.country" content="Saudi Arabia" />
        </>
      )}
      
      {currentLang === "fr" && (
        <>
          <meta name="language" content="French" />
          <meta name="geo.region" content="FR" />
          <meta name="geo.country" content="France" />
        </>
      )}
      
      {currentLang === "ru" && (
        <>
          <meta name="language" content="Russian" />
          <meta name="geo.region" content="RU" />
          <meta name="geo.country" content="Russia" />
        </>
      )}
      
      {currentLang === "tr" && (
        <>
          <meta name="language" content="Turkish" />
          <meta name="geo.region" content="TR" />
          <meta name="geo.country" content="Turkey" />
        </>
      )}
      
      {currentLang === "es" && (
        <>
          <meta name="language" content="Spanish" />
          <meta name="geo.region" content="ES" />
          <meta name="geo.country" content="Spain" />
        </>
      )}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "article" ? "Article" : "WebPage",
            "name": title,
            "description": description,
            "url": currentUrl,
            "inLanguage": languages.map((lang) => ({
              "@type": "Language",
              "name": lang.name,
              "alternateName": `${base}/${lang.code}${slug}`,
            })),
            "author": {
              "@type": "Organization",
              "name": "Testology",
              "url": base
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
            ...(type === "article" && {
              "datePublished": publishedTime,
              "dateModified": modifiedTime,
              "headline": title,
              "image": ogImage
            })
          })
        }}
      />
    </Head>
  );
}

// Hook برای استفاده در کامپوننت‌ها
export function useSEOHead(props: SEOHeadProps) {
  return <SEOHead {...props} />;
}
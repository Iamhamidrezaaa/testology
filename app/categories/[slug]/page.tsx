import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateCategorySEO } from '@/lib/seo/seo-meta';
import { getCategoryData, getAllCategorySlugs } from '@/lib/seo/categories';
import { getTestMetadata } from '@/lib/seo/test-metadata';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube, BookOpen, Users } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// تولید متادیتا برای سئو
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return generateCategorySEO(params.slug);
}

// تولید مسیرهای استاتیک
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = getCategoryData(params.slug);
  
  if (!categoryData) {
    notFound();
  }

  // دریافت اطلاعات تست‌های این دسته‌بندی
  const relatedTests = categoryData.tests.map(testSlug => getTestMetadata(testSlug)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": categoryData.name,
            "description": categoryData.description,
            "url": categoryData.canonical,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": relatedTests.map((test, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "PsychologicalTest",
                  "name": test?.title,
                  "url": test?.canonical
                }
              }))
            }
          }),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">خانه</Link>
          <span>/</span>
          <span className="text-gray-900">دسته‌بندی‌ها</span>
          <span>/</span>
          <span className="text-gray-900">{categoryData.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryData.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {categoryData.description}
          </p>
        </div>

        {/* Tests Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TestTube className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">تست‌های {categoryData.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTests.map((test) => (
              <Card key={test?.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{test?.title}</CardTitle>
                  <CardDescription>{test?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {test?.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Link href={test?.canonical || '#'}>
                    <Button className="w-full">
                      شروع تست
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">مقالات مرتبط</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.articles.map((article) => (
              <Card key={article} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">مقاله {article}</CardTitle>
                  <CardDescription>
                    محتوای مفصل درباره {categoryData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/blog/${article}`}>
                    <Button variant="outline" className="w-full">
                      مطالعه مقاله
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            آماده شروع سفر خودشناسی هستید؟
          </h3>
          <p className="text-gray-600 mb-6">
            با تست‌های حرفه‌ای ما، خود را بهتر بشناسید و مسیر رشد شخصی خود را پیدا کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tests">
              <Button size="lg" className="w-full sm:w-auto">
                مشاهده همه تست‌ها
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                ورود به داشبورد
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

















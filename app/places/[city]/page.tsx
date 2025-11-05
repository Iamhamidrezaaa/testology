import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateCitySEO } from '@/lib/seo/seo-meta';
import { getCityData, getAllCitySlugs } from '@/lib/seo/cities';
import { getTestMetadata } from '@/lib/seo/test-metadata';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TestTube, BookOpen, Users, TrendingUp } from 'lucide-react';

interface CityPageProps {
  params: {
    city: string;
  };
}

// تولید متادیتا برای سئو
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  return generateCitySEO(params.city);
}

// تولید مسیرهای استاتیک
export async function generateStaticParams() {
  const slugs = getAllCitySlugs();
  return slugs.map((city) => ({
    city: city,
  }));
}

export default async function CityPage({ params }: CityPageProps) {
  const cityData = getCityData(params.city);
  
  if (!cityData) {
    notFound();
  }

  // دریافت اطلاعات تست‌های مرتبط
  const relatedTests = cityData.relatedTests.map(testSlug => getTestMetadata(testSlug)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          <span className="text-gray-900">شهرها</span>
          <span>/</span>
          <span className="text-gray-900">{cityData.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">
              تست‌های روانشناسی در {cityData.name}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            {cityData.description}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>استان: {cityData.province}</span>
            {cityData.population && (
              <span>جمعیت: {cityData.population.toLocaleString('fa-IR')} نفر</span>
            )}
          </div>
        </div>

        {/* City Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">تست‌های موجود</h3>
              <p className="text-2xl font-bold text-blue-600">{relatedTests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">کاربران فعال</h3>
              <p className="text-2xl font-bold text-purple-600">+1000</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <TestTube className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">تست‌های تکمیل شده</h3>
              <p className="text-2xl font-bold text-orange-600">+5000</p>
            </CardContent>
          </Card>
        </div>

        {/* Tests Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TestTube className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              تست‌های روانشناسی در {cityData.name}
            </h2>
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

        {/* Local Articles Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              مقالات مرتبط با {cityData.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityData.relatedArticles.map((article) => (
              <Card key={article} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">مقاله {article}</CardTitle>
                  <CardDescription>
                    محتوای مفصل درباره روانشناسی در {cityData.name}
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

        {/* Local Community Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              جامعه روانشناسی {cityData.name}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              به جامعه بزرگ کاربران {cityData.name} بپیوندید و تجربیات خود را با دیگران به اشتراک بگذارید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button size="lg" className="w-full sm:w-auto">
                  پیوستن به جامعه
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  شروع تست‌ها
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Future Travel Section */}
        <section className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            سفرهای هوشمند آینده
          </h3>
          <p className="text-gray-600 mb-6">
            به زودی امکان برنامه‌ریزی سفرهای هوشمند بر اساس نتایج تست‌های شما در {cityData.name} فراهم خواهد شد.
          </p>
          <Badge variant="outline" className="text-sm">
            به زودی
          </Badge>
        </section>
      </div>
    </div>
  );
}

















import { Metadata } from 'next';
import { Suspense } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { SearchBar } from '@/components/home/SearchBar';
import { FeaturedTests } from '@/components/home/FeaturedTests';
import { TherapistShowcase } from '@/components/home/TherapistShowcase';
import { LiveSessionsPreview } from '@/components/home/LiveSessionsPreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import NoSSR from '@/components/NoSSR';

// متادیتای SEO
export const metadata: Metadata = {
  title: 'Testology - پلتفرم هوشمند روان‌شناسی | تست، مشاوره و درمان آنلاین',
  description: 'بهترین پلتفرم روان‌شناسی با 50+ تست علمی، تحلیل هوش مصنوعی، مشاوره آنلاین، گروه درمانی و ترک عادت. شروع رایگان!',
  keywords: 'تست روان‌شناسی، مشاوره آنلاین، افسردگی، اضطراب، استرس، درمانگر، روانشناس، تحلیل هوش مصنوعی',
  authors: [{ name: 'Testology Team' }],
  openGraph: {
    title: 'Testology - پلتفرم هوشمند روان‌شناسی',
    description: 'تست‌های روان‌شناسی علمی + تحلیل AI + مشاوره آنلاین',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Testology'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testology - پلتفرم هوشمند روان‌شناسی',
    description: 'تست‌های روان‌شناسی علمی + تحلیل AI + مشاوره آنلاین'
  }
};

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Search Bar */}
        <div className="container mx-auto px-4 -mt-16 relative z-20">
          <SearchBar />
        </div>

        {/* Featured Tests */}
        <FeaturedTests />

        {/* Therapist Showcase */}
        <NoSSR fallback={<div className="py-16 bg-white dark:bg-gray-800"><div className="container mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div><div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div></div></div>}>
          <TherapistShowcase />
        </NoSSR>

        {/* Live Sessions Preview */}
        <NoSSR fallback={<div className="py-16 bg-gray-50 dark:bg-gray-900"><div className="container mx-auto px-4 text-center"><div className="animate-pulse h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div></div></div>}>
          <LiveSessionsPreview />
        </NoSSR>

        {/* فیچرها */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                چرا Testology؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  تحلیل هوش مصنوعی
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  تحلیل دقیق و شخصی‌سازی شده با GPT
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  گیمیفیکیشن
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  انگیزه‌دهی با XP، سطح و دستاوردها
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-5xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  درمانگران حرفه‌ای
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  مشاوره آنلاین با متخصصان مجرب
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}
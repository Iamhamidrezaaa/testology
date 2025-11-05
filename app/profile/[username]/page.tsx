import { getUserProfileByUsername } from '@/lib/services/user';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProfileChart, TestCard } from '@/components/profile';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} - Testology Profile`,
    description: `Profile page for ${params.username} including test results and psychological insights.`,
  };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getUserProfileByUsername(params.username);
  if (!profile) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">پروفایل روان‌شناسی: {profile.fullName || params.username}</h1>
      <p className="mb-2">وضعیت کلی: {profile.mood}</p>
      <p className="mb-6 text-gray-600 italic">{profile.summary}</p>
      <ProfileChart data={profile.chartData} />
      <h2 className="mt-10 text-xl font-semibold">📊 تست‌های انجام شده:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {profile.completedTests.map(test => <TestCard key={test.slug} test={test} />)}
      </div>
    </div>
  );
}

















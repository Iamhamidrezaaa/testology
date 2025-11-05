import { PatientReport } from '@/components/therapist/PatientReport';
import { SendExercise } from '@/components/therapist/SendExercise';

export const metadata = {
  title: 'گزارش بیمار - Testology',
  description: 'گزارش جامع و تحلیل بیمار',
};

export default function TherapistReportPage({ params }: { params: { userId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <span>👨‍⚕️</span>
            گزارش جامع بیمار
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تحلیل کامل و ارسال تمرین شخصی‌سازی شده
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* گزارش */}
          <div className="lg:col-span-2">
            <PatientReport patientId={params.userId} />
          </div>

          {/* ارسال تمرین */}
          <div>
            <div className="sticky top-4">
              <SendExercise patientId={params.userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

















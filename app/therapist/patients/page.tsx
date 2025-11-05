import { PatientsList } from '@/components/therapist/PatientsList';

export const metadata = {
  title: 'بیماران من - Testology',
  description: 'مدیریت و پیگیری بیماران',
};

export default function TherapistPatientsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <PatientsList />
      </div>
    </div>
  );
}

















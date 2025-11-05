'use client';

import { useEffect, useState } from 'react';
import { MentalAlert } from '@/types/mental-alert';
import { User } from '@/types/user';
import AlertForm from '@/components/admin/MentalAlertForm';
import AlertTable from '@/components/admin/MentalAlertTable';

export default function MentalAlertsPage() {
  const [alerts, setAlerts] = useState<MentalAlert[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch('/api/admin/mental-alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, [refresh]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">مدیریت هشدارهای روانی</h1>
      <AlertForm onSuccess={() => setRefresh(!refresh)} />
      <AlertTable data={alerts} onUpdated={() => setRefresh(!refresh)} />
    </div>
  );
} 
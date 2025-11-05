'use client';

import { useEffect, useState } from 'react';
import { MentalAlert } from '@/types/mental-alert';

export default function MyAlertsPage() {
  const [alerts, setAlerts] = useState<MentalAlert[]>([]);

  useEffect(() => {
    fetch('/api/user/mental-alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, []);

  const handleAction = async (alertId: string, action: string) => {
    await fetch(`/api/user/mental-alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">هشدارهای روانی من</h1>
      {alerts.length === 0 ? (
        <p className="text-gray-600">تا این لحظه هیچ هشداری برای شما ثبت نشده است.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map(alert => (
            <li key={alert.id} className={`p-4 rounded border ${alert.level === 'high' ? 'border-red-400 bg-red-50' : alert.level === 'medium' ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50'}`}>
              <h2 className="font-semibold text-lg">{alert.title}</h2>
              <p>{alert.message}</p>
              <span className="text-sm text-gray-500">وضعیت: {alert.status === 'resolved' ? 'رسیدگی‌شده' : 'در انتظار'}</span>
              
              {alert.status !== 'resolved' && (
                <div className="mt-3 space-x-2">
                  <button
                    className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => handleAction(alert.id, 'exercise')}
                  >
                    انجام تمرین پیشنهادی
                  </button>

                  <button
                    className="px-4 py-2 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    onClick={() => handleAction(alert.id, 'therapy')}
                  >
                    مراجعه به روان‌درمانگر
                  </button>

                  <button
                    className="px-4 py-2 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                    onClick={() => handleAction(alert.id, 'resolved')}
                  >
                    رسیدگی شد ✅
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
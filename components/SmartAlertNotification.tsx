'use client';

import { useEffect, useState } from 'react';

export function SmartAlertNotification() {
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/mental-alerts')
      .then(async (res) => {
        if (!res.ok) {
          console.error("API failed with status:", res.status);
          return null;
        }

        const text = await res.text();
        if (!text) return null;

        try {
          return JSON.parse(text);
        } catch (err) {
          console.error("Invalid JSON response");
          return null;
        }
      })
      .then(data => {
        if (!data) return;
        const pending = data.find((a: any) => a.status === 'pending');
        if (pending) setAlert(pending);
      })
      .catch(err => {
        console.error("Error fetching mental alerts:", err);
      });
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-red-500 text-white rounded shadow-lg z-50 animate-bounce">
      ⚠️ هشدار روانی جدید: {alert.title}
    </div>
  );
} 
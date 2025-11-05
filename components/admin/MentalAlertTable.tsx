'use client';

import { useState } from 'react';
import { MentalAlert } from '@/types/mental-alert';
import { User } from '@/types/user';

export default function AlertTable({ data, onUpdated }: { data: MentalAlert[], onUpdated: () => void }) {
  const updateStatus = async (id: string, status: 'pending' | 'resolved') => {
    await fetch(`/api/admin/mental-alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    onUpdated();
  };

  return (
    <table className="table w-full border">
      <thead>
        <tr>
          <th>کاربر</th>
          <th>عنوان</th>
          <th>سطح</th>
          <th>منبع</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {data.map(alert => (
          <tr key={alert.id} className={alert.level === 'high' ? 'bg-red-100' : alert.level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}>
            <td>{alert.user?.name || alert.user?.id}</td>
            <td>{alert.title}</td>
            <td>{alert.level}</td>
            <td>{alert.source}</td>
            <td>{alert.status}</td>
            <td>
              {alert.status === 'pending' && (
                <button className="btn btn-success" onClick={() => updateStatus(alert.id, 'resolved')}>علامت‌گذاری به عنوان رسیدگی‌شده</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 
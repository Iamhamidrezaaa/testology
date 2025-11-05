'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>⛔ دسترسی غیرمجاز</h1>
      <p>شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>
    </div>
  );
} 
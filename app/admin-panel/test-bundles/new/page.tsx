'use client'

import TestBundleForm from '@/components/admin/modules/TestBundleForm'

export default function NewTestBundlePage() {
  return (
    <div className="container mx-auto py-6">
      <TestBundleForm mode="create" />
    </div>
  )
} 
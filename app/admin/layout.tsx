import React from 'react'
import Sidebar from './_components/Sidebar'
import Topbar from './_components/Topbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}


















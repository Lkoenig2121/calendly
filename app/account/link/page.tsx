'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function LinkPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <Link href="/scheduling" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Link</h1>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">Manage your personal scheduling link</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


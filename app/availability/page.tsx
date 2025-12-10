'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function AvailabilityPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Availability" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Availability</h1>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">Manage your availability settings here</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


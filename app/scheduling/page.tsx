'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import CreateEventModal from '@/components/CreateEventModal'

interface EventType {
  id: string
  title: string
  duration: number
  type: string
  platform: string
  availability: string
  color: string
}

export default function SchedulingPage() {
  const [activeTab, setActiveTab] = useState<'event-types' | 'single-use' | 'meeting-polls'>('event-types')
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchEventTypes = () => {
    fetch('http://localhost:3001/api/event-types', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setEventTypes(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchEventTypes()
  }, [])

  const handleCreateEvent = (newEvent: EventType) => {
    setEventTypes([...eventTypes, newEvent])
  }

  const filteredEvents = eventTypes.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onCreateClick={() => setIsCreateModalOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCreateClick={() => setIsCreateModalOpen(true)} />
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateEvent}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('event-types')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'event-types'
                      ? 'border-calendly-blue text-calendly-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Event types
                </button>
                <button
                  onClick={() => setActiveTab('single-use')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'single-use'
                      ? 'border-calendly-blue text-calendly-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Single-use links
                </button>
                <button
                  onClick={() => setActiveTab('meeting-polls')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'meeting-polls'
                      ? 'border-calendly-blue text-calendly-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Meeting polls
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'event-types' && (
              <div>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search event types"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue sm:text-sm"
                    />
                  </div>
                </div>

                {/* User Section */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-calendly-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">LK</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Lukas Koenig</h3>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mb-4">
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                    >
                      <span>View landing page</span>
                      <span>↗</span>
                    </a>
                    <button className="text-gray-400 hover:text-gray-600">
                      <span>⋯</span>
                    </button>
                  </div>
                </div>

                {/* Event Cards */}
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const colorMap: Record<string, string> = {
                      purple: 'bg-purple-500',
                      blue: 'bg-blue-500',
                      green: 'bg-green-500',
                      red: 'bg-red-500',
                      orange: 'bg-orange-500',
                    }
                    const colorClass = colorMap[event.color] || 'bg-purple-500'
                    
                    return (
                    <div
                      key={event.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass}`}></div>
                      <div className="flex items-start p-4 pl-6">
                        <div className="flex-1 flex items-start space-x-4 ml-4">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-calendly-blue focus:ring-calendly-blue border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-1">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {event.duration} min • {event.platform} • {event.type}
                            </p>
                            <p className="text-sm text-gray-500">{event.availability}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-1">
                              <span>📎</span>
                              <span>Copy link</span>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <span>⋯</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )
                  })}

                  {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No event types found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'single-use' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Single-use links will appear here</p>
              </div>
            )}

            {activeTab === 'meeting-polls' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Meeting polls will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}


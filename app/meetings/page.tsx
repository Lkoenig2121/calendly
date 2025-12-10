'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

interface Meeting {
  id: string
  eventTypeId: string
  eventTypeTitle: string
  attendeeName: string
  attendeeEmail: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  status: string
  meetingLink: string
  createdAt: string
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = () => {
    fetch('http://localhost:3001/api/meetings', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          console.error('Failed to fetch meetings:', res.status, res.statusText)
          // Return empty array if 401 or 404
          if (res.status === 401 || res.status === 404) {
            return []
          }
          throw new Error('Failed to fetch meetings')
        }
        return res.json()
      })
      .then((data) => {
        console.log('Meetings data:', data)
        setMeetings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching meetings:', err)
        setMeetings([])
        setLoading(false)
      })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      scheduled: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Meetings" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <div className="text-sm text-gray-600">
                {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} scheduled
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Loading meetings...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-2">Your scheduled meetings will appear here</p>
                <p className="text-xs text-gray-400">
                  Meetings are generated from your event types. Make sure you have event types created in Scheduling.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {meeting.eventTypeTitle}
                          </h3>
                          {getStatusBadge(meeting.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Attendee:</span>
                            <span>{meeting.attendeeName}</span>
                            <span className="text-gray-400">•</span>
                            <span>{meeting.attendeeEmail}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(meeting.date)}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Time:</span>
                            <span>
                              {meeting.startTime} - {meeting.endTime} ({meeting.timezone})
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Platform:</span>
                            <span>{meeting.platform || 'Google Meet'}</span>
                            <span className="text-gray-400">•</span>
                            <a
                              href={meeting.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-calendly-blue hover:underline"
                            >
                              Join meeting
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded-md hover:bg-red-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}


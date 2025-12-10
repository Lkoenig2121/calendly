'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  initials: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    welcomeMessage: 'Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h (am/pm)',
    country: 'United States',
    timeZone: 'Eastern Time - US & Canada',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setFormData((prev) => ({ ...prev, name: data.user.name }))
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate save
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/scheduling" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex">
              {/* Sidebar Navigation */}
              <aside className="w-64 pr-8">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-calendly-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">Calendly</span>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-gray-900 mb-4">Account settings</h2>
                <nav className="space-y-1">
                  {[
                    { name: 'Profile', href: '/account/profile', icon: '👤', active: true },
                    { name: 'Branding', href: '/account/branding', icon: '⭐' },
                    { name: 'My Link', href: '/account/link', icon: '🔗' },
                    { name: 'Communication settings', href: '/account/communication', icon: '🌐' },
                    { name: 'Login preferences', href: '/account/login', icon: '📋' },
                    { name: 'Security', href: '/account/security', icon: '🔒' },
                    { name: 'Cookie settings', href: '/account/cookies', icon: '⚙️' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                        item.active
                          ? 'bg-calendly-blue-light text-calendly-blue font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Link href="/help" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <span>?</span>
                    <span>Help</span>
                  </Link>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2">
                    <span>→</span>
                    <span>Logout</span>
                  </button>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Account details</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">👤</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Upload picture
                        </button>
                        <p className="mt-1 text-xs text-gray-500">
                          JPG, GIF or PNG. Max size of 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-gray-400">ℹ️</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    />
                  </div>

                  {/* Welcome Message */}
                  <div>
                    <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Message <span className="text-gray-400">ℹ️</span>
                    </label>
                    <textarea
                      id="welcomeMessage"
                      name="welcomeMessage"
                      rows={4}
                      value={formData.welcomeMessage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format <span className="text-gray-400">ℹ️</span>
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={formData.dateFormat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Time Format */}
                  <div>
                    <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-2">
                      Time Format <span className="text-gray-400">ℹ️</span>
                    </label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      value={formData.timeFormat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    >
                      <option>12h (am/pm)</option>
                      <option>24h</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone <span className="text-gray-400 text-xs">Current Time: 10:03am</span>
                    </label>
                    <select
                      id="timeZone"
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
                    >
                      <option>Eastern Time - US & Canada</option>
                      <option>Central Time - US & Canada</option>
                      <option>Pacific Time - US & Canada</option>
                      <option>Mountain Time - US & Canada</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-calendly-blue text-white rounded-md font-medium hover:bg-calendly-blue-dark"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      type="button"
                      className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                  </div>

                  {saved && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="text-sm text-green-800">Changes saved successfully!</div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  onCreateClick?: () => void
}

export default function Header({ title = 'Scheduling', onCreateClick }: HeaderProps) {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; initials: string } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        router.push('/signin')
      })
  }, [router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleSignOut = async () => {
    await fetch('http://localhost:3001/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/signin')
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900" id="page-title">{title}</h1>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="text-sm">ℹ️</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
          >
            <div className="w-8 h-8 bg-calendly-blue rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.initials || 'U'}
              </span>
            </div>
            <span className="text-gray-600">▼</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <Link
                href="/account/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const mainNavItems: NavItem[] = [
  { name: 'Scheduling', href: '/scheduling', icon: '📎' },
  { name: 'Meetings', href: '/meetings', icon: '📅' },
  { name: 'Availability', href: '/availability', icon: '🕐' },
  { name: 'Contacts', href: '/contacts', icon: '👥' },
  { name: 'Workflows', href: '/workflows', icon: '🔗' },
  { name: 'Integrations & apps', href: '/integrations', icon: '⊞' },
  { name: 'Routing', href: '/routing', icon: '↪️' },
]

const bottomNavItems: NavItem[] = [
  { name: 'Upgrade plan', href: '/upgrade', icon: '$' },
  { name: 'Analytics', href: '/analytics', icon: '📊' },
  { name: 'Admin center', href: '/admin', icon: '👑' },
  { name: 'Help', href: '/help', icon: '?' },
]

interface SidebarProps {
  onCreateClick?: () => void
}

export default function Sidebar({ onCreateClick }: SidebarProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogoClick = () => {
    router.push('/scheduling')
  }

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-calendly-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          {!collapsed && <span className="text-xl font-semibold text-gray-900">Calendly</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-gray-600">⇄</span>
        </button>
      </div>

      {/* Create Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateClick}
          className="w-full bg-calendly-blue text-white py-2 px-4 rounded-md font-medium hover:bg-calendly-blue-dark flex items-center justify-center space-x-2"
        >
          <span>+</span>
          {!collapsed && <span>Create</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-calendly-blue-light text-calendly-blue font-medium' : 'text-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Bottom Navigation */}
      <nav className="py-4">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          const isUpgrade = item.name === 'Upgrade plan'
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 mx-2 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-calendly-blue-light text-calendly-blue font-medium' : 'text-gray-700'
              } ${isUpgrade ? 'bg-calendly-blue-light' : ''}`}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}


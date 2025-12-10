'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in, if not redirect to signin
    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          router.push('/scheduling')
        } else {
          router.push('/signin')
        }
      })
      .catch(() => {
        router.push('/signin')
      })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calendly-blue"></div>
    </div>
  )
}


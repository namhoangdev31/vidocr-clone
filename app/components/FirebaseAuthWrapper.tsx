'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface FirebaseAuthWrapperProps {
  children: React.ReactNode
}

export default function FirebaseAuthWrapper({ children }: FirebaseAuthWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const { checkSession } = useAuthStore()

  useEffect(() => {
    setIsClient(true)
    checkSession()
  }, [checkSession])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    )
  }

  return <>{children}</>
}

'use client'

import { useEffect, useState } from 'react'
import { tokenManager } from '@/app/lib/api'

interface AuthStatusProps {
  onAuthRequired?: () => void
}

export default function AuthStatus({ onAuthRequired }: AuthStatusProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getAccessToken()
      const refreshToken = tokenManager.getRefreshToken()
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        onAuthRequired?.()
        return
      }

      // Check if token is expired
      const isExpired = tokenManager.isTokenExpired()
      if (isExpired && !refreshToken) {
        setIsAuthenticated(false)
        setIsLoading(false)
        onAuthRequired?.()
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [onAuthRequired])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-yellow-600/20 text-yellow-300">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
        Checking authentication...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-600/20 text-red-300">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        Not authenticated
        <button
          onClick={() => window.location.href = '/login'}
          className="text-red-200 hover:text-red-100 underline"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-600/20 text-green-300">
      <div className="w-2 h-2 rounded-full bg-green-400"></div>
      Authenticated
    </div>
  )
}

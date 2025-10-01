"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'

type ClientAuthGuardProps = {
  children: React.ReactNode
}

export default function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const { accessToken, loading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const isPublicRoute = useMemo(() => {
    if (!pathname) return false
    return pathname.startsWith('/login') || pathname.startsWith('/api/auth') || pathname.startsWith('/') || pathname.startsWith('/dich-vu') || pathname.startsWith('/gia-ca') || pathname.startsWith('/thu-vien') || pathname.startsWith('/lien-he') || pathname.startsWith('/huong-dan') || pathname.startsWith('/landing')
  }, [pathname])

  useEffect(() => {
    if (loading) return // Đang loading session

    if (!accessToken && !isPublicRoute) {
      router.replace('/login')
    }
  }, [accessToken, loading, isPublicRoute, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    )
  }

  if (!accessToken && !isPublicRoute) {
    return null // Sẽ redirect về /login
  }

  return <>{children}</>
}

'use client'

import { useParams, useRouter } from 'next/navigation'
import ProgressDetailPage from '@/app/components/ProgressDetailPage'

export default function ProgressDetailRoute() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  return (
    <ProgressDetailPage jobId={id || 'unknown'} onBack={() => router.push('/?tab=progress')} />
  )
}



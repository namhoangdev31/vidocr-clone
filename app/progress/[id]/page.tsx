'use client'

import { useParams } from 'next/navigation'
import VideoEditorPage from '@/app/components/VideoEditorPage'

export default function ProgressDetailRoute() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  return (
    <VideoEditorPage jobId={id} />
  )
}



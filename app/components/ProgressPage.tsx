'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJobManagement } from '@/app/hooks/useJobManagement'
import { useWebSocket } from '@/app/hooks/useWebSocket'
import { JobResponse } from '@/app/lib/api/videoTranslationService'
import { STAGE_DISPLAY_NAMES } from '@/app/lib/config/environment'

type ProgressStatus = 'processing' | 'queued' | 'completed' | 'failed' | 'paused'

type JobItem = {
  id: string
  name: string
  sizeMb: number
  durationMin: number
  status: ProgressStatus
  progressPct: number
  stage?: string
  message?: string
  createdAt?: string
  outputs?: {
    srtKey?: string
    assKey?: string
    vttKey?: string
    mp4Key?: string
    voiceKey?: string
  }
}

const statusLabel: Record<ProgressStatus, string> = {
  processing: 'Đang xử lý',
  queued: 'Chờ xử lý',
  completed: 'Hoàn thành',
  failed: 'Lỗi',
  paused: 'Tạm dừng',
}

export default function ProgressPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'processing' | 'completed' | 'queued'>('all')

  // API integration
  const { 
    jobs: apiJobs, 
    isLoading, 
    error, 
    refreshJobs, 
    cancelJob 
  } = useJobManagement({
    autoRefresh: true,
    refreshInterval: 5000
  })

  const { isConnected: isWebSocketConnected } = useWebSocket()

  // Convert API jobs to display format
  const jobs: JobItem[] = useMemo(() => {
    return apiJobs.map((job: JobResponse) => ({
      id: job.id,
      name: `Job_${job.id.slice(-8)}.mp4`, // Generate a display name
      sizeMb: 0, // This would need to come from the API
      durationMin: 0, // This would need to come from the API
      status: job.status as ProgressStatus,
      progressPct: job.progress || 0,
      stage: job.stage,
      message: job.message,
      createdAt: job.createdAt,
      outputs: job.outputs
    }))
  }, [apiJobs])

  const filtered = useMemo(() => {
    if (filter === 'all') return jobs
    return jobs.filter(j => j.status === filter)
  }, [jobs, filter])

  const counts = useMemo(() => {
    return {
      total: jobs.length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      queued: jobs.filter(j => j.status === 'queued').length,
    }
  }, [jobs])

  const actionPause = async (id: string) => {
    try {
      await cancelJob(id)
      // Job status will be updated via WebSocket
    } catch (error) {
      console.error('Failed to pause job:', error)
    }
  }
  
  const actionResume = (id: string) => {
    // Resume functionality would need to be implemented in the API
    console.log('Resume job:', id)
  }
  
  const actionDelete = async (id: string) => {
    try {
      await cancelJob(id)
      // Job will be removed from the list via API refresh
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  return (
    <div className="px-8 py-8 bg-gray-900 min-h-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Tiến trình xử lý</h2>
              <p className="text-gray-400 text-sm">Theo dõi trạng thái xử lý video của bạn</p>
            </div>
            
            {/* Connection Status and Refresh */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isWebSocketConnected ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isWebSocketConnected ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {isWebSocketConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <button
                onClick={refreshJobs}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-600"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-600/20 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-700 mb-6">
          {[
            { id: 'all', label: `Tất cả (${counts.total})` },
            { id: 'processing', label: `Đang xử lý (${counts.processing})` },
            { id: 'completed', label: `Hoàn thành (${counts.completed})` },
            { id: 'queued', label: `Chờ xử lý (${counts.queued})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 py-2 text-sm border-b-2 -mb-px ${filter === t.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map(job => (
            <div key={job.id} className="bg-gray-800 rounded-lg p-4 flex items-center cursor-pointer" onClick={() => router.push(`/progress/${job.id}`)}>
              {/* Thumbnail placeholder */}
              <div className="w-20 h-12 bg-gray-700 rounded mr-4" />

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-white text-sm font-medium">{job.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${job.status === 'completed' ? 'bg-emerald-600/20 text-emerald-300' : job.status === 'processing' ? 'bg-blue-600/20 text-blue-300' : job.status === 'queued' ? 'bg-yellow-600/20 text-yellow-300' : job.status === 'failed' ? 'bg-red-600/20 text-red-300' : 'bg-gray-600/20 text-gray-300'}`}>{statusLabel[job.status]}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {job.sizeMb > 0 ? `${job.sizeMb}MB` : 'Unknown size'} • {job.durationMin > 0 ? `${job.durationMin} phút` : 'Unknown duration'}
                </div>

                {/* Progress */}
                {(job.status === 'processing' || job.status === 'queued') && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-700 rounded">
                      <div className="h-2 bg-blue-600 rounded" style={{ width: `${job.progressPct}%` }} />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {job.progressPct}% {job.stage && `• ${STAGE_DISPLAY_NAMES[job.stage as keyof typeof STAGE_DISPLAY_NAMES] || job.stage}`}
                    </div>
                    {job.message && (
                      <div className="text-[10px] text-gray-500 mt-1">{job.message}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {job.status === 'processing' ? (
                  <button onClick={() => actionPause(job.id)} className="w-8 h-8 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" title="Tạm dừng">
                    ❚❚
                  </button>
                ) : job.status === 'paused' ? (
                  <button onClick={() => actionResume(job.id)} className="w-8 h-8 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" title="Tiếp tục">
                    ▶
                  </button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); router.push(`/progress/${job.id}`) }} className="w-8 h-8 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" title="Xem">
                    ⤓
                  </button>
                )}
                <button onClick={() => actionDelete(job.id)} className="w-8 h-8 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" title="Xóa">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl text-white font-semibold">{counts.total}</div>
            <div className="text-gray-400 text-xs">Tổng số video</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl text-white font-semibold">{counts.processing}</div>
            <div className="text-gray-400 text-xs">Đang xử lý</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl text-white font-semibold">{counts.completed}</div>
            <div className="text-gray-400 text-xs">Hoàn thành</div>
          </div>
        </div>
      </div>
    </div>
  )
}



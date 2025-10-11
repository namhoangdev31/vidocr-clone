'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWebSocket } from '@/app/hooks/useWebSocket'
import { STAGE_DISPLAY_NAMES, API_BASE_URL } from '@/app/lib/config/environment'
import { apiClient } from '@/app/lib/api'
import { io, Socket } from 'socket.io-client'

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
  previewUrl?: string
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

  // API integration via /videos/nts/requests
  const [reqIds, setReqIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [reqStatus, setReqStatus] = useState<Record<string, { progressPct: number; stage?: string; status?: ProgressStatus; message?: string; videoUrl?: string; filePath?: string }>>({})

  const refreshJobs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiClient.get('/videos/nts/requests')
      const ids: string[] = res?.data?.data?.reqIds || []
      setReqIds(ids)
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to load requests'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load once then subscribe via WS
    (async () => {
      await refreshJobs()
    })()
  }, [])

  // Connect to WS after we have reqIds
  useEffect(() => {
    if (reqIds.length === 0) return

    const wsUrl = API_BASE_URL.replace('/v1', '') + '/check-task'
    const s = io(wsUrl, { transports: ['websocket', 'polling'] })
    setSocket(s)

    s.on('connect', () => {
      s.emit('check-task:start', { reqIds })
    })

    s.on('check-task:update', ({ reqId, data, error }: any) => {
      // Map backend dbStatus/running states to UI statuses
      const raw = (data?.dbStatus || data?.status || '').toString().toLowerCase()
      let mapped: ProgressStatus = 'queued'
      if (raw === 'running' || raw === 'processing') mapped = 'processing'
      else if (raw === 'pending' || raw === 'queued') mapped = 'queued'
      else if (raw === 'success' || raw === 'completed' || raw === 'complete') mapped = 'completed'
      else if (raw === 'failed' || raw === 'error') mapped = 'failed'

      setReqStatus(prev => ({
        ...prev,
        [reqId]: {
          progressPct: typeof data?.progress === 'number' ? data.progress : (prev[reqId]?.progressPct || 0),
          stage: data?.stage || prev[reqId]?.stage,
          status: mapped || prev[reqId]?.status,
          message: data?.message || prev[reqId]?.message,
          videoUrl: data?.videoUrl || prev[reqId]?.videoUrl,
          filePath: data?.filePath || prev[reqId]?.filePath,
        }
      }))
    })

    s.on('check-task:completed', (_payload: any) => {
      // Could show a toast or trigger refresh if needed
    })

    s.on('check-task:error', (payload: any) => {
      setError(payload?.message || 'WebSocket error')
    })

    return () => {
      try { s.emit('check-task:stop') } catch {}
      s.disconnect()
      setSocket(null)
    }
  }, [reqIds])

  const { isConnected: isWebSocketConnected } = useWebSocket()

  // Convert API jobs to display format
  const jobs: JobItem[] = useMemo(() => {
    return reqIds.map((id: string) => {
      const st = reqStatus[id]
      // Derive display name from filePath or videoUrl
      let displayName = `Req_${id.slice(0, 8)}`
      const filePath = st?.filePath || ''
      const videoUrl = st?.videoUrl || ''
      const source = filePath || videoUrl
      if (source) {
        const base = source.split('/')
        const last = base[base.length - 1]
        if (last) displayName = last
      }

      // Build absolute preview URL if videoUrl exists
      let previewUrl: string | undefined = undefined
      if (st?.videoUrl) {
        const origin = API_BASE_URL.replace('/v1', '')
        previewUrl = origin + st.videoUrl
      }

      return {
        id,
        name: displayName,
        sizeMb: 0,
        durationMin: 0,
        status: st?.status || 'queued',
        progressPct: st?.progressPct || 0,
        stage: st?.stage,
        message: st?.message,
        previewUrl,
      }
    })
  }, [reqIds, reqStatus])

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

  const actionPause = async (_id: string) => {}
  const actionResume = (_id: string) => {}
  const actionDelete = async (_id: string) => {}

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

        {/* Grouped Lists by Status */}
        {(['processing', 'queued', 'completed', 'failed'] as ProgressStatus[]).map((st) => {
          const list = jobs.filter(j => j.status === st)
          if (list.length === 0) return null
          return (
            <div key={st} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-white text-sm font-semibold">
                  {st === 'processing' ? 'Đang xử lý' : st === 'queued' ? 'Chờ xử lý' : st === 'completed' ? 'Hoàn thành' : 'Lỗi'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{list.length}</span>
              </div>
              <div className="space-y-3">
                {list.map(job => (
                  <div key={job.id} className="bg-gray-800 rounded-lg p-4 flex items-center cursor-pointer" onClick={() => router.push(`/progress/${job.id}`)}>
                    {/* Thumbnail / Preview */}
                    {job.previewUrl ? (
                      <div className="w-20 h-12 bg-black rounded mr-4 overflow-hidden">
                        <video src={job.previewUrl} className="w-full h-full object-cover" muted preload="metadata" />
                      </div>
                    ) : (
                      <div className="w-20 h-12 bg-gray-700 rounded mr-4" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-white text-sm font-medium truncate max-w-[260px]" title={job.name}>{job.name}</h4>
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
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/progress/${job.id}`) }} className="w-8 h-8 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" title="Xem">
                        ⤓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

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



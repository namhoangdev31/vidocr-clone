import { useState, useEffect, useCallback } from 'react'
import { videoTranslationService, CreateJobRequest, JobResponse } from '@/app/lib/api/videoTranslationService'
import { useWebSocket } from './useWebSocket'

// WebSocket event types
interface JobStageChangeData {
  jobId: string
  stage: string
  progress: number
  message: string
}

interface JobCompletedData {
  jobId: string
  outputs: any
}

interface JobFailedData {
  jobId: string
  error: {
    code: string
    message: string
  }
}

export interface UseJobManagementOptions {
  autoRefresh?: boolean
  refreshInterval?: number
}

export interface UseJobManagementReturn {
  jobs: JobResponse[]
  currentJob: JobResponse | null
  isLoading: boolean
  error: string | null
  createJob: (jobData: CreateJobRequest) => Promise<JobResponse>
  getJobStatus: (jobId: string) => Promise<JobResponse>
  cancelJob: (jobId: string) => Promise<void>
  refreshJobs: () => Promise<void>
  setCurrentJob: (job: JobResponse | null) => void
  updateJobProgress: (jobId: string, updates: Partial<JobResponse>) => void
}

export function useJobManagement(options: UseJobManagementOptions = {}): UseJobManagementReturn {
  const { autoRefresh = true, refreshInterval = 5000 } = options
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [currentJob, setCurrentJob] = useState<JobResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { onJobStageChange, onJobCompleted, onJobFailed } = useWebSocket()

  // WebSocket event handlers
  useEffect(() => {
    const handleJobStageChange = (data: JobStageChangeData) => {
      setJobs(prev => prev.map(job => 
        job.id === data.jobId 
          ? { 
              ...job, 
              stage: data.stage, 
              progress: data.progress,
              message: data.message,
              status: data.stage === 'completed' ? 'completed' : 
                     data.stage === 'failed' ? 'failed' : 'processing'
            }
          : job
      ))

      // Update current job if it matches
      setCurrentJob(prev => 
        prev?.id === data.jobId 
          ? { 
              ...prev, 
              stage: data.stage, 
              progress: data.progress,
              message: data.message,
              status: data.stage === 'completed' ? 'completed' : 
                     data.stage === 'failed' ? 'failed' : 'processing'
            }
          : prev
      )
    }

    const handleJobCompleted = (data: JobCompletedData) => {
      setJobs(prev => prev.map(job => 
        job.id === data.jobId 
          ? { 
              ...job, 
              status: 'completed' as const,
              stage: 'completed',
              progress: 100,
              outputs: data.outputs
            }
          : job
      ))

      // Update current job if it matches
      setCurrentJob(prev => 
        prev?.id === data.jobId 
          ? { 
              ...prev, 
              status: 'completed' as const,
              stage: 'completed',
              progress: 100,
              outputs: data.outputs
            }
          : prev
      )
    }

    const handleJobFailed = (data: JobFailedData) => {
      setJobs(prev => prev.map(job => 
        job.id === data.jobId 
          ? { 
              ...job, 
              status: 'failed' as const,
              stage: 'failed',
               message: data.error.message
            }
          : job
      ))

      // Update current job if it matches
      setCurrentJob(prev => 
        prev?.id === data.jobId 
          ? { 
              ...prev, 
              status: 'failed' as const,
              stage: 'failed',
               message: data.error.message
            }
          : prev
      )
    }

    // Register event listeners
    onJobStageChange(handleJobStageChange)
    onJobCompleted(handleJobCompleted)
    onJobFailed(handleJobFailed)

    // Cleanup is handled by useWebSocket hook
  }, [onJobStageChange, onJobCompleted, onJobFailed])

  const createJob = useCallback(async (jobData: CreateJobRequest): Promise<JobResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const job = await videoTranslationService.createJob(jobData)
      
      // Add new job to the list
      setJobs(prev => [job, ...prev])
      setCurrentJob(job)
      
      return job
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getJobStatus = useCallback(async (jobId: string): Promise<JobResponse> => {
    try {
      const job = await videoTranslationService.getJobStatus(jobId)
      
      // Update job in the list
      setJobs(prev => prev.map(j => j.id === jobId ? job : j))
      
      // Update current job if it matches
      setCurrentJob(prev => prev?.id === jobId ? job : prev)
      
      return job
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get job status'
      setError(errorMessage)
      throw err
    }
  }, [])

  const cancelJob = useCallback(async (jobId: string): Promise<void> => {
    try {
      await videoTranslationService.cancelJob(jobId)
      
      // Update job status in the list
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'cancelled' as const, stage: 'canceled' }
          : job
      ))
      
      // Update current job if it matches
      setCurrentJob(prev => 
        prev?.id === jobId 
          ? { ...prev, status: 'cancelled' as const, stage: 'canceled' }
          : prev
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel job'
      setError(errorMessage)
      throw err
    }
  }, [])

  const refreshJobs = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const jobsList = await videoTranslationService.getJobs()
      setJobs(jobsList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh jobs'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateJobProgress = useCallback((jobId: string, updates: Partial<JobResponse>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ))

    setCurrentJob(prev => 
      prev?.id === jobId ? { ...prev, ...updates } : prev
    )
  }, [])

  // Auto-refresh jobs
  useEffect(() => {
    if (!autoRefresh) return

    // Initial load
    refreshJobs()

    // Set up interval
    const interval = setInterval(refreshJobs, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshJobs])

  return {
    jobs,
    currentJob,
    isLoading,
    error,
    createJob,
    getJobStatus,
    cancelJob,
    refreshJobs,
    setCurrentJob,
    updateJobProgress
  }
}

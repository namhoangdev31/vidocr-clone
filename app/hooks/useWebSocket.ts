import { useEffect, useRef, useState } from 'react'
import { socketService, UploadProgressData, JobStageChangeData, JobCompletedData, JobFailedData } from '@/app/lib/websocket/socketService'

export interface UseWebSocketOptions {
  autoConnect?: boolean
  token?: string
}

export interface UseWebSocketReturn {
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  joinUploadSession: (sessionId: string, userId: string) => void
  reportUploadProgress: (sessionId: string, progress: UploadProgressData['progress']) => void
  onUploadProgress: (callback: (data: UploadProgressData) => void) => void
  onUploadCompleted: (callback: (data: any) => void) => void
  onUploadCancelled: (callback: (data: any) => void) => void
  onJobStageChange: (callback: (data: JobStageChangeData) => void) => void
  onJobCompleted: (callback: (data: JobCompletedData) => void) => void
  onJobFailed: (callback: (data: JobFailedData) => void) => void
  offUploadProgress: (callback?: (data: UploadProgressData) => void) => void
  offUploadCompleted: (callback?: (data: any) => void) => void
  offUploadCancelled: (callback?: (data: any) => void) => void
  offJobStageChange: (callback?: (data: JobStageChangeData) => void) => void
  offJobCompleted: (callback?: (data: JobCompletedData) => void) => void
  offJobFailed: (callback?: (data: JobFailedData) => void) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, token } = options
  const [isConnected, setIsConnected] = useState(false)
  const callbacksRef = useRef<{
    uploadProgress?: (data: UploadProgressData) => void
    uploadCompleted?: (data: any) => void
    uploadCancelled?: (data: any) => void
    jobStageChange?: (data: JobStageChangeData) => void
    jobCompleted?: (data: JobCompletedData) => void
    jobFailed?: (data: JobFailedData) => void
  }>({})

  const connect = async () => {
    try {
      await socketService.connect(token)
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    socketService.disconnect()
    setIsConnected(false)
  }

  const joinUploadSession = (sessionId: string, userId: string) => {
    try {
      socketService.joinUploadSession(sessionId, userId)
    } catch (error) {
      console.error('Failed to join upload session:', error)
    }
  }

  const reportUploadProgress = (sessionId: string, progress: UploadProgressData['progress']) => {
    try {
      socketService.reportUploadProgress(sessionId, progress)
    } catch (error) {
      console.error('Failed to report upload progress:', error)
    }
  }

  // Event listener management
  const onUploadProgress = (callback: (data: UploadProgressData) => void) => {
    callbacksRef.current.uploadProgress = callback
    socketService.onUploadProgress(callback)
  }

  const onUploadCompleted = (callback: (data: any) => void) => {
    callbacksRef.current.uploadCompleted = callback
    socketService.onUploadCompleted(callback)
  }

  const onUploadCancelled = (callback: (data: any) => void) => {
    callbacksRef.current.uploadCancelled = callback
    socketService.onUploadCancelled(callback)
  }

  const onJobStageChange = (callback: (data: JobStageChangeData) => void) => {
    callbacksRef.current.jobStageChange = callback
    socketService.onJobStageChange(callback)
  }

  const onJobCompleted = (callback: (data: JobCompletedData) => void) => {
    callbacksRef.current.jobCompleted = callback
    socketService.onJobCompleted(callback)
  }

  const onJobFailed = (callback: (data: JobFailedData) => void) => {
    callbacksRef.current.jobFailed = callback
    socketService.onJobFailed(callback)
  }

  const offUploadProgress = (callback?: (data: UploadProgressData) => void) => {
    socketService.offUploadProgress(callback || callbacksRef.current.uploadProgress)
    if (!callback) {
      callbacksRef.current.uploadProgress = undefined
    }
  }

  const offUploadCompleted = (callback?: (data: any) => void) => {
    socketService.offUploadCompleted(callback || callbacksRef.current.uploadCompleted)
    if (!callback) {
      callbacksRef.current.uploadCompleted = undefined
    }
  }

  const offUploadCancelled = (callback?: (data: any) => void) => {
    socketService.offUploadCancelled(callback || callbacksRef.current.uploadCancelled)
    if (!callback) {
      callbacksRef.current.uploadCancelled = undefined
    }
  }

  const offJobStageChange = (callback?: (data: JobStageChangeData) => void) => {
    socketService.offJobStageChange(callback || callbacksRef.current.jobStageChange)
    if (!callback) {
      callbacksRef.current.jobStageChange = undefined
    }
  }

  const offJobCompleted = (callback?: (data: JobCompletedData) => void) => {
    socketService.offJobCompleted(callback || callbacksRef.current.jobCompleted)
    if (!callback) {
      callbacksRef.current.jobCompleted = undefined
    }
  }

  const offJobFailed = (callback?: (data: JobFailedData) => void) => {
    socketService.offJobFailed(callback || callbacksRef.current.jobFailed)
    if (!callback) {
      callbacksRef.current.jobFailed = undefined
    }
  }

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      // Remove all event listeners
      const callbacks = callbacksRef.current
      if (callbacks.uploadProgress) offUploadProgress()
      if (callbacks.uploadCompleted) offUploadCompleted()
      if (callbacks.uploadCancelled) offUploadCancelled()
      if (callbacks.jobStageChange) offJobStageChange()
      if (callbacks.jobCompleted) offJobCompleted()
      if (callbacks.jobFailed) offJobFailed()
    }
  }, [autoConnect, token])

  // Update connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(socketService.isSocketConnected())
    }

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    isConnected,
    connect,
    disconnect,
    joinUploadSession,
    reportUploadProgress,
    onUploadProgress,
    onUploadCompleted,
    onUploadCancelled,
    onJobStageChange,
    onJobCompleted,
    onJobFailed,
    offUploadProgress,
    offUploadCompleted,
    offUploadCancelled,
    offJobStageChange,
    offJobCompleted,
    offJobFailed
  }
}
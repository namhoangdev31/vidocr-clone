import { io, Socket } from 'socket.io-client'
import { API_BASE_URL, WEBSOCKET_EVENTS } from '@/app/lib/config/environment'

export interface UploadProgressData {
  sessionId: string
  progress: {
    percentage: number
    chunk: number
    total: number
  }
}

export interface JobStageChangeData {
  jobId: string
  stage: string
  progress: number
  message: string
}

export interface JobCompletedData {
  jobId: string
  outputs: {
    srtKey?: string
    assKey?: string
    vttKey?: string
    mp4Key?: string
    voiceKey?: string
  }
}

export interface JobFailedData {
  jobId: string
  error: {
    code: string
    message: string
  }
}

export interface UploadCompletedData {
  sessionId: string
  key: string
}

export interface UploadCancelledData {
  sessionId: string
  message: string
}

class SocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
      
      // Remove /v1 from WebSocket URL as it's for REST API only
      const wsUrl = API_BASE_URL.replace('/v1', '')
      
      this.socket = io(wsUrl, {
        auth: {
          token: authToken
        },
        transports: ['websocket', 'polling']
      })

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server')
        this.isConnected = true
        this.reconnectAttempts = 0
        resolve()
      })

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket server:', reason)
        this.isConnected = false
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnect()
        }
      })

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        console.error('WebSocket URL:', wsUrl)
        console.error('Auth token present:', !!authToken)
        this.isConnected = false
        reject(error)
      })

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected to WebSocket server after', attemptNumber, 'attempts')
        this.isConnected = true
        this.reconnectAttempts = 0
      })

      this.socket.on('reconnect_error', (error) => {
        console.error('WebSocket reconnection error:', error)
        this.handleReconnect()
      })

      this.socket.on('reconnect_failed', () => {
        console.error('WebSocket reconnection failed after maximum attempts')
        this.isConnected = false
      })
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.connect()
        }
      }, delay)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Upload session management
  joinUploadSession(sessionId: string, userId: string) {
    if (!this.socket || !this.isConnected) {
      throw new Error('WebSocket not connected')
    }

    this.socket.emit(WEBSOCKET_EVENTS.JOIN_UPLOAD_SESSION, { sessionId, userId })
  }

  // Upload progress reporting
  reportUploadProgress(sessionId: string, progress: UploadProgressData['progress']) {
    if (!this.socket || !this.isConnected) {
      throw new Error('WebSocket not connected')
    }

    this.socket.emit(WEBSOCKET_EVENTS.CLIENT_UPLOAD_PROGRESS, {
      sessionId,
      progress
    })
  }

  // Event listeners
  onUploadProgress(callback: (data: UploadProgressData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.UPLOAD_PROGRESS, callback)
  }

  onUploadCompleted(callback: (data: UploadCompletedData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.UPLOAD_COMPLETED, callback)
  }

  onUploadCancelled(callback: (data: UploadCancelledData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.UPLOAD_CANCELLED, callback)
  }

  onJobStageChange(callback: (data: JobStageChangeData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.JOB_STAGE_CHANGE, callback)
  }

  onJobCompleted(callback: (data: JobCompletedData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.JOB_COMPLETED, callback)
  }

  onJobFailed(callback: (data: JobFailedData) => void) {
    if (!this.socket) return

    this.socket.on(WEBSOCKET_EVENTS.JOB_FAILED, callback)
  }

  // Remove event listeners
  offUploadProgress(callback?: (data: UploadProgressData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_PROGRESS, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_PROGRESS)
    }
  }

  offUploadCompleted(callback?: (data: UploadCompletedData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_COMPLETED, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_COMPLETED)
    }
  }

  offUploadCancelled(callback?: (data: UploadCancelledData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_CANCELLED, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.UPLOAD_CANCELLED)
    }
  }

  offJobStageChange(callback?: (data: JobStageChangeData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.JOB_STAGE_CHANGE, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.JOB_STAGE_CHANGE)
    }
  }

  offJobCompleted(callback?: (data: JobCompletedData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.JOB_COMPLETED, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.JOB_COMPLETED)
    }
  }

  offJobFailed(callback?: (data: JobFailedData) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(WEBSOCKET_EVENTS.JOB_FAILED, callback)
    } else {
      this.socket.off(WEBSOCKET_EVENTS.JOB_FAILED)
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  getSocket(): Socket | null {
    return this.socket
  }

  // Emit with acknowledgment
  emitWithAck(event: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      this.socket.emit(event, data, (response: any) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }
}

export const socketService = new SocketService()
import axios from 'axios'

// Base URL cho server API
const API_BASE_URL = 'http://localhost:3001/v1'

// Tạo axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

// Response types
export interface ServerUser {
  id: string
  email: string
  name: string
  roles: string[]
  socialId?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user?: ServerUser
    access_token: string
    refresh_token: string
    token_type?: string
    expires_in?: number
    expires_at?: number
    roles?: string[]
  }
}

export interface GoogleOAuthRequest {
  access_token: string
  id_token: string
}

export interface EmailLoginRequest {
  email: string
  password: string
}

// API functions
export const authAPI = {
  // Đăng nhập bằng Google OAuth
  loginWithGoogle: async (googleAccessToken: string, idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/oauth/google/mobile', {
      access_token: googleAccessToken,
      id_token: idToken
    })
    return response.data
  },

  // Đăng nhập bằng email/password
  loginWithEmail: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password
    })
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response.data
  },

  // Logout
  logout: async (accessToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }
}

// Translation API (stubbed schema)
export interface TranslateSubtitleItemRequest {
  text: string
  sourceLang: string
  targetLang: string
}

export interface TranslateSubtitleItemResponse {
  translatedText: string
}

export const translationAPI = {
  translateText: async (payload: TranslateSubtitleItemRequest): Promise<TranslateSubtitleItemResponse> => {
    // Endpoint giả định; thay bằng endpoint thật của bạn
    const response = await apiClient.post<TranslateSubtitleItemResponse>('/translate/text', payload)
    return response.data
  }
}

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  isTokenExpired: (expiresAt?: number): boolean => {
    if (!expiresAt) return false
    return Date.now() >= expiresAt * 1000
  }
}

// Axios interceptor để tự động thêm token vào requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Axios interceptor để xử lý token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = tokenManager.getRefreshToken()
      if (refreshToken) {
        try {
          const response = await authAPI.refreshToken(refreshToken)
          tokenManager.setTokens(response.data.access_token, response.data.refresh_token)
          
          // Retry original request với token mới
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh token cũng hết hạn, redirect về login
          tokenManager.clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

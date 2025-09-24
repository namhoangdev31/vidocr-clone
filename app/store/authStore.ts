'use client'

import { create } from 'zustand'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { GoogleAuthProvider } from 'firebase/auth'
import { authAPI, tokenManager, ServerUser, AuthResponse } from '../lib/api'

interface AuthState {
  user: User | null
  serverUser: ServerUser | null
  loading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null
  loginWithGoogle: () => Promise<void>
  loginWithCredentials: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => void
  refreshAccessToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  serverUser: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,

  loginWithGoogle: async () => {
    if (typeof window === 'undefined') return
    
    try {
      set({ loading: true, error: null })
      
      // 1. Đăng nhập Firebase Google OAuth
      const firebaseResult = await signInWithPopup(auth, googleProvider)
      const firebaseUser = firebaseResult.user
      
      // 2. Lấy Google access token và id token
      const credential = GoogleAuthProvider.credentialFromResult(firebaseResult)
      if (!credential) {
        throw new Error('Không thể lấy credential từ Google')
      }
      
      const googleAccessToken = credential.accessToken
      const idToken = credential.idToken
      
      if (!googleAccessToken || !idToken) {
        throw new Error('Không thể lấy token từ Google')
      }
      
      // 3. Gửi thông tin đến server để lấy access_token
      const serverResponse = await authAPI.loginWithGoogle(googleAccessToken, idToken)
      
      if (serverResponse.success) {
        // 4. Lưu tokens và thông tin user
        const { access_token, refresh_token, user } = serverResponse.data
        
        tokenManager.setTokens(access_token, refresh_token)
        
        set({ 
          user: firebaseUser,
          serverUser: user,
          accessToken: access_token,
          refreshToken: refresh_token,
          loading: false 
        })
      } else {
        throw new Error(serverResponse.message || 'Đăng nhập server thất bại')
      }
      
    } catch (error: any) {
      console.error('Google login error:', error)
      set({ 
        error: error.message || 'Đăng nhập Google thất bại', 
        loading: false 
      })
      
      // Đăng xuất Firebase nếu server login thất bại
      try {
        await signOut(auth)
      } catch (signOutError) {
        console.error('Firebase signout error:', signOutError)
      }
    }
  },

  loginWithCredentials: async (email: string, password: string) => {
    if (typeof window === 'undefined') return
    
    try {
      set({ loading: true, error: null })
      
      // 1. Gửi thông tin đăng nhập đến server
      const serverResponse = await authAPI.loginWithEmail(email, password)
      
      if (serverResponse.success) {
        // 2. Lưu tokens từ server response
        const { access_token, refresh_token } = serverResponse.data
        
        tokenManager.setTokens(access_token, refresh_token)
        
        // 3. Tạo mock Firebase user object cho consistency
        const mockFirebaseUser = {
          uid: 'email-user',
          email: email,
          displayName: email.split('@')[0],
          photoURL: null
        } as User
        
        set({ 
          user: mockFirebaseUser,
          serverUser: serverResponse.data.user || null,
          accessToken: access_token,
          refreshToken: refresh_token,
          loading: false 
        })
      } else {
        throw new Error(serverResponse.message || 'Đăng nhập thất bại')
      }
      
    } catch (error: any) {
      console.error('Email login error:', error)
      set({ 
        error: error.message || 'Đăng nhập thất bại', 
        loading: false 
      })
    }
  },

  logout: async () => {
    if (typeof window === 'undefined') return
    
    try {
      set({ loading: true, error: null })
      
      // 1. Đăng xuất khỏi server nếu có access token
      const accessToken = get().accessToken
      if (accessToken) {
        try {
          await authAPI.logout(accessToken)
        } catch (error) {
          console.error('Server logout error:', error)
          // Tiếp tục với local logout ngay cả khi server logout thất bại
        }
      }
      
      // 2. Đăng xuất Firebase nếu có Firebase user
      const firebaseUser = get().user
      if (firebaseUser && firebaseUser.uid !== 'email-user') {
        try {
          await signOut(auth)
        } catch (error) {
          console.error('Firebase logout error:', error)
        }
      }
      
      // 3. Xóa tokens và reset state
      tokenManager.clearTokens()
      set({ 
        user: null,
        serverUser: null,
        accessToken: null,
        refreshToken: null,
        loading: false 
      })
      
    } catch (error: any) {
      console.error('Logout error:', error)
      set({ 
        error: error.message || 'Đăng xuất thất bại', 
        loading: false 
      })
    }
  },

  refreshAccessToken: async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false
    
    try {
      const refreshToken = get().refreshToken
      if (!refreshToken) return false
      
      const response = await authAPI.refreshToken(refreshToken)
      
      if (response.success) {
        const { access_token, refresh_token } = response.data
        tokenManager.setTokens(access_token, refresh_token)
        
        set({
          accessToken: access_token,
          refreshToken: refresh_token
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  },

  checkSession: () => {
    if (typeof window === 'undefined') return
    
    set({ loading: true })
    
    // Load tokens từ localStorage
    const accessToken = tokenManager.getAccessToken()
    const refreshToken = tokenManager.getRefreshToken()
    
    if (accessToken && refreshToken) {
      set({
        accessToken,
        refreshToken,
        loading: false
      })
      
      // Kiểm tra Firebase session nếu có
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          set({ user: firebaseUser })
        }
      })
    } else {
      set({ loading: false })
    }
  }
}))

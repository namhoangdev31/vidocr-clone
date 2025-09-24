'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'

export default function LoginForm() {
  const router = useRouter()
  const { accessToken, loginWithGoogle, loginWithCredentials, loading, error, checkSession } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Kiểm tra session khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkSession()
    }
  }, [checkSession])

  // Redirect khi đăng nhập thành công
  useEffect(() => {
    if (accessToken) {
      router.push('/')
    }
  }, [accessToken, router])

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
  }

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginWithCredentials(email, password)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Illustration */}
          <div className="hidden md:flex md:col-span-6 bg-rose-100 rounded-2xl p-8">
            <div className="w-full h-full rounded-xl bg-rose-50 border border-rose-200 flex">
              <div className="p-6 sm:p-10 flex-1 flex flex-col">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug max-w-md">
                  Phá vỡ mọi rào cản ngôn ngữ với dịch thuật AI.
                </div>
                <div className="mt-8 flex-1 flex items-center justify-center">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 bg-rose-200 rounded-2xl border border-rose-300 shadow-inner" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-6 w-full max-w-md md:max-w-none mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Đăng nhập một chạm</h1>
                </div>

                {/* Google Sign-in */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#1a73e8] text-white text-[11px] font-bold">G</span>
                    <span>{loading ? 'Đang xử lý...' : 'Đăng nhập với Google'}</span>
                  </button>
                  <button
                    type="button"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    aria-label="SSO"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" /></svg>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px bg-gray-200 flex-1" />
                  <div className="text-xs text-gray-400">Hoặc</div>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                {/* Form */}
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  {error ? <div className="text-sm text-red-600">{error}</div> : null}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="test@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mật Khẩu</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="secret123"
                      required
                    />
                  </div>
                  <button
                    className="w-full rounded-md bg-rose-500 hover:bg-rose-400 text-white font-medium py-2.5 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                  </button>
                </form>
              </div>
            </div>

            {/* Small card image */}
            <div className="mt-6 flex justify-center md:justify-end">
              <div className="h-28 w-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1529244929468-1f3e2915f89e?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

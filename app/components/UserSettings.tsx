'use client'

import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/app/lib/api'

interface UserSettingsProps {
  onClose?: () => void
}

export default function UserSettings({ onClose }: UserSettingsProps) {
  const { logout, user, serverUser } = useAuthStore()
  const router = useRouter()
  const [points, setPoints] = useState(10000)
  const [language, setLanguage] = useState('Tiếng Việt')
  const [storage, setStorage] = useState('14 Day')
  const [uploadServer, setUploadServer] = useState('Hồ Chí Minh 02')
  const [editServer, setEditServer] = useState('Hồ Chí Minh 04')
  const [downloadServer, setDownloadServer] = useState('Hồ Chí Minh 05')
  const [feedback, setFeedback] = useState({
    accuracy: false,
    font: false,
    timing: false,
    tools: false,
    moreTools: false
  })
  const [feedbackText, setFeedbackText] = useState('')

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleRechargeHistory = () => {
    // TODO: Implement recharge history
    console.log('Navigate to recharge history')
  }

  const handleChangePassword = () => {
    // TODO: Implement change password
    console.log('Navigate to change password')
  }

  const handleTeam = () => {
    // TODO: Implement team management
    console.log('Navigate to team management')
  }

  const handleSupport = () => {
    // TODO: Implement support
    console.log('Navigate to support')
  }

  const handleReportBug = () => {
    // TODO: Implement bug report
    console.log('Navigate to bug report')
  }

  const handleFeedbackSubmit = () => {
    // TODO: Submit feedback
    console.log('Submit feedback:', { feedback, feedbackText })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Cài đặt người dùng</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Đóng
            </button>
          )}
        </div>

        {/* Points Section */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Points: {points.toLocaleString()}</span>
            </div>
            <button
              onClick={() => window.open('/nap-point', '_blank')}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400"
            >
              Nạp Point
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quản lý tài khoản</h2>
          <div className="space-y-3">
            <button
              onClick={handleRechargeHistory}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Lịch sử nạp tiền</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>

            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Đổi mật khẩu</span>
            </button>

            <button
              onClick={handleTeam}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Đội nhóm</span>
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Cài đặt chung</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-gray-300">Ngôn ngữ</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-gray-300">Lưu trữ</span>
              </div>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="14 Day">14 Day</option>
                <option value="30 Day">30 Day</option>
                <option value="90 Day">90 Day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Hỗ trợ</h2>
          <div className="space-y-3">
            <button
              onClick={handleSupport}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Hỗ trợ</span>
            </button>

            <button
              onClick={handleReportBug}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Báo lỗi</span>
            </button>
          </div>
        </div>

        {/* Server Configuration */}
        <div className="mb-8">
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Cấu hình server</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Upload Server:</span>
                <select
                  value={uploadServer}
                  onChange={(e) => setUploadServer(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Hồ Chí Minh 01">Hồ Chí Minh 01</option>
                  <option value="Hồ Chí Minh 02">Hồ Chí Minh 02</option>
                  <option value="Hồ Chí Minh 03">Hồ Chí Minh 03</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Edit Server:</span>
                <select
                  value={editServer}
                  onChange={(e) => setEditServer(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Hồ Chí Minh 04">Hồ Chí Minh 04</option>
                  <option value="Hồ Chí Minh 05">Hồ Chí Minh 05</option>
                  <option value="Hồ Chí Minh 06">Hồ Chí Minh 06</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Download Server:</span>
                <select
                  value={downloadServer}
                  onChange={(e) => setDownloadServer(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Hồ Chí Minh 05">Hồ Chí Minh 05</option>
                  <option value="Hồ Chí Minh 06">Hồ Chí Minh 06</option>
                  <option value="Hồ Chí Minh 07">Hồ Chí Minh 07</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Góp ý</h2>
          <p className="text-gray-300 mb-6">
            Đừng ngại góp ý để chúng tôi cải tiến hơn qua từng phiên bản!
          </p>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={feedback.accuracy}
                onChange={(e) => setFeedback({ ...feedback, accuracy: e.target.checked })}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500"
              />
              <span className="text-gray-300">Độ chính xác trong nhận dạng</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={feedback.font}
                onChange={(e) => setFeedback({ ...feedback, font: e.target.checked })}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500"
              />
              <span className="text-gray-300">Kiểu chữ văn bản</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={feedback.timing}
                onChange={(e) => setFeedback({ ...feedback, timing: e.target.checked })}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500"
              />
              <span className="text-gray-300">Timing</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={feedback.tools}
                onChange={(e) => setFeedback({ ...feedback, tools: e.target.checked })}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500"
              />
              <span className="text-gray-300">Công cụ chỉnh sửa</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={feedback.moreTools}
                onChange={(e) => setFeedback({ ...feedback, moreTools: e.target.checked })}
                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-yellow-500"
              />
              <span className="text-gray-300">Cần thêm công cụ</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Ý kiến chi tiết</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Thêm ý kiến"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none h-24"
            />
          </div>

          <button
            onClick={handleFeedbackSubmit}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gửi góp ý
          </button>
        </div>
      </div>
    </div>
  )
}

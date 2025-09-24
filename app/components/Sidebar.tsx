'use client'

import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: 'export', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'XUẤT BẢN' },
  { id: 'create', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', label: 'TẠO MỚI' },
  { id: 'test', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'TEST API' },
  { id: 'dubbing', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 8.464a5 5 0 000 7.072M5.636 5.636a9 9 0 000 12.728', label: 'LỒNG TIẾNG' },
  { id: 'progress', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'TIẾN TRÌNH' },
  { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'CÀI ĐẶT' },
  { id: 'audio', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', label: 'ÂM THANH' },
  { id: 'frame', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'KHUNG & LOGO' },
  { id: 'subtitle', icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 3v1h6V3H9zm1 5a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1z', label: 'PHỤ ĐỀ' },
  { id: 'user', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'NGƯỜI DÙNG' },
  { id: 'support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', label: 'HỖ TRỢ' }
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { logout, user, serverUser } = useAuthStore()
  const router = useRouter()

  const handleTabClick = (tabId: string) => {
    if (tabId === 'user') {
      setShowUserMenu(!showUserMenu)
    } else {
      setShowUserMenu(false)
      onTabChange(tabId)
    }
  }

  return (
    <div className="w-32 bg-gray-900 border-l border-gray-600 flex flex-col items-center h-screen relative">
      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="absolute right-32 top-0 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                {(serverUser?.avatarUrl || user?.photoURL) ? (
                  <img 
                    src={serverUser?.avatarUrl || user?.photoURL || ''} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm">
                  {serverUser?.name || user?.displayName || user?.email || 'Người dùng'}
                </span>
                <span className="text-gray-400 text-xs">Points: 7020</span>
              </div>
            </div>
            <button 
              className="px-3 py-1 bg-yellow-500 text-black text-xs rounded font-medium"
              onClick={() => window.open('/payment', '_blank')}
            >
              Nạp Point
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Lịch sử nạp tiền</span>
            </button>

            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              onClick={async () => {
                await logout()
                router.push('/login')
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Đăng xuất</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-sm">Đổi mật khẩu</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">Đổi nhóm</span>
            </button>

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-sm text-gray-300">Ngôn ngữ</span>
              </div>
              <span className="text-sm text-white">Tiếng Việt</span>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-sm text-gray-300">Lưu trữ</span>
              </div>
              <span className="text-sm text-white">14 Day</span>
            </div>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">Hỗ trợ</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">Báo lỗi</span>
            </button>
          </div>

          {/* Server Info */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Upload Server:</span>
                <span className="text-white">Hồ Chí Minh 01</span>
              </div>
              <div className="flex justify-between">
                <span>Edit Server:</span>
                <span className="text-white">Hồ Chí Minh 05</span>
              </div>
              <div className="flex justify-between">
                <span>Download Server:</span>
                <span className="text-white">Hồ Chí Minh 05</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400 leading-relaxed">
              Đừng ngại góp ý để chúng tôi cải tiến hơn qua từng phiên bản!
            </p>
            <div className="mt-3 space-y-1">
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-500" />
                <span>Đổi chính xác trong nhận dạng</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-500" />
                <span>Kiểu chữ văn bản</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-500" />
                <span>Timing</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-500" />
                <span>Công cụ chỉnh sửa</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-500" />
                <span>Cần thêm công cụ</span>
              </label>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Ý kiến chi tiết</p>
              <button className="w-full px-3 py-2 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 text-left">
                Thêm ý kiến
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Main Navigation Items */}
      <div className="flex flex-col items-center justify-start flex-1 py-8 space-y-6">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-colors ${
              (activeTab === item.id && item.id !== 'user') || (item.id === 'user' && showUserMenu)
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <span className="text-[10px] text-center leading-tight px-1">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Language Button */}
      <div className="pb-6">
        <button className="px-3 py-2 text-[10px] text-gray-400 hover:text-gray-300 rounded transition-colors">
          ENGLISH
        </button>
      </div>
    </div>
  )
}
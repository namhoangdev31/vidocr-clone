export default function HomePage() {
  return (
    <div className="flex-1 bg-gray-900 px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-8">
            Tùy Chọn Dịch Thuật
          </h1>
        </div>

        {/* File Upload Section */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="w-full h-96 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Upload Icon */}
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              {/* Text */}
              <div className="text-center">
                <h3 className="text-xl font-medium text-white mb-3">
                  Drop your video file here
                </h3>
                <p className="text-lg text-gray-400">
                  or click to browse files
                </p>
              </div>
              
              {/* Cloud Service Options */}
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.28 6.28a.75.75 0 00-1.06 1.06L8.94 11H3a1 1 0 100 2h5.94l-3.72 3.66a.75.75 0 101.06 1.06L11 13l4.72 4.72a.75.75 0 101.06-1.06L13.06 13H19a1 1 0 100-2h-5.94l3.72-3.66a.75.75 0 00-1.06-1.06L11 11L6.28 6.28z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Google Drive</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.71 6.71a1 1 0 00-1.42 0l-4 4a1 1 0 000 1.42l4 4a1 1 0 001.42-1.42L4.42 11H20a1 1 0 000-2H4.42l3.29-3.29a1 1 0 000-1.42z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Dropbox</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25 4.83 4.83 0 01-7.72 0 4.83 4.83 0 01-3.77 4.25 4.83 4.83 0 000 6.62 4.83 4.83 0 013.77 4.25 4.83 4.83 0 017.72 0 4.83 4.83 0 013.77-4.25 4.83 4.83 0 000-6.62z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">TikTok</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">YouTube</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Language Settings</h3>
              <label className="flex items-center gap-2">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-3 h-3 bg-gray-600 border border-gray-500 rounded-sm"></div>
                </div>
                <span className="text-sm text-gray-300">Auto-detect</span>
              </label>
            </div>
            
            <div className="flex items-end gap-4">
              {/* Source Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Source Language</label>
                <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🇺🇸</span>
                    <span>English</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Switch Button */}
              <div className="pb-3">
                <button className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
              
              {/* Target Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Target Language</label>
                <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🇻🇳</span>
                    <span>Vietnamese</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Lựa chọn mô hình AI</h3>
            <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Model AI:</span>
                <span>ChatGPT 4o Giá Rẻ (1 ký tự trên dưới 1 token)</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Processing Options */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-1 mb-4">
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Phụ Đề Mềm</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Phụ Đề Cứng</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v0" />
                </svg>
                <span className="text-sm">Dịch Văn Bản</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 8.464a5 5 0 000 7.072M5.636 5.636a9 9 0 000 12.728" />
                </svg>
                <span className="text-sm">Ghép Âm Thanh</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-sm">Ghép Âm Thanh V2</span>
              </button>
            </div>

            {/* Configuration Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Server:</label>
                <select className="w-full bg-gray-600 rounded px-3 py-2 text-sm text-white">
                  <option>Server 1 (Nhẹ hoạt ngại)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Ngôn Ngữ Phụ Đề:</label>
                <select className="w-full bg-gray-600 rounded px-3 py-2 text-sm text-white">
                  <option>Simplified Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Frame Size:</label>
                <input type="text" value="8" className="w-full bg-gray-600 rounded px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Số Luồng:</label>
                <input type="text" value="5" className="w-full bg-gray-600 rounded px-3 py-2 text-sm text-white" />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">📁 Chính chỉ thời gian tầm mạc</span>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded" />
                </label>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 mb-6">
              <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
                Đo chiều cao chữ
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
                Xem Trước Xong Cấp
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
                Tách Thử
              </button>
              
              {/* Brightness Control */}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-300">Chỉnh sáng:</span>
                <div className="w-32 h-1 bg-gray-600 rounded relative">
                  <div className="w-16 h-1 bg-blue-500 rounded"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-0 left-12 transform -translate-y-1.5"></div>
                </div>
                <span className="text-sm text-white">160</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium">
                START: Lấy Sub V2
              </button>
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium">
                START: Format + Lấy Sub V2
              </button>
              
              {/* Filter Box */}
              <div className="flex-1 bg-gray-600 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Loc Bộ Các Ký Tự:</span>
                  <span className="text-sm text-white">1,2,3,4,5,6,7,8,9,0,M,Z,T,8,o,C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-gray-800 bg-opacity-30 border border-gray-600 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1" />
                  </svg>
                </div>
                <span className="text-white font-medium">START: Lấy Sub V2</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex-1 bg-gray-800 bg-opacity-30 border border-gray-600 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">START: Format + Lấy Sub V2</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-800 bg-opacity-30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Tiến trình</h3>
              <span className="text-sm text-gray-300">Chỉnh sáng:</span>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-lg text-gray-400">0 MB</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-lg text-gray-400">990 Points/min</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-gray-600 text-white rounded-lg">
                  Cancel
                </button>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
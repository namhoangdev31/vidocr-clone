export default function ExportPage() {
  return (
    <div className="bg-gray-900 px-8 py-8 pr-40 min-h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Xuất bản
          </h1>
        </div>

        {/* Export Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Title Field */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Tiêu đề</label>
              <div className="flex-1 max-w-[200px]">
                <input
                  type="text"
                  placeholder="Nhập tiêu đề..."
                  className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Resolution */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Độ phân giải</label>
              <div className="flex-1 max-w-[200px]">
                <div className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                  Auto
                </div>
              </div>
            </div>

            {/* Frame Rate */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Tốc độ khung hình</label>
              <div className="flex-1 max-w-[200px]">
                <div className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                  Auto
                </div>
              </div>
            </div>

            {/* Encoding */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Mã hóa</label>
              <div className="flex-1 max-w-[200px]">
                <div className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                  H.264
                </div>
              </div>
            </div>

            {/* Bitrate */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Tốc độ Bit</label>
              <div className="flex-1 max-w-[200px]">
                <div className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                  Trung Bình
                </div>
              </div>
            </div>

            {/* Format */}
            <div className="flex items-center justify-between">
              <label className="text-white text-base min-w-[140px]">Định dạng</label>
              <div className="flex-1 max-w-[200px]">
                <div className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                  MP4
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="border-t border-gray-600 pt-6 mt-6">
            <div className="space-y-2">
              <div className="text-white text-base">
                Đề xuất tiêu đề:
              </div>
              <div className="text-white text-base">
                Đề xuất nội dung:
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            {/* Time Display */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white text-base">00:00:00:00</span>
            </div>

            {/* Timeline Bar */}
            <div className="flex-1 mx-4">
              <div className="w-full h-2 bg-gray-600 rounded">
                <div className="w-0 h-2 bg-blue-600 rounded"></div>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="text-white text-base">
              Timeline controls here
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Tải backup
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Tải .SRT
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Lưu
            </button>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
              Xuất bản
            </button>
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
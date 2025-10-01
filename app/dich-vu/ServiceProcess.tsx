export default function ServiceProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Cách thức hoạt động</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chuyển đổi video của bạn chỉ trong ba bước đơn giản với sức mạnh của AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 to-orange-300"></div>

          <div className="relative text-center">
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <i className="ri-upload-cloud-line w-10 h-10 flex items-center justify-center text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <span className="text-xs font-bold text-gray-600">01</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tải video lên</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
              Chỉ cần kéo thả tệp video hoặc dán URL từ bất kỳ nền tảng nào
            </p>
            <div className="mt-8">
              <div className="w-full h-32 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <i className="ri-video-line w-8 h-8 flex items-center justify-center text-purple-600 text-2xl mx-auto mb-2"></i>
                  <span className="text-sm text-gray-500">Kéo thả video</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative text-center">
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <i className="ri-ai-generate w-10 h-10 flex items-center justify-center text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <span className="text-xs font-bold text-gray-600">02</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI phát hiện & dịch</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
              AI tự động phát hiện giọng nói và văn bản, sau đó dịch sang ngôn ngữ mục tiêu
            </p>
            <div className="mt-8">
              <div className="w-full h-32 bg-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
                <div className="text-center z-10">
                  <i className="ri-brain-line w-8 h-8 flex items-center justify-center text-blue-600 text-2xl mx-auto mb-2"></i>
                  <span className="text-sm text-gray-500">AI đang xử lý</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative text-center">
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                <i className="ri-download-cloud-line w-10 h-10 flex items-center justify-center text-white text-2xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <span className="text-xs font-bold text-gray-600">03</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tải xuống hoặc chia sẻ</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
              Nhận video đã dịch kèm phụ đề sẵn sàng để xuất bản hoặc chia sẻ
            </p>
            <div className="mt-8">
              <div className="w-full h-32 bg-orange-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <i className="ri-file-download-line w-8 h-8 flex items-center justify-center text-orange-600 text-2xl mx-auto mb-2"></i>
                  <span className="text-sm text-gray-500">Sẵn sàng tải xuống</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
            Bắt đầu dịch ngay
          </button>
        </div>
      </div>
    </section>
  );
}
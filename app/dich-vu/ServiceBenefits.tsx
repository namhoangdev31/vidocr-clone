export default function ServiceBenefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao nên sử dụng công cụ này</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm sức mạnh của AI trong việc dịch video, thay đổi hoàn toàn quy trình làm việc của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200 cursor-pointer">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-time-line w-8 h-8 flex items-center justify-center text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tiết kiệm thời gian</h3>
            <p className="text-gray-600 leading-relaxed">
              Dịch hàng giờ nội dung chỉ trong vài phút với quá trình xử lý AI tự động
            </p>
            <div className="mt-6">
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-2">
                Tìm hiểu thêm
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200 cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-money-dollar-circle-line w-8 h-8 flex items-center justify-center text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tiết kiệm chi phí</h3>
            <p className="text-gray-600 leading-relaxed">
              Loại bỏ dịch vụ dịch thuật đắt đỏ và giảm chi phí dự án lên đến 90%
            </p>
            <div className="mt-6">
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                Tìm hiểu thêm
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200 cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-rocket-line w-8 h-8 flex items-center justify-center text-orange-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tăng năng suất</h3>
            <p className="text-gray-600 leading-relaxed">
              Tập trung vào việc sáng tạo nội dung trong khi AI xử lý việc dịch thuật tự động
            </p>
            <div className="mt-6">
              <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors cursor-pointer flex items-center gap-2">
                Tìm hiểu thêm
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10x</div>
              <div className="text-sm text-gray-500">Nhanh hơn</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-gray-500">Giảm chi phí</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">99%</div>
              <div className="text-sm text-gray-500">Độ chính xác</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
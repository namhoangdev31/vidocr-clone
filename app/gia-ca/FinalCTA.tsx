
'use client';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tham gia cùng hàng nghìn creator và doanh nghiệp đã tin tưởng chúng tôi. 
            Bắt đầu miễn phí ngay hôm nay!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="bg-white text-blue-600 px-10 py-5 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl flex items-center whitespace-nowrap">
              <i className="ri-play-circle-line mr-3 text-2xl"></i>
              Dùng thử miễn phí
            </button>
            
            <button className="border-2 border-white text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center whitespace-nowrap">
              <i className="ri-calendar-line mr-3 text-xl"></i>
              Đặt lịch demo
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-time-line text-2xl text-white"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">Setup trong 2 phút</h4>
              <p className="text-blue-100 text-sm">Không cần cài đặt phức tạp</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-2xl text-white"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">Bảo mật tuyệt đối</h4>
              <p className="text-blue-100 text-sm">Dữ liệu được mã hóa end-to-end</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-line text-2xl text-white"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">Hỗ trợ 24/7</h4>
              <p className="text-blue-100 text-sm">Đội ngũ chuyên gia luôn sẵn sàng</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm">
              Được tin tưởng bởi hơn 50,000 người dùng từ 180+ quốc gia
            </p>
            
            <div className="flex justify-center items-center mt-4 space-x-2 opacity-60">
              <i className="ri-star-fill text-yellow-400"></i>
              <i className="ri-star-fill text-yellow-400"></i>
              <i className="ri-star-fill text-yellow-400"></i>
              <i className="ri-star-fill text-yellow-400"></i>
              <i className="ri-star-fill text-yellow-400"></i>
              <span className="text-white ml-2">4.9/5 (2,500+ đánh giá)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

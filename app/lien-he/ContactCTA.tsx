
'use client';

export default function ContactCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full opacity-25"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Sẵn sàng biến đổi video của bạn với sức mạnh AI?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Tham gia cùng hàng nghìn nhà sáng tạo, nhà giáo dục và doanh nghiệp đã sử dụng AI để phá vỡ rào cản ngôn ngữ và tiếp cận khán giả toàn cầu. Bắt đầu hành trình dịch thuật của bạn ngay hôm nay.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
              <i className="ri-play-fill w-5 h-5 flex items-center justify-center mr-2 inline-flex"></i>
              Dùng thử miễn phí
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 whitespace-nowrap cursor-pointer">
              <i className="ri-video-line w-5 h-5 flex items-center justify-center mr-2 inline-flex"></i>
              Xem demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center gap-3">
              <i className="ri-check-line w-6 h-6 flex items-center justify-center text-green-400"></i>
              <span className="text-white/90">Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <i className="ri-time-line w-6 h-6 flex items-center justify-center text-green-400"></i>
              <span className="text-white/90">Thiết lập trong 2 phút</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <i className="ri-customer-service-line w-6 h-6 flex items-center justify-center text-green-400"></i>
              <span className="text-white/90">Hỗ trợ khách hàng 24/7</span>
            </div>
          </div>

          {/* Trusted Partners */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6">Được tin tưởng bởi các nhà lãnh đạo ngành</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-youtube-line w-8 h-8 flex items-center justify-center text-white"></i>
                </div>
                <span className="text-sm text-white/80">YouTube Certified</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-microsoft-line w-8 h-8 flex items-center justify-center text-white"></i>
                </div>
                <span className="text-sm text-white/80">Microsoft Partner</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-google-line w-8 h-8 flex items-center justify-center text-white"></i>
                </div>
                <span className="text-sm text-white/80">Google Verified</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-amazon-line w-8 h-8 flex items-center justify-center text-white"></i>
                </div>
                <span className="text-sm text-white/80">AWS Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 pt-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 font-['Pacifico']">logo</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Công cụ AI dịch văn bản trong video mạnh nhất, được tin tưởng bởi các nhà sáng tạo trên toàn thế giới.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Sản phẩm</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Tính năng</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Bảng giá</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Tài liệu API</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Tích hợp</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Tài nguyên</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Video hướng dẫn</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Cộng đồng</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Công ty</h5>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm mb-4 md:mb-0">
              © 2023 AI Video Translator. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-twitter-x-line w-5 h-5 flex items-center justify-center text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-linkedin-line w-5 h-5 flex items-center justify-center text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-youtube-line w-5 h-5 flex items-center justify-center text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-github-line w-5 h-5 flex items-center justify-center text-white"></i>
              </a>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <a href="https://readdy.ai/?origin=logo" className="text-white/60 text-xs hover:text-white/80 transition-colors cursor-pointer">
                Made with Readdy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
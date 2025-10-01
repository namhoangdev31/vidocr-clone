
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-600 via-blue-600 to-orange-400 text-white relative overflow-hidden">
      
      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Sẵn sàng biến đổi video của bạn với sức mạnh AI?
          </h2>
          <p className="text-xl mb-12 leading-relaxed text-white/90">
            Tham gia cùng hàng nghìn nhà sáng tạo, nhà giáo dục và doanh nghiệp đã sử dụng AI để phá vỡ rào cản ngôn ngữ và tiếp cận khán giả toàn cầu. Bắt đầu hành trình dịch thuật của bạn ngay hôm nay.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center justify-center">
              <i className="ri-play-fill mr-2"></i>
              Dùng thử miễn phí
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors whitespace-nowrap flex items-center justify-center">
              <i className="ri-tv-line mr-2"></i>
              Xem demo
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="mb-16">
            <p className="text-white/80 mb-8 font-medium">Được tin tương bởi các nhà lãnh đạo ngành</p>
            <div className="flex justify-center items-center gap-12 flex-wrap">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-youtube-fill text-2xl"></i>
                </div>
                <span className="text-white/90 font-medium">YouTube Certified</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-microsoft-fill text-2xl"></i>
                </div>
                <span className="text-white/90 font-medium">Microsoft Partner</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-google-fill text-2xl"></i>
                </div>
                <span className="text-white/90 font-medium">Google Verified</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-amazon-fill text-2xl"></i>
                </div>
                <span className="text-white/90 font-medium">AWS Powered</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Link href="/" className="flex items-center mb-6">
                <span className="text-white font-['Pacifico'] text-2xl">logo</span>
              </Link>
              <p className="text-white/80 mb-6 leading-relaxed">
                Công cụ AI dịch văn bản trong video mạnh nhất, được tin tưởng bởi các nhà sáng tạo trên toàn thế giới.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-twitter-x-fill text-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-linkedin-fill text-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-youtube-fill text-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-github-fill text-lg"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Sản phẩm</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/features" className="text-white/80 hover:text-white transition-colors">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-white/80 hover:text-white transition-colors">
                    Tài liệu API
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-white/80 hover:text-white transition-colors">
                    Tích hợp
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Tài nguyên</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-white/80 hover:text-white transition-colors">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-white/80 hover:text-white transition-colors">
                    Video hướng dẫn
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-white/80 hover:text-white transition-colors">
                    Cộng đồng
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Công ty</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white/80 hover:text-white transition-colors">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/80 text-sm">
                © 2023 AI Video Translator. Bảo lưu mọi quyền.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-twitter-x-fill text-sm"></i>
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-linkedin-fill text-sm"></i>
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-youtube-fill text-sm"></i>
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <i className="ri-github-fill text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

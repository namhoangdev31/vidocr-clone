
'use client';

import Link from 'next/link';

export default function LibraryHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <i className="ri-book-open-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Thư Viện Tài Nguyên
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Khám Phá
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Thư Viện Video
                </span>
                Đa Ngôn Ngữ
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Tìm hiểu cách sử dụng AI để dịch video chuyên nghiệp qua các case study, hướng dẫn chi tiết và ví dụ thực tế từ khách hàng thành công.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#portfolio" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center whitespace-nowrap cursor-pointer">
                Xem Portfolio
              </Link>
              <Link href="#blog" className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-center whitespace-nowrap cursor-pointer">
                Đọc Blog
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">Video Mẫu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600 mt-1">Case Study</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600 mt-1">Hướng Dẫn</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20video%20library%20showcase%20with%20multiple%20screens%20displaying%20translated%20videos%20in%20different%20languages%2C%20modern%20digital%20workspace%20with%20AI%20translation%20interface%2C%20clean%20minimalist%20design%20with%20blue%20and%20purple%20gradient%20colors%2C%20high-tech%20atmosphere%20with%20floating%20video%20thumbnails%20and%20language%20flags&width=600&height=400&seq=library-hero-1&orientation=landscape"
                alt="Thư viện video đa ngôn ngữ"
                className="w-full h-auto rounded-2xl shadow-2xl object-top"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

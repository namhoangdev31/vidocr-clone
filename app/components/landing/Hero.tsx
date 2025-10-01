
'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-16 pb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Công cụ dịch vụ bán hàng
            <br />
            <span className="text-blue-600">quản lý</span> mạnh mẽ nhất
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Nền tảng quản lý bán hàng toàn diện giúp doanh nghiệp tối ưu hóa quy trình kinh doanh và tăng trưởng doanh thu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/get-started" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap inline-flex items-center justify-center">
              Bắt đầu ngay
            </Link>
            <Link href="/demo" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap inline-flex items-center justify-center">
              Xem demo
            </Link>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="p-4">
              <img 
                src="https://dichtudong.com/vi-vn/assets/img/hero/app-dashboard.png"
                alt="App Dashboard"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
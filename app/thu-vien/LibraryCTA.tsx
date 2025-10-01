
'use client';

import Link from 'next/link';

export default function LibraryCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Sẵn Sàng Bắt Đầu
            <span className="block text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
              Hành Trình Dịch Video?
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Tham gia cộng đồng hơn 50,000 creator và doanh nghiệp đã tin tưởng sử dụng dịch vụ dịch video AI của chúng tôi để phát triển toàn cầu
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-rocket-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bắt Đầu Ngay</h3>
              <p className="text-blue-200">Chỉ 3 phút để có video dịch đầu tiên</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Hỗ Trợ 24/7</h3>
              <p className="text-blue-200">Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Đảm Bảo Chất Lượng</h3>
              <p className="text-blue-200">Hoàn tiền 100% nếu không hài lòng</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dang-ky" className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              Dùng Thử Miễn Phí
            </Link>
            <Link href="/lien-he" className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300 whitespace-nowrap cursor-pointer">
              Liên Hệ Tư Vấn
            </Link>
          </div>
          
          <div className="mt-8 text-blue-200 text-sm">
            <p>✅ Không cần thẻ tín dụng • ✅ Hủy bất cứ lúc nào • ✅ Hỗ trợ 100+ ngôn ngữ</p>
          </div>
        </div>
      </div>
    </section>
  );
}

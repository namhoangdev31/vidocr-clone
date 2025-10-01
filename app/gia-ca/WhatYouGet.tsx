
'use client';

export default function WhatYouGet() {
  const features = [
    'Phần mềm trí tuệ nhân tạo tiên tiến nhất',
    'Hỗ trợ khách hàng 24/7',
    'Chính sách hoàn tiền trong 7 ngày',
    'Cập nhật tính năng miễn phí',
    'Xử lý dữ liệu bảo mật tuyệt đối',
    'API tích hợp dễ dàng'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bạn nhận được gì?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Không chỉ là công cụ dịch thuật, chúng tôi mang đến giải pháp toàn diện
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white font-bold"></i>
                  </div>
                  <span className="text-lg text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Và còn nhiều hơn thế...
              </h3>
              <p className="text-gray-600 mb-6">
                Hàng trăm tính năng khác đang chờ bạn khám phá. Tham gia cộng đồng hơn 50,000 người dùng đã tin tưởng chúng tôi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap">
                  Dùng thử miễn phí
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-phone-line mr-2"></i>
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                <img 
                  src="https://readdy.ai/api/search-image?query=Advanced%20AI%20technology%20visualization%2C%20futuristic%20interface%20with%20glowing%20elements%2C%20network%20connections%20and%20data%20flow%2C%20modern%20tech%20illustration%20with%20blue%20and%20purple%20colors&width=400&height=400&seq=what-you-get-1&orientation=squarish"
                  alt="AI Technology"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Công nghệ AI hàng đầu
                </h4>
                <p className="text-gray-600">
                  Được phát triển bởi đội ngũ chuyên gia AI từ các trường đại học hàng đầu thế giới
                </p>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="ri-rocket-line text-2xl text-white"></i>
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="ri-star-line text-xl text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

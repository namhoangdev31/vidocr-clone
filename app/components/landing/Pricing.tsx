
'use client';

export default function Pricing() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bảng giá
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chọn gói dịch vụ phù hợp với quy mô và nhu cầu của doanh nghiệp
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Left Side Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Tiếp cận thêm <span className="text-orange-500">hàng triệu khách hàng mới</span> với chỉ 5% chi phí
              </h3>
              
              <div className="space-y-4 text-gray-700 mb-8">
                <p>- Đăng ký miễn phí chỉ với một nhấn, không yêu cầu thông tin hoặc bất kỳ thẻ tín dụng nào!</p>
                <p>- Tặng <span className="text-orange-500 font-semibold">5,000</span> Tokens ngay sau khi đăng ký!</p>
                <p>- Tặng thêm <span className="text-orange-500 font-semibold">50,000</span> Tokens cho lần nạp đầu tiên!</p>
              </div>
              
              <div className="flex items-center gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    400<span className="text-orange-500 text-2xl">+</span>
                  </div>
                  <div className="text-sm text-gray-600">%<br/>Khách hàng tiếp cận</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    100<span className="text-orange-500 text-2xl">+</span>
                  </div>
                  <div className="text-sm text-gray-600">Ngôn ngữ hỗ trợ</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Pricing Cards */}
            <div className="space-y-6">
              {/* Basic Plan */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Dịch âm thanh
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      <sup className="text-sm">đ</sup>499<span className="text-sm font-normal text-gray-600">/Phút</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Chỉnh sửa thông minh
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Lồng tiếng nâng cao AI
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Dịch nâng cao AI
                  </div>
                </div>
                
                <button className="w-full bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors flex items-center justify-center">
                  Dịch ngay
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Dịch văn bản
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      <sup className="text-sm">đ</sup>1199<span className="text-sm font-normal text-gray-600">/Phút</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Chỉnh sửa thông minh
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Lồng tiếng nâng cao AI
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Dịch nâng cao AI
                  </div>
                </div>
                
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                  Dịch ngay
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

export default function ServicePricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Hoàn hảo cho nhà sáng tạo cá nhân',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 video mỗi tháng',
        'Tối đa 10 phút mỗi video',
        '10 ngôn ngữ',
        'Kiểu phụ đề cơ bản',
        'Xuất MP4',
        'Hỗ trợ cộng đồng'
      ],
      buttonText: 'Bắt đầu miễn phí',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Dành cho nhà sáng tạo nội dung và nhóm nhỏ',
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        'Video không giới hạn',
        'Tối đa 60 phút mỗi video',
        '50+ ngôn ngữ',
        'Kiểu phụ đề tùy chỉnh',
        'Tất cả định dạng xuất',
        'Hỗ trợ ưu tiên',
        'Truy cập API',
        'Xử lý hàng loạt'
      ],
      buttonText: 'Dùng thử Pro',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Dành cho tổ chức lớn và đại lý',
      monthlyPrice: 99,
      yearlyPrice: 82,
      features: [
        'Không giới hạn mọi thứ',
        'Không giới hạn thời lượng',
        'Huấn luyện AI tùy chỉnh',
        'Giải pháp white-label',
        'Quản lý tài khoản chuyên dụng',
        'Đảm bảo SLA',
        'Tích hợp tùy chỉnh',
        'Phân tích nâng cao'
      ],
      buttonText: 'Liên hệ bán hàng',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá cả đơn giản, minh bạch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Chọn gói hoàn hảo cho nhu cầu dịch video của bạn. Tất cả gói đều bao gồm các tính năng AI cốt lõi.
          </p>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                !isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hàng tháng
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap cursor-pointer relative ${
                isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hàng năm
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Tiết kiệm 17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative ${
              plan.popular 
                ? 'border-purple-200 bg-gradient-to-b from-purple-50 to-white transform scale-105' 
                : 'border-gray-200 bg-white hover:scale-105'
            } border`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Phổ biến nhất
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-500 ml-2">/tháng</span>
                </div>
                <button className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center text-green-500 flex-shrink-0"></i>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cần giải pháp tùy chỉnh?</h3>
            <p className="text-gray-600 mb-6">
              Liên hệ nhóm bán hàng để biết giá doanh nghiệp, giảm giá khối lượng và tích hợp tùy chỉnh.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <i className="ri-phone-line w-5 h-5 flex items-center justify-center text-purple-600"></i>
                <span className="text-gray-700">Hỗ trợ điện thoại 24/7</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
                <span className="text-gray-700">Đảm bảo SLA</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <i className="ri-settings-line w-5 h-5 flex items-center justify-center text-orange-600"></i>
                <span className="text-gray-700">Tích hợp tùy chỉnh</span>
              </div>
            </div>
            <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer">
              Liên hệ bán hàng doanh nghiệp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
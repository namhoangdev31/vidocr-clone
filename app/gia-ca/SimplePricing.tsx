
'use client';

export default function SimplePricing() {
  const plans = [
    {
      name: 'Miễn phí',
      price: '$0',
      period: '/tháng',
      description: 'Hoàn hảo để bắt đầu',
      features: [
        '5 video/tháng',
        '3 ngôn ngữ cơ bản',
        'Chất lượng HD',
        'Hỗ trợ email'
      ],
      buttonText: 'Bắt đầu miễn phí',
      buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/tháng',
      description: 'Cho creator chuyên nghiệp',
      features: [
        '100 video/tháng',
        '50+ ngôn ngữ',
        'Chất lượng 4K',
        'API access',
        'Hỗ trợ ưu tiên',
        'Custom branding'
      ],
      buttonText: 'Chọn gói Pro',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/tháng',
      description: 'Cho doanh nghiệp lớn',
      features: [
        'Video không giới hạn',
        'Tất cả ngôn ngữ',
        'Chất lượng 8K',
        'Dedicated manager',
        'SLA 99.9%',
        'Custom AI training',
        'On-premise deployment'
      ],
      buttonText: 'Liên hệ sales',
      buttonClass: 'bg-purple-600 text-white hover:bg-purple-700',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bảng giá đơn giản, minh bạch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Không có phí ẩn, không cam kết dài hạn. Bắt đầu miễn phí và nâng cấp khi cần thiết.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative rounded-2xl p-8 ${
              plan.popular 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 shadow-xl scale-105' 
                : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap ${plan.buttonClass}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Tất cả gói đều bao gồm bảo mật SSL, backup tự động và hỗ trợ kỹ thuật
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <i className="ri-shield-check-line mr-2 text-green-500"></i>
              Bảo mật SSL
            </div>
            <div className="flex items-center">
              <i className="ri-refresh-line mr-2 text-blue-500"></i>
              Backup tự động
            </div>
            <div className="flex items-center">
              <i className="ri-customer-service-line mr-2 text-purple-500"></i>
              Hỗ trợ 24/7
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

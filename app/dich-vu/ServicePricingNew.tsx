
export default function ServicePricingNew() {
  const plans = [
    {
      name: 'Miễn Phí',
      price: '0',
      tag: 'Dùng thử',
      tagColor: 'bg-gray-500',
      features: [
        '5 video/tháng (tối đa 2 phút)',
        'Chất lượng cơ bản',
        'Watermark Dichtuong.com',
        'Hỗ trợ 3 ngôn ngữ',
        'Hỗ trợ email'
      ],
      buttonText: 'Dùng thử miễn phí',
      buttonStyle: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50',
      isPopular: false
    },
    {
      name: 'Cơ Bản',
      price: '499',
      tag: 'Phổ biến',
      tagColor: 'bg-blue-500',
      features: [
        '50 video/tháng (tối đa 30 phút)',
        'Chất lượng HD',
        'Không watermark',
        'Hỗ trợ 15 ngôn ngữ',
        'Xuất nhiều định dạng',
        'Hỗ trợ ưu tiên',
        'API cơ bản'
      ],
      buttonText: 'Chọn gói này',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      isPopular: true
    },
    {
      name: 'Chuyên Nghiệp',
      price: '1199',
      tag: 'Tốt nhất',
      tagColor: 'bg-purple-500',
      features: [
        'Không giới hạn video',
        'Chất lượng 4K',
        'Không watermark',
        'Hỗ trợ 25+ ngôn ngữ',
        'AI voice cloning',
        'Hỗ trợ 24/7',
        'API không giới hạn',
        'Tùy chỉnh cao cấp'
      ],
      buttonText: 'Liên hệ tư vấn',
      buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700',
      isPopular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Dịch vụ với mức giá rẻ nhất</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả gói đều đi kèm với công nghệ AI tiên tiến nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
              plan.isPopular 
                ? 'border-blue-200 bg-blue-50 shadow-xl scale-105' 
                : 'border-gray-200 bg-white hover:shadow-xl'
            }`}>
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${plan.tagColor} text-white px-6 py-2 rounded-full text-sm font-semibold`}>
                {plan.tag}
              </div>
              
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500">₫</span>
                  <span className="text-5xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-lg text-gray-500 ml-1">/tháng</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <i className="ri-check-line w-5 h-5 flex items-center justify-center text-green-500 font-bold"></i>
                    </div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">💳 Hỗ trợ thanh toán: Visa, Mastercard, Internet Banking, Ví điện tử</p>
          <p className="text-sm text-gray-500">* Giá đã bao gồm VAT. Có thể hủy bất kỳ lúc nào.</p>
        </div>
      </div>
    </section>
  );
}

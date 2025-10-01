
'use client';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: 'ri-time-line',
      title: 'Tiết kiệm thời gian',
      description: 'Giảm 90% thời gian dịch thuật so với phương pháp truyền thống',
      color: 'blue'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Tiết kiệm chi phí',
      description: 'Chỉ 5% chi phí so với thuê dịch giả chuyên nghiệp',
      color: 'green'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Tăng năng suất',
      description: 'Xử lý hàng trăm video cùng lúc với chất lượng đồng nhất',
      color: 'purple'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Công nghệ AI tiên tiến giúp bạn tiếp cận khách hàng toàn cầu một cách hiệu quả nhất
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 bg-gradient-to-r ${
                benefit.color === 'blue' ? 'from-blue-500 to-blue-600' :
                benefit.color === 'green' ? 'from-green-500 to-green-600' :
                'from-purple-500 to-purple-600'
              } rounded-2xl flex items-center justify-center mb-6`}>
                <i className={`${benefit.icon} text-2xl text-white`}></i>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Ngôn ngữ hỗ trợ</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Tiết kiệm chi phí</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600">Video đã xử lý</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600">Độ chính xác</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

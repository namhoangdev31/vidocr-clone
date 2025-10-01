
'use client';

export default function Features() {
  const features = [
    {
      icon: 'ri-bar-chart-line',
      title: 'Báo cáo chi tiết',
      description: 'Theo dõi doanh thu, đơn hàng và hiệu suất kinh doanh với các báo cáo trực quan và chi tiết.'
    },
    {
      icon: 'ri-shopping-cart-line', 
      title: 'Quản lý đơn hàng',
      description: 'Xử lý đơn hàng nhanh chóng từ tiếp nhận đến giao hàng với quy trình tự động hóa.'
    },
    {
      icon: 'ri-team-line',
      title: 'Quản lý khách hàng',
      description: 'Lưu trữ thông tin khách hàng, lịch sử mua hàng và xây dựng mối quan hệ bền vững.'
    },
    {
      icon: 'ri-database-line',
      title: 'Quản lý kho hàng',
      description: 'Theo dõi tồn kho, nhập xuất hàng và cảnh báo tự động khi hết hàng.'
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Ứng dụng di động',
      description: 'Quản lý kinh doanh mọi lúc mọi nơi với ứng dụng di động thân thiện.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Bảo mật cao',
      description: 'Dữ liệu được bảo vệ với công nghệ mã hóa tiên tiến và sao lưu tự động.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hệ thống quản lý toàn diện với các tính năng mạnh mẽ giúp tối ưu hóa quy trình kinh doanh
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <i className={`${feature.icon} text-2xl text-blue-600 group-hover:text-white transition-colors`}></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

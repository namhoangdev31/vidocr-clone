export default function ServiceStats() {
  const stats = [
    {
      icon: 'ri-user-line',
      number: '128K',
      title: 'Người dùng tích cực',
      subtitle: 'Nhà sáng tạo trên toàn thế giới',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'ri-video-line',
      number: '2.8M',
      title: 'Video đã dịch',
      subtitle: 'Và vẫn đang tăng',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'ri-global-line',
      number: '52',
      title: 'Ngôn ngữ hỗ trợ',
      subtitle: 'Đang bổ sung thêm',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: 'ri-time-line',
      number: '457K',
      title: 'Giờ tiết kiệm',
      subtitle: 'Chỉ tháng này',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Được tin tưởng bởi các nhà sáng tạo toàn cầu</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Những con số thực từ người dùng thực tạo ra tác động thực với công nghệ dịch video AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <i className={`${stat.icon} w-10 h-10 flex items-center justify-center text-white text-2xl`}></i>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-mono">{stat.number}</div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">{stat.title}</h3>
              <p className="text-gray-400 text-sm">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-800/50 rounded-3xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">#1 Được đánh giá cao</h4>
              <p className="text-gray-400">Công cụ dịch AI</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-rocket-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Tăng trưởng nhanh</h4>
              <p className="text-gray-400">1000+ người dùng mới mỗi ngày</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line w-8 h-8 flex items-center justify-center text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">99.9% Uptime</h4>
              <p className="text-gray-400">Luôn sẵn sàng</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
            Tham gia cộng đồng
          </button>
        </div>
      </div>
    </section>
  );
}
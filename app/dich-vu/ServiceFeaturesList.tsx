
export default function ServiceFeaturesList() {
  const features = [
    {
      icon: 'ri-brain-line',
      title: 'AI Thông Minh',
      description: 'Công nghệ AI tiên tiến nhận diện và dịch thuật chính xác 99.9%',
      color: 'blue'
    },
    {
      icon: 'ri-time-line',
      title: 'Tiết Kiệm Thời Gian',
      description: 'Dịch video chỉ trong vài phút thay vì hàng giờ làm thủ công',
      color: 'green'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Chi Phí Thấp',
      description: 'Giảm 90% chi phí so với thuê dịch thuật viên chuyên nghiệp',
      color: 'orange'
    },
    {
      icon: 'ri-global-line',
      title: '25+ Ngôn Ngữ',
      description: 'Hỗ trợ dịch thuật đa ngôn ngữ phổ biến trên thế giới',
      color: 'purple'
    },
    {
      icon: 'ri-hd-line',
      title: 'Chất Lượng Cao',
      description: 'Giữ nguyên chất lượng video gốc, xuất file nhiều định dạng',
      color: 'pink'
    },
    {
      icon: 'ri-cloud-line',
      title: 'Xử Lý Cloud',
      description: 'Xử lý trên cloud mạnh mẽ, không cần cài đặt phần mềm',
      color: 'cyan'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 bg-blue-500 text-blue-600',
      green: 'bg-green-50 border-green-200 bg-green-500 text-green-600',
      orange: 'bg-orange-50 border-orange-200 bg-orange-500 text-orange-600',
      purple: 'bg-purple-50 border-purple-200 bg-purple-500 text-purple-600',
      pink: 'bg-pink-50 border-pink-200 bg-pink-500 text-pink-600',
      cyan: 'bg-cyan-50 border-cyan-200 bg-cyan-500 text-cyan-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tại Sao Chọn Dịch Vụ Của Chúng Tôi?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm công nghệ dịch thuật video hiện đại nhất với AI, mang lại hiệu quả và chất lượng tốt nhất cho dự án của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color).split(' ');
            return (
              <div key={index} className={`p-8 rounded-2xl border ${colors[0]} ${colors[1]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}>
                <div className={`w-16 h-16 ${colors[2]} rounded-2xl flex items-center justify-center mb-6`}>
                  <i className={`${feature.icon} w-8 h-8 flex items-center justify-center text-white text-2xl`}></i>
                </div>
                <h3 className={`text-xl font-bold mb-4 ${colors[3]}`}>{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap font-semibold text-lg">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
}

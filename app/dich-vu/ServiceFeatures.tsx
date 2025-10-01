export default function ServiceFeatures() {
  const features = [
    {
      icon: 'ri-eye-line',
      title: 'OCR thông minh',
      description: 'Nhận dạng ký tự quang học tiên tiến phát hiện và trích xuất văn bản chính xác từ mọi khung hình video',
      color: 'purple'
    },
    {
      icon: 'ri-mic-line',
      title: 'Dịch giọng nói chính xác',
      description: 'Xử lý ngôn ngữ tự nhiên hiểu ngữ cảnh và cung cấp bản dịch giọng nói chính xác',
      color: 'blue'
    },
    {
      icon: 'ri-subtitles-line',
      title: 'Tạo phụ đề tự động',
      description: 'Tự động tạo phụ đề có thời gian hoàn hảo với font chữ và kiểu dáng có thể tùy chỉnh',
      color: 'orange'
    },
    {
      icon: 'ri-file-download-line',
      title: 'Xuất nhiều định dạng',
      description: 'Tải xuống định dạng MP4, MOV, SRT, VTT và nhiều định dạng khác tương thích với mọi nền tảng',
      color: 'green'
    },
    {
      icon: 'ri-code-line',
      title: 'Tích hợp API',
      description: 'Tích hợp liền mạch khả năng dịch thuật vào quy trình làm việc hiện tại với API mạnh mẽ của chúng tôi',
      color: 'indigo'
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Không cần tải ứng dụng',
      description: 'Làm việc trực tiếp trong trình duyệt - không cần cài đặt, không cần tải xuống, truy cập ngay lập tức ở mọi nơi',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tính năng cốt lõi</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mọi thứ bạn cần để dịch và bản địa hóa nội dung video với chất lượng chuyên nghiệp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${getColorClasses(feature.color).split(' ')[2]} cursor-pointer group`}>
              <div className={`w-16 h-16 ${getColorClasses(feature.color).split(' ')[0]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${feature.icon} w-8 h-8 flex items-center justify-center ${getColorClasses(feature.color).split(' ')[1]} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              <div className="mt-6">
                <button className={`${getColorClasses(feature.color).split(' ')[1]} font-semibold hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2`}>
                  Tìm hiểu thêm
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tại sao chọn tính năng của chúng tôi?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Tỷ lệ chính xác</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Định dạng tệp</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Xử lý</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Độ dài video</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
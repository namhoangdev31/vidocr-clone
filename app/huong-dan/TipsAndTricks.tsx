type ColorKey = 'purple' | 'blue' | 'orange' | 'green' | 'indigo' | 'pink';

export default function TipsAndTricks() {
  const tips: Array<{
    icon: string;
    title: string;
    description: string;
    color: ColorKey;
  }> = [
    {
      icon: 'ri-mic-line',
      title: 'Chọn giọng đọc phù hợp',
      description: 'Lựa chọn giọng nam/nữ, tốc độ đọc và giọng địa phương để phù hợp với nội dung video',
      color: 'purple'
    },
    {
      icon: 'ri-volume-up-line',
      title: 'Đảm bảo âm thanh rõ ràng',
      description: 'Video có âm thanh rõ ràng, ít tiếng ồn sẽ cho kết quả dịch chính xác hơn',
      color: 'blue'
    },
    {
      icon: 'ri-text',
      title: 'Tùy chỉnh phụ đề đẹp mắt',
      description: 'Sử dụng font chữ dễ đọc, màu sắc tương phản và vị trí phù hợp',
      color: 'orange'
    },
    {
      icon: 'ri-time-line',
      title: 'Kiểm tra timing phụ đề',
      description: 'Đảm bảo phụ đề xuất hiện đúng thời điểm và tốc độ đọc phù hợp',
      color: 'green'
    },
    {
      icon: 'ri-file-list-line',
      title: 'Sử dụng batch processing',
      description: 'Xử lý nhiều video cùng lúc để tiết kiệm thời gian cho dự án lớn',
      color: 'indigo'
    },
    {
      icon: 'ri-download-line',
      title: 'Chọn định dạng xuất phù hợp',
      description: 'MP4 cho web, MOV cho chỉnh sửa, SRT cho chỉ phụ đề',
      color: 'pink'
    }
  ];
  
  const colorMap: Record<ColorKey, string> = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600'
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Mẹo và thủ thuật</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những bí quyết giúp bạn tận dụng tối đa công cụ và có kết quả dịch thuật hoàn hảo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border cursor-pointer group">
              <div className={`w-16 h-16 ${colorMap[tip.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${tip.icon} w-8 h-8 flex items-center justify-center text-2xl`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                {tip.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {tip.description}
              </p>
              
              <div className="mt-6">
                <button className="text-purple-600 font-semibold hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2 group-hover:gap-3 transition-all">
                  Tìm hiểu thêm
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mẹo chuyên nghiệp</h3>
            <p className="text-gray-600">Những bí quyết từ các chuyên gia về dịch thuật video</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-lightbulb-line w-6 h-6 flex items-center justify-center text-purple-600"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Chuẩn bị nội dung tốt</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Đọc kịch bản rõ ràng, tránh nói quá nhanh, sử dụng từ ngữ đơn giản. 
                    Tạm dừng giữa các câu để AI dễ nhận diện.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-settings-line w-6 h-6 flex items-center justify-center text-blue-600"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Tối ưu cài đặt</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Chọn ngôn ngữ gốc chính xác, điều chỉnh tốc độ giọng đọc phù hợp với đối tượng,
                    kiểm tra trước một đoạn ngắn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
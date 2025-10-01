
'use client';

export default function CoreFeatures() {
  const features = [
    {
      title: 'Nhận diện giọng nói thông minh',
      description: 'AI tiên tiến nhận diện và chuyển đổi giọng nói với độ chính xác 99%',
      icon: 'ri-mic-line',
      color: 'blue'
    },
    {
      title: 'Dịch thuật ngữ cảnh',
      description: 'Hiểu ngữ cảnh và dịch thuật chính xác theo từng lĩnh vực chuyên môn',
      icon: 'ri-translate-2',
      color: 'green'
    },
    {
      title: 'Giữ nguyên cảm xúc',
      description: 'Bảo toàn giọng điệu, cảm xúc và phong cách của người nói gốc',
      icon: 'ri-emotion-line',
      color: 'purple'
    },
    {
      title: 'Đồng bộ môi miệng',
      description: 'Công nghệ lip-sync tiên tiến tạo video tự nhiên như bản gốc',
      icon: 'ri-vidicon-line',
      color: 'red'
    },
    {
      title: 'Xử lý hàng loạt',
      description: 'Dịch nhiều video cùng lúc, tiết kiệm thời gian và công sức',
      icon: 'ri-stack-line',
      color: 'orange'
    },
    {
      title: 'Chỉnh sửa linh hoạt',
      description: 'Công cụ editing mạnh mẽ để tinh chỉnh kết quả theo ý muốn',
      icon: 'ri-edit-line',
      color: 'pink'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tính năng cốt lõi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Công nghệ AI hàng đầu thế giới mang đến trải nghiệm dịch thuật video hoàn hảo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                feature.color === 'green' ? 'bg-green-100 text-green-600' :
                feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                feature.color === 'red' ? 'bg-red-100 text-red-600' :
                feature.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                'bg-pink-100 text-pink-600'
              }`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
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

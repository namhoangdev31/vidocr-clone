'use client';

export default function AdvancedFeatures() {
  const features = [
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/01.png',
      title: 'Dễ dàng sử dụng',
      description: 'Chỉ cần "KÉO - THẢ" mọi việc còn lại hãy để AI làm thay cho bạn, công việc được thực hiện tự động ngay trên trình duyệt!'
    },
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/02.png',
      title: 'Dịch thuật ChatGPT',
      description: 'Sử dụng AI Engine thế hệ 5 mới nhất tích hợp dịch thuật bằng ChatGPT cho khả năng dịch tương đương con người!'
    },
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/03.png',
      title: 'Toàn cầu hóa nội dung',
      description: 'Dịch Video của bạn sang nhiều ngôn ngữ khác nhau với độ bản địa hóa từ ngữ cao có thể tăng đến 400% lượng khách hàng tiếp cận!'
    },
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/04.png',
      title: 'Tiết kiệm thời gian và chi phí',
      description: 'Công cụ hỗ trợ dịch - chỉnh sửa - lồng tiếng Video hoàn toàn tự động do đó tiết kiệm đến 97% thời gian làm việc và giảm chi phí gấp 10 lần dịch thủ công!'
    },
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/05.png',
      title: 'Hỗ trợ đa ngôn ngữ',
      description: 'Chúng tôi hỗ trợ hơn 100+ ngôn ngữ trên thế giới giúp bạn có thể dịch bất cứ Video nào mà không cần biết ngoại ngữ!'
    },
    {
      icon: 'https://dichtudong.com/assets/img/fancy-icon-box/06.png',
      title: 'Kết hợp đa ứng dụng AI',
      description: 'Cung cấp hàng loạt công cụ AI thông minh để bạn có thể chỉnh sửa Video cực nhanh chóng ngay trên trình duyệt!'
    }
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
            Chúng Tôi Giúp Gì Cho Bạn
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto">
            Công cụ dịch văn bản trong Video thế hệ 5 thông minh và hiệu quả nhất hiện tại
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mb-6">
                <img 
                  src={feature.icon}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                />
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
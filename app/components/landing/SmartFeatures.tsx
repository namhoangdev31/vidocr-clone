
'use client';

export default function SmartFeatures() {
  const features = [
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/01.png",
      title: "Dễ Dàng Sử Dụng",
      description: "Chỉ cần \"KÉO - THẢ\" mọi việc còn lại hãy để AI làm thay cho bạn, công việc được thực hiện tự động ngay trên trình duyệt!"
    },
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/02.png", 
      title: "Dịch Thuật ChatGPT",
      description: "Sử dụng AI Engine thế hệ 5 mới nhất tích hợp dịch thuật bằng ChatGPT cho khả năng dịch tương đương con người!"
    },
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/03.png",
      title: "Toàn Cầu Hóa Nội Dung", 
      description: "Dịch Video của bạn sang nhiều ngôn ngữ khác nhau với độ bản địa hóa từ ngữ cao có thể tăng đến 400% lượng khách hàng tiếp cận!"
    },
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/04.png",
      title: "Tiết Kiệm Thời Gian Và Chi Phí",
      description: "Công cụ hỗ trợ dịch - chỉnh sửa - lồng tiếng Video hoàn toàn tự động do đó tiết kiệm đến 97% thời gian làm việc và giảm chi phí gấp 10 lần dịch thủ công!"
    },
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/05.png",
      title: "Hỗ Trợ Đa Ngôn Ngữ",
      description: "Chúng tôi hỗ trợ hơn 100+ ngôn ngữ trên thế giới giúp bạn có thể dịch bất cứ Video nào mà không cần biết ngoại ngữ!"
    },
    {
      icon: "https://dichtudong.com/assets/img/fancy-icon-box/06.png",
      title: "Kết Hợp Đa Ứng Dụng AI",
      description: "Cung cấp hàng loạt công cụ AI thông minh để bạn có thể chỉnh sửa Video cực nhanh chóng ngay trên trình duyệt!"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
            Tính năng thông minh
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bạn chỉ cần tải lên việc còn lại AI lo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Khám phá các tính năng AI tiên tiến giúp bạn dịch thuật và chỉnh sửa video một cách hoàn toàn tự động
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <img 
                  src={feature.icon} 
                  alt={feature.title}
                  className="w-full h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap inline-flex items-center">
            Trải nghiệm ngay
            <i className="ri-arrow-right-line ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

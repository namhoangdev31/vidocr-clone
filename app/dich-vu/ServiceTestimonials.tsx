'use client';

import { useState } from 'react';

export default function ServiceTestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'YouTube Content Creator',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20female%20content%20creator%20headshot%2C%20Asian%20woman%20smiling%2C%20modern%20studio%20background%2C%20confident%20expression%2C%20YouTuber%20portrait&width=80&height=80&seq=avatar-0&orientation=squarish',
      quote: 'Công cụ AI này đã hoàn toàn thay đổi kênh của tôi! Giờ tôi có thể tiếp cận khán giả bằng hơn 10 ngôn ngữ. Số lượng người đăng ký của tôi đã tăng gấp ba chỉ trong 3 tháng.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Corporate Training Manager',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20male%20business%20manager%20headshot%2C%20Hispanic%20man%20in%20suit%2C%20corporate%20office%20background%2C%20confident%20smile%2C%20training%20executive&width=80&height=80&seq=avatar-1&orientation=squarish',
      quote: 'Chương trình đào tạo toàn cầu của chúng tôi trở nên hiệu quả hơn rất nhiều. Nhân viên thích có nội dung bằng ngôn ngữ mẹ đẻ. ROI ngay lập tức.'
    },
    {
      name: 'Emma Thompson',
      role: 'TikTok Influencer',
      avatar: 'https://readdy.ai/api/search-image?query=Young%20female%20social%20media%20influencer%20portrait%2C%20creative%20background%2C%20trendy%20style%2C%20confident%20expression%2C%20TikTok%20creator&width=80&height=80&seq=avatar-2&orientation=squarish',
      quote: 'Thay đổi cuộc chơi cho nội dung viral! Video của tôi giờ tiếp cận khán giả quốc tế ngay lập tức. Chất lượng giọng nói AI thật không thể tin được.'
    },
    {
      name: 'David Park',
      role: 'Online Educator',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20male%20educator%20headshot%2C%20Asian%20man%20with%20glasses%2C%20classroom%20background%2C%20friendly%20expression%2C%20online%20teacher&width=80&height=80&seq=avatar-3&orientation=squarish',
      quote: 'Các khóa học trực tuyến của tôi giờ có thể tiếp cận toàn thế giới. Học viên đánh giá cao việc có bài học bằng ngôn ngữ của họ. Tỷ lệ hoàn thành khóa học tăng 40%.'
    },
    {
      name: 'Lisa Weber',
      role: 'Marketing Director',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20female%20marketing%20director%20headshot%2C%20blonde%20woman%20in%20business%20attire%2C%20modern%20office%20background%2C%20executive%20portrait&width=80&height=80&seq=avatar-4&orientation=squarish',
      quote: 'Các chiến dịch video marketing của chúng tôi giờ có tầm với toàn cầu. Chỉ riêng việc tiết kiệm thời gian đã đáng giá đầu tư. Chất lượng luôn xuất sắc.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Người dùng nói gì về chúng tôi</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn nhà sáng tạo và doanh nghiệp hài lòng đang chuyển đổi nội dung video của họ
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-96 flex items-center justify-center p-12">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 p-12 flex items-center justify-center transition-all duration-500 ${
                    index === activeTestimonial 
                      ? 'opacity-100 transform translate-x-0' 
                      : 'opacity-0 transform translate-x-full'
                  }`}
                >
                  <div className="text-center max-w-3xl">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="ri-star-fill w-5 h-5 flex items-center justify-center text-yellow-400"></i>
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full object-top shadow-lg" 
                      />
                      <div className="text-left">
                        <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                        <div className="text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeTestimonial 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill w-5 h-5 flex items-center justify-center text-yellow-400"></i>
              ))}
            </div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600 mb-2">Người dùng hài lòng</div>
            <div className="text-sm text-gray-500">Tăng hàng ngày</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">1M+</div>
            <div className="text-gray-600 mb-2">Video đã dịch</div>
            <div className="text-sm text-gray-500">Chỉ tháng này</div>
          </div>
        </div>
      </div>
    </section>
  );
}
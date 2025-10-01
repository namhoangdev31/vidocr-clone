
'use client';
import { useState } from 'react';

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState(0);
  
  const testimonials = [
    {
      name: 'Nguyễn Minh Tâm',
      role: 'CEO Công ty ABC',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Vietnamese%20business%20executive%2C%20confident%20smile%2C%20modern%20office%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=testimonial-1&orientation=squarish',
      content: 'Công cụ này đã giúp chúng tôi tiết kiệm hàng nghìn đô la chi phí dịch thuật và mở rộng thị trường quốc tế nhanh chóng.',
      rating: 5,
      company: 'Công ty ABC'
    },
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      avatar: 'https://readdy.ai/api/search-image?query=Young%20female%20content%20creator%2C%20friendly%20expression%2C%20creative%20workspace%20background%2C%20casual%20modern%20style%2C%20natural%20lighting%20photography&width=80&height=80&seq=testimonial-2&orientation=squarish',
      content: 'Amazing tool! My YouTube channel reached global audience within months. The translation quality is incredibly natural.',
      rating: 5,
      company: 'YouTube Channel'
    },
    {
      name: 'Trần Hoàng Long',
      role: 'Giảng viên trực tuyến',
      avatar: 'https://readdy.ai/api/search-image?query=Vietnamese%20male%20teacher%2C%20warm%20friendly%20smile%2C%20educational%20environment%20background%2C%20professional%20casual%20attire%2C%20approachable%20personality&width=80&height=80&seq=testimonial-3&orientation=squarish',
      content: 'Khóa học của tôi giờ đây có thể tiếp cận học viên từ 20+ quốc gia. Chất lượng dịch thuật rất chuyên nghiệp.',
      rating: 5,
      company: 'EduTech Platform'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và đạt được thành công với dịch vụ của chúng tôi
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-gray-100 rounded-full p-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Testimonial */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="text-center">
                <div className="mb-6">
                  <img
                    src={testimonials[activeTab].avatar}
                    alt={testimonials[activeTab].name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[activeTab].rating)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-yellow-400 text-xl"></i>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-700 font-medium mb-8 leading-relaxed">
                  "{testimonials[activeTab].content}"
                </blockquote>
                
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[activeTab].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[activeTab].role} • {testimonials[activeTab].company}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTab === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

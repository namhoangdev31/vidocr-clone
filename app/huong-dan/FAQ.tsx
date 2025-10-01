
'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "Làm cách nào để dịch Video?",
      answer: "Để dịch video, bạn chỉ cần tải video lên hệ thống, chọn ngôn ngữ đích và nhấn bắt đầu dịch. Hệ thống AI sẽ tự động nhận diện giọng nói và tạo phụ đề dịch chính xác."
    },
    {
      question: "Sử dụng tính năng tự động dịch video có sẽ ơ đáu thời?",
      answer: "Tính năng tự động dịch video giúp tiết kiệm rất nhiều thời gian. Thay vì mất hàng giờ để dịch thủ công, bạn chỉ cần vài phút để có bản dịch hoàn chỉnh với độ chính xác cao."
    },
    {
      question: "Sử dụng công nghệ AI khi ngôn ngữ Việt đăng có vấn đề gì không gì sao?",
      answer: "Công nghệ AI của chúng tôi được tối ưu hóa đặc biệt cho tiếng Việt. Hệ thống hiểu rõ ngữ cảnh, từ địa phương và có thể xử lý các accent khác nhau một cách chính xác."
    },
    {
      question: "Làm cách nào để sử dụng Video có thể xin tầm?",
      answer: "Bạn có thể sử dụng video từ nhiều nguồn khác nhau như file cá nhân, link YouTube, Facebook, TikTok. Hệ thống hỗ trợ đa dạng định dạng video và chất lượng khác nhau."
    },
    {
      question: "Ưu điểm chính của công cụ dịch ngôn ngữ không miễn?",
      answer: "Công cụ dịch của chúng tôi có nhiều ưu điểm: tốc độ xử lý nhanh, độ chính xác cao, hỗ trợ nhiều ngôn ngữ, giao diện thân thiện và chi phí hợp lý cho mọi đối tượng người dùng."
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Câu hỏi và giải đáp</h2>
            <p className="text-lg text-gray-600">
              Những câu hỏi thường gặp về cách sử dụng dịch vụ
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}>
                    <i className="ri-arrow-down-line w-6 h-6 flex items-center justify-center text-gray-500"></i>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-block">
              <img 
                src="https://readdy.ai/api/search-image?query=Friendly%20customer%20support%20team%20illustration%20with%20diverse%20people%20using%20headsets%2C%20modern%20help%20desk%20environment%20with%20purple%20and%20blue%20gradient%20colors%2C%20professional%20assistance%20concept&width=400&height=300&seq=support-team&orientation=landscape" 
                alt="Đội ngũ hỗ trợ khách hàng" 
                className="w-80 h-60 object-cover rounded-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

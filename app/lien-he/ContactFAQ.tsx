
'use client';

import { useState } from 'react';

export default function ContactFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Thời gian phản hồi trung bình là bao lâu?",
      answer: "Chúng tôi cam kết phản hồi trong vòng 2-4 giờ làm việc đối với các yêu cầu hỗ trợ thông thường và ngay lập tức đối với các trường hợp khẩn cấp."
    },
    {
      question: "Tôi có thể được hỗ trợ bằng tiếng Việt không?",
      answer: "Có, đội ngũ hỗ trợ của chúng tôi hoàn toàn hỗ trợ tiếng Việt 24/7. Bạn có thể liên hệ qua chat, email hoặc điện thoại."
    },
    {
      question: "Có hỗ trợ tư vấn miễn phí không?",
      answer: "Có, chúng tôi cung cấp tư vấn miễn phí 30 phút đầu để hiểu nhu cầu và đưa ra giải pháp phù hợp nhất cho dự án của bạn."
    },
    {
      question: "Làm thế nào để đặt lịch hẹn trực tiếp?",
      answer: "Bạn có thể đặt lịch hẹn qua website, gọi hotline 1900-2024, hoặc gửi email đến support@aitranslate.com với thông tin thời gian mong muốn."
    },
    {
      question: "Có hỗ trợ khách hàng doanh nghiệp riêng không?",
      answer: "Có, chúng tôi có đội ngũ chuyên biệt phục vụ khách hàng doanh nghiệp với các giải pháp tùy chỉnh và hỗ trợ ưu tiên."
    },
    {
      question: "Tôi có thể được demo sản phẩm trước khi quyết định không?",
      answer: "Chắc chắn rồi! Chúng tôi cung cấp demo miễn phí và trial 7 ngày để bạn trải nghiệm đầy đủ tính năng trước khi đăng ký."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-gray-600 text-lg">
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến về dịch vụ của chúng tôi
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className={`${openFaq === index ? 'ri-subtract-line' : 'ri-add-line'} text-gray-400 transition-transform`}></i>
                </div>
              </button>
              
              {openFaq === index && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-question-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Vẫn còn thắc mắc?
            </h3>
            <p className="text-gray-600 mb-6">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center justify-center">
                <i className="ri-chat-3-line mr-2"></i>
                Chat ngay
              </button>
              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center justify-center">
                <i className="ri-phone-line mr-2"></i>
                Gọi hotline
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

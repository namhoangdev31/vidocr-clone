
'use client';

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Đánh Giá Của Khách Hàng
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Xếp hạng Xuất Sắc 4,9/5 dựa trên hơn
            <br />
            850 bài đánh giá
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gray-50 p-6 rounded-2xl mb-4">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20vietnamese%20woman%20portrait%20in%20business%20attire%2C%20friendly%20smile%2C%20modern%20office%20background%2C%20corporate%20headshot%20style&width=80&height=80&seq=review-1&orientation=squarish"
                alt="Reviewer"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Tool này đã giúp mình tiết kiệm được quá nhiều thời gian, tiện bác và cộng sức."
              </p>
              <div className="flex justify-center mb-2">
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
              <div className="text-sm font-semibold text-gray-900">Minh A TV</div>
              <div className="text-xs text-gray-500">Youtuber</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 p-6 rounded-2xl mb-4">
              <img 
                src="https://readdy.ai/api/search-image?query=young%20vietnamese%20man%20portrait%2C%20casual%20business%20style%2C%20creative%20workspace%20background%2C%20professional%20headshot&width=80&height=80&seq=review-2&orientation=squarish"
                alt="Tổng Loan"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Rất ấn tượng về phần nhận dạng giọng nói và dịch nghĩa, hàu như chức năng đều OK!"
              </p>
              <div className="flex justify-center mb-2">
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
              <div className="text-sm font-semibold text-gray-900">Tổng Loan</div>
              <div className="text-xs text-gray-500">Youtuber</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 p-6 rounded-2xl mb-4">
              <img 
                src="https://readdy.ai/api/search-image?query=vietnamese%20businesswoman%20portrait%2C%20professional%20attire%2C%20modern%20office%20setting%2C%20confident%20smile%20headshot&width=80&height=80&seq=review-3&orientation=squarish"
                alt="Vũ Đồng"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Dịch từ Trung sang tiếng Việt, mình không biết tiếng Trung mà sub video vẫy còn nhà"
              </p>
              <div className="flex justify-center mb-2">
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
              <div className="text-sm font-semibold text-gray-900">Vũ Đồng</div>
              <div className="text-xs text-gray-500">Người dùng tin cậy</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 p-6 rounded-2xl mb-4">
              <img 
                src="https://readdy.ai/api/search-image?query=vietnamese%20male%20entrepreneur%20portrait%2C%20business%20casual%20attire%2C%20startup%20office%20environment%2C%20professional%20headshot&width=80&height=80&seq=review-4&orientation=squarish"
                alt="Hoàng Kim"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "Lúc người dịch lời hút dịch hệt - chình xác mà mới."
              </p>
              <div className="flex justify-center mb-2">
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
              <div className="text-sm font-semibold text-gray-900">Hoàng Kim</div>
              <div className="text-xs text-gray-500">Người dùng</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

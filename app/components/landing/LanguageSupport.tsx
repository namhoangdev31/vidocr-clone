'use client';

export default function LanguageSupport() {
  return (
    <section className="py-24 bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-4 block">
                Hỗ Trợ Mạnh Mẽ
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hỗ trợ nhận dạng hầu hết các ngôn ngữ trên thế giới
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sử dụng thư viện ngôn ngữ mạnh mẽ và rộng lớn, chúng tôi hỗ trợ nhận dạng và dịch hầu hết cặp ngôn ngữ trên thế giới
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-global-line text-2xl text-blue-600"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Hỗ trợ hơn 100+ ngôn ngữ
                </h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-translate-2 text-2xl text-blue-600"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Dịch thuật với văn phông bản xứ
                </h4>
              </div>
            </div>
            
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
              Dịch Ngay <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://dichtudong.com/assets/img/preview-gallery/core-statistic-1.jpg"
                alt="Language support 1"
                className="w-full rounded-2xl shadow-lg"
              />
              <img 
                src="https://dichtudong.com/assets/img/preview-gallery/core-statistic-4.jpg"
                alt="Language support 3"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src="https://dichtudong.com/assets/img/preview-gallery/core-statistic-2.jpg"
                alt="Language support 2"
                className="w-full rounded-2xl shadow-lg"
              />
              <img 
                src="https://dichtudong.com/assets/img/preview-gallery/core-statistic-3.jpg"
                alt="Language support 4"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
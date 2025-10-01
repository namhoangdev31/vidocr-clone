
'use client';

export default function PricingHero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Công cụ dịch văn bản trong video mạnh nhất
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Công cụ dịch văn bản trong{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                video
              </span>{' '}
              mạnh nhất
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Chuyển đổi video của bạn sang hơn 100 ngôn ngữ với AI tiên tiến, 
              giữ nguyên giọng điệu và cảm xúc gốc.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap">
                Dùng thử miễn phí
                <i className="ri-arrow-right-line ml-2"></i>
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap">
                <i className="ri-play-circle-line mr-2"></i>
                Xem demo
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Professional%20video%20editing%20interface%20with%20AI%20translation%20tools%2C%20modern%20dark%20UI%20with%20blue%20and%20purple%20accents%2C%20showing%20video%20timeline%20and%20translation%20features%2C%20high-tech%20dashboard%20design&width=600&height=400&seq=pricing-hero-1&orientation=landscape"
                  alt="Video Translation Interface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <i className="ri-play-fill"></i>
                      </div>
                      <span className="text-sm">Đang dịch: Tiếng Anh → Tiếng Việt</span>
                    </div>
                    <span className="text-sm">98% hoàn thành</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tiến độ dịch thuật</span>
                  <span className="text-blue-600 font-medium">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{width: '98%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

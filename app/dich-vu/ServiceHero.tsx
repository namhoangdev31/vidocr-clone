
export default function ServiceHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-orange-200/30 rounded-full animate-pulse"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-20 min-h-screen">
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Dịch Vụ
                <span className="text-blue-600 block">AI Translation</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Trải nghiệm công nghệ dịch thuật video tiên tiến nhất với AI, giúp bạn tiết kiệm thời gian và chi phí một cách hiệu quả.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap font-semibold text-lg">
                Dùng thử ngay
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap font-semibold text-lg">
                Xem demo
              </button>
            </div>
            
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Video đã dịch</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">25+</div>
                <div className="text-sm text-gray-600">Ngôn ngữ</div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="https://readdy.ai/api/search-image?query=Video%20editing%20interface%20dashboard%20with%20dark%20theme%2C%20professional%20video%20player%20with%20subtitle%20editor%2C%20modern%20UI%20design%20with%20blue%20and%20purple%20accents%2C%20AI%20translation%20workspace%20with%20timeline%20and%20controls&width=600&height=400&seq=video-interface&orientation=landscape" alt="Video Interface" className="w-full h-80 object-cover rounded-lg" />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">Đang xử lý AI...</span>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-blue-400 text-xs">Original: "Hello, how are you?"</div>
                    <div className="text-green-400 text-xs">Vietnamese: "Xin chào, bạn khỏe không?"</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">AI Processing</div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-bounce">99% Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

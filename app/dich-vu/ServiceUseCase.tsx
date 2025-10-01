export default function ServiceUseCase() {
  const useCases = [
    {
      name: 'YouTube',
      icon: 'ri-youtube-line',
      description: 'Dịch video YouTube để tiếp cận khán giả toàn cầu',
      features: ['Dịch thời gian thực', 'Tự động tạo phụ đề', 'Lồng tiếng'],
      active: true
    },
    {
      name: 'TikTok',
      icon: 'ri-tiktok-line',
      description: 'Tạo nội dung viral đa ngôn ngữ trên TikTok',
      features: ['Video ngắn', 'Hiệu ứng âm thanh', 'Trending'],
      active: false
    },
    {
      name: 'Webinar',
      icon: 'ri-live-line',
      description: 'Mở rộng tầm với của webinar với nhiều ngôn ngữ',
      features: ['Phát trực tiếp', 'Tương tác', 'Chuyên nghiệp'],
      active: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Các trường hợp sử dụng được hỗ trợ</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hoàn hảo cho các nhà sáng tạo nội dung, nhà giáo dục và doanh nghiệp trên mọi nền tảng video
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {useCases.map((useCase, index) => (
                <button
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer group ${
                    useCase.active 
                      ? 'bg-white shadow-lg scale-105 border-2 border-purple-200' 
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center mx-auto mb-3 text-2xl ${
                    useCase.name === 'YouTube' ? 'text-red-600' : 
                    useCase.name === 'TikTok' ? 'text-black' : 'text-green-600'
                  }`}>
                    <i className={`${useCase.icon} w-12 h-12 flex items-center justify-center`}></i>
                  </div>
                  <h3 className={`font-semibold transition-colors ${
                    useCase.active ? 'text-purple-600' : 'text-gray-900'
                  }`}>
                    {useCase.name}
                  </h3>
                </button>
              ))}
              
              <button className="p-6 rounded-2xl transition-all duration-300 cursor-pointer group bg-white/50 hover:bg-white hover:shadow-md">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 text-2xl">
                  <i className="ri-presentation-line w-12 h-12 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold transition-colors text-gray-900">Training</h3>
              </button>
              
              <button className="p-6 rounded-2xl transition-all duration-300 cursor-pointer group bg-white/50 hover:bg-white hover:shadow-md">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-purple-600 text-2xl">
                  <i className="ri-camera-line w-12 h-12 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold transition-colors text-gray-900">Vlogs</h3>
              </button>
              
              <button className="p-6 rounded-2xl transition-all duration-300 cursor-pointer group bg-white/50 hover:bg-white hover:shadow-md">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-orange-600 text-2xl">
                  <i className="ri-mic-line w-12 h-12 flex items-center justify-center"></i>
                </div>
                <h3 className="font-semibold transition-colors text-gray-900">Podcasts</h3>
              </button>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img src="https://readdy.ai/api/search-image?query=YouTube%20video%20creation%20workspace%20with%20multiple%20language%20subtitles%2C%20creator%20editing%20content%2C%20professional%20studio%20setup%2C%20global%20audience%20engagement%2C%20modern%20video%20editing%20interface&width=600&height=400&seq=usecase-0&orientation=landscape" alt="YouTube" className="w-full h-64 object-top" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center text-red-600 text-xl">
                    <i className="ri-youtube-line w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">YouTube</h3>
                </div>
                <p className="text-gray-600 text-lg mb-6">
                  Dịch video YouTube để tiếp cận khán giả toàn cầu
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">Dịch thời gian thực</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">Tự động tạo phụ đề</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">Lồng tiếng</span>
                </div>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer">
                  Thử cho YouTube
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
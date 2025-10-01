export default function VideoTutorials() {
  const tutorials = [
    {
      title: 'Hướng dẫn cơ bản cho người mới',
      description: 'Video hướng dẫn từ A-Z cách sử dụng công cụ dịch video AI',
      duration: '8:45',
      views: '125K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Tutorial%20video%20thumbnail%20showing%20beginner%20guide%20interface%2C%20AI%20video%20translation%20dashboard%2C%20step-by-step%20process%2C%20clean%20educational%20design%20with%20play%20button%20overlay&width=400&height=225&seq=tutorial-1&orientation=landscape',
      category: 'Cơ bản'
    },
    {
      title: 'Tải video từ YouTube và TikTok',
      description: 'Cách dễ dàng import video từ các nền tảng mạng xã hội',
      duration: '5:20',
      views: '89K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Tutorial%20showing%20video%20import%20from%20social%20media%20platforms%2C%20YouTube%20and%20TikTok%20integration%2C%20URL%20input%20interface%2C%20modern%20tutorial%20design&width=400&height=225&seq=tutorial-2&orientation=landscape',
      category: 'Import'
    },
    {
      title: 'Tùy chỉnh giọng đọc và phụ đề',
      description: 'Hướng dẫn chi tiết cách chọn giọng và định dạng phụ đề',
      duration: '12:30',
      views: '67K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Voice%20and%20subtitle%20customization%20interface%2C%20audio%20waveform%20visualization%2C%20subtitle%20styling%20options%2C%20professional%20video%20editing%20tutorial%20design&width=400&height=225&seq=tutorial-3&orientation=landscape',
      category: 'Nâng cao'
    },
    {
      title: 'Xuất video với chất lượng cao nhất',
      description: 'Cách chọn định dạng và cài đặt xuất file tối ưu',
      duration: '6:15',
      views: '92K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Video%20export%20settings%20interface%2C%20quality%20options%2C%20format%20selection%2C%20progress%20bar%20and%20download%20options%2C%20professional%20tutorial%20design&width=400&height=225&seq=tutorial-4&orientation=landscape',
      category: 'Xuất file'
    },
    {
      title: 'Xử lý video dài và batch processing',
      description: 'Cách xử lý nhiều video cùng lúc và video dài',
      duration: '9:40',
      views: '54K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Batch%20processing%20interface%20showing%20multiple%20video%20queue%2C%20progress%20tracking%2C%20bulk%20operations%2C%20advanced%20tutorial%20dashboard%20design&width=400&height=225&seq=tutorial-5&orientation=landscape',
      category: 'Nâng cao'
    },
    {
      title: 'Khắc phục sự cố thường gặp',
      description: 'Giải quyết các vấn đề phổ biến khi sử dụng công cụ',
      duration: '7:55',
      views: '78K',
      thumbnail: 'https://readdy.ai/api/search-image?query=Troubleshooting%20guide%20interface%2C%20error%20messages%2C%20solution%20steps%2C%20help%20and%20support%20tutorial%20design%20with%20problem-solving%20elements&width=400&height=225&seq=tutorial-6&orientation=landscape',
      category: 'Hỗ trợ'
    }
  ];
  
  const categories = ['Tất cả', 'Cơ bản', 'Import', 'Nâng cao', 'Xuất file', 'Hỗ trợ'];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Video hướng dẫn</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Học qua video trực quan và dễ hiểu từ các chuyên gia của chúng tôi
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                category === 'Tất cả'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
              <div className="relative">
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-play-fill w-8 h-8 flex items-center justify-center text-purple-600 text-2xl ml-1"></i>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                    {tutorial.duration}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    {tutorial.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tutorial.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    <span>{tutorial.views} lượt xem</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm cursor-pointer flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem ngay
                    <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
            Xem tất cả video hướng dẫn
          </button>
        </div>
      </div>
    </section>
  );
}
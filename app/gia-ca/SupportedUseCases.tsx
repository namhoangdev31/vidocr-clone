
'use client';

export default function SupportedUseCases() {
  const useCases = [
    {
      title: 'YouTube Creator',
      description: 'Mở rộng khán giả toàn cầu với video đa ngôn ngữ',
      icon: 'ri-youtube-line',
      color: 'red',
      image: 'https://readdy.ai/api/search-image?query=YouTube%20creator%20studio%20with%20multiple%20language%20subtitles%2C%20content%20creator%20working%20on%20global%20video%20content%2C%20colorful%20and%20engaging%20interface%2C%20modern%20workspace%20setup&width=400&height=250&seq=youtube-1&orientation=landscape'
    },
    {
      title: 'Doanh nghiệp',
      description: 'Training và marketing videos cho thị trường quốc tế',
      icon: 'ri-briefcase-line',
      color: 'blue',
      image: 'https://readdy.ai/api/search-image?query=Corporate%20training%20video%20production%2C%20business%20presentation%20with%20multilingual%20support%2C%20professional%20office%20environment%2C%20international%20business%20communication&width=400&height=250&seq=business-1&orientation=landscape'
    },
    {
      title: 'Giáo dục',
      description: 'Khóa học online tiếp cận học viên toàn cầu',
      icon: 'ri-graduation-cap-line',
      color: 'green',
      image: 'https://readdy.ai/api/search-image?query=Online%20education%20platform%20with%20multilingual%20courses%2C%20teacher%20creating%20educational%20content%2C%20diverse%20students%20learning%20globally%2C%20modern%20e-learning%20interface&width=400&height=250&seq=education-1&orientation=landscape'
    },
    {
      title: 'Webinar',
      description: 'Hội thảo trực tuyến với người tham gia đa quốc gia',
      icon: 'ri-presentation-line',
      color: 'purple',
      image: 'https://readdy.ai/api/search-image?query=Professional%20webinar%20setup%20with%20real-time%20translation%2C%20international%20participants%2C%20conference%20call%20interface%2C%20multilingual%20presentation%20tools&width=400&height=250&seq=webinar-1&orientation=landscape'
    },
    {
      title: 'TikTok/Shorts',
      description: 'Viral content cho nhiều thị trường cùng lúc',
      icon: 'ri-music-line',
      color: 'pink',
      image: 'https://readdy.ai/api/search-image?query=Social%20media%20content%20creation%20for%20TikTok%20and%20YouTube%20Shorts%2C%20viral%20video%20production%20with%20global%20reach%2C%20trendy%20and%20colorful%20mobile%20interface&width=400&height=250&seq=tiktok-1&orientation=landscape'
    },
    {
      title: 'Podcast',
      description: 'Mở rộng audience với nội dung đa ngôn ngữ',
      icon: 'ri-mic-line',
      color: 'orange',
      image: 'https://readdy.ai/api/search-image?query=Professional%20podcast%20recording%20studio%20with%20multilingual%20content%20creation%2C%20audio%20equipment%20and%20international%20broadcasting%20setup%2C%20modern%20radio%20station%20environment&width=400&height=250&seq=podcast-1&orientation=landscape'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Các trường hợp sử dụng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Phù hợp cho mọi loại hình content và ngành nghề
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  useCase.color === 'red' ? 'bg-red-100 text-red-600' :
                  useCase.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  useCase.color === 'green' ? 'bg-green-100 text-green-600' :
                  useCase.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  useCase.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <i className={`${useCase.icon} text-xl`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {useCase.description}
                </p>
                
                <button className={`text-sm font-medium hover:underline ${
                  useCase.color === 'red' ? 'text-red-600' :
                  useCase.color === 'blue' ? 'text-blue-600' :
                  useCase.color === 'green' ? 'text-green-600' :
                  useCase.color === 'purple' ? 'text-purple-600' :
                  useCase.color === 'pink' ? 'text-pink-600' :
                  'text-orange-600'
                } flex items-center cursor-pointer`}>
                  Tìm hiểu thêm
                  <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

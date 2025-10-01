'use client';

export default function SmartAnalysis() {
  return (
    <section className="py-24" style={{backgroundColor: '#efeded'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="hidden sm:block">
            <div className="flex justify-center gap-4">
              <div 
                className="w-64 h-80 rounded-2xl flex items-end justify-center text-white font-bold text-lg p-6 text-center"
                style={{
                  backgroundImage: 'url(https://dichtudong.com/image/text-recognising1.png), radial-gradient(circle at 0 0, #cb4900, #ff6b00)',
                  backgroundSize: 'cover, cover',
                  backgroundPosition: 'center, center'
                }}
              >
                <div>Nhận diện ký tự quang học (OCR)</div>
              </div>
              
              <div 
                className="w-64 h-80 rounded-2xl flex items-end justify-center text-white font-bold text-lg p-6 text-center transform scale-110"
                style={{
                  backgroundImage: 'url(https://dichtudong.com/image/text-to-speech1.png), radial-gradient(circle at 0 0, #cb4900, #ff6b00)',
                  backgroundSize: 'cover, cover',
                  backgroundPosition: 'center, center'
                }}
              >
                <div>Nhận diện giọng nói chính xác cao</div>
              </div>
              
              <div 
                className="w-64 h-80 rounded-2xl flex items-end justify-center text-white font-bold text-lg p-6 text-center"
                style={{
                  backgroundImage: 'url(https://dichtudong.com/image/smart.png), radial-gradient(circle at 0 0, #cb4900, #ff6b00)',
                  backgroundSize: 'cover, cover',
                  backgroundPosition: 'center, center',
                  marginRight: '25px'
                }}
              >
                <div>Dịch văn bản với văn phông bản xứ</div>
              </div>
            </div>
          </div>
          
          <div className="pl-12 lg:pl-0">
            <div className="mb-8">
              <span className="bg-gray-800 text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded mb-6 inline-block">
                Tính năng thông minh
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bạn chỉ cần tải lên việc còn lại AI lo
              </h2>
            </div>
            
            <ul className="space-y-4 mt-8">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700 text-lg">
                  Tự động dịch văn bản với chất lượng bản ngữ cao.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700 text-lg">
                  Tự động Edit, Timing đúng theo thời gian và vị trí.
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700 text-lg">
                  Tự động lồng tiếng đa nhân vật, đa nội dung, đa tốc độ!
                </span>
              </li>
            </ul>
            
            <div className="mt-8">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                Dùng Thử Ngay <i className="ri-arrow-right-line ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
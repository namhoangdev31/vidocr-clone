'use client';

export default function CoreFeature() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-4 block">
                Tính năng cốt lõi
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nhận diện ký tự quang học OCR - Nhận diện giọng nói
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sử dụng công nghệ Nhận Dạng Kí Tự Quang Học(OCR) và Nhận Dạng Giọng Nói Thế Hệ 5 để quét và dịch toàn bộ văn bản và âm thanh trong Video một cách nhanh chóng và chính xác.
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
              Xem Demo <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
              <video 
                className="w-full rounded-2xl shadow-lg"
                autoPlay
                loop
                muted
                poster="https://dichtudong.com/assets/img/hero/app-dashboard.png"
              >
                <source src="https://dichtudong.com/assets/img/demobackground.mp4" type="video/mp4" />
              </video>
              
              <div className="flex justify-center gap-4 mt-6">
                <div className="w-12 h-8 rounded bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <img src="https://dichtudong.com/image/united-kingdom.png" alt="English" className="w-6 h-4 object-cover rounded" />
                </div>
                <div className="w-12 h-8 rounded bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <img src="https://dichtudong.com/image/vietnam.png" alt="Vietnamese" className="w-6 h-4 object-cover rounded" />
                </div>
                <div className="w-12 h-8 rounded bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <img src="https://dichtudong.com/image/china.png" alt="Chinese" className="w-6 h-4 object-cover rounded" />
                </div>
                <div className="w-12 h-8 rounded bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <img src="https://dichtudong.com/image/south-korea.png" alt="Korean" className="w-6 h-4 object-cover rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
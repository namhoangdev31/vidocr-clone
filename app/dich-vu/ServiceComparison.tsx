export default function ServiceComparison() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-purple-600 mb-4 uppercase tracking-wide">Powered by Advanced AI</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our cutting-edge AI combines speech recognition, optical character recognition (OCR), and intelligent voiceover technology to deliver seamless video translation experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trước khi có AI Translation</h3>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src="https://readdy.ai/api/search-image?query=Video%20player%20interface%20showing%20foreign%20language%20content%20with%20no%20subtitles%2C%20person%20speaking%20in%20different%20language%2C%20confused%20viewer%20expression%2C%20before%20translation%20state%2C%20simple%20video%20interface%20background&width=600&height=400&seq=before-translation&orientation=landscape" alt="Before AI Translation" className="w-full h-auto object-top" />
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Không có bản dịch
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sau khi có AI Translation</h3>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src="https://readdy.ai/api/search-image?query=Video%20player%20interface%20with%20AI-generated%20subtitles%20in%20multiple%20languages%2C%20clear%20readable%20text%20overlays%2C%20professional%20translation%20interface%2C%20happy%20viewer%20understanding%20content%2C%20modern%20UI%20with%20translation%20options&width=600&height=400&seq=after-translation&orientation=landscape" alt="After AI Translation" className="w-full h-auto object-top" />
              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                AI Translated
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-mic-line w-8 h-8 flex items-center justify-center text-purple-600"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Nhận diện giọng nói</h4>
            <p className="text-gray-600">AI tiên tiến phát hiện và chuyển đổi giọng nói thành văn bản chính xác</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-eye-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Công nghệ OCR</h4>
            <p className="text-gray-600">Nhận diện văn bản thông minh trích xuất và dịch văn bản trên màn hình</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-volume-up-line w-8 h-8 flex items-center justify-center text-orange-600"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Lồng tiếng thông minh</h4>
            <p className="text-gray-600">Giọng nói AI tự nhiên với nhiều ngôn ngữ và giọng điệu khác nhau</p>
          </div>
        </div>
      </div>
    </section>
  );
}
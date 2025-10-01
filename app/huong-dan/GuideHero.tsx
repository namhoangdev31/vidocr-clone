
export default function GuideHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-6 h-6 bg-pink-400 rounded-full opacity-60"></div>
      <div className="absolute top-20 right-20 w-4 h-4 bg-yellow-400 rounded-full opacity-70"></div>
      <div className="absolute bottom-20 left-20 w-8 h-8 bg-purple-400 rounded-full opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Trang Chủ / Hướng Dẫn</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Hướng Dẫn
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Tìm hiểu cách sử dụng các tính năng của DichTuong.com một cách hiệu quả nhất
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <img 
              src="https://readdy.ai/api/search-image?query=Modern%20desktop%20computer%20displaying%20YouTube%20interface%20with%20Google%20Translate%20extension%2C%20clean%20workspace%20with%20blue%20gradient%20background%2C%20professional%20tutorial%20setup%20showing%20video%20translation%20process%2C%20modern%20office%20environment&width=800&height=450&seq=guide-hero-desktop&orientation=landscape" 
              alt="Hướng dẫn sử dụng công cụ dịch video" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

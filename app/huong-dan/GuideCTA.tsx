
export default function GuideCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/5 rounded-full opacity-50"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="text-sm text-white/80">Chúng Tôi Không Tin</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Tham gia với chúng tôi để nhận<br />
            thông tin ưu đãi mới nhất
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Nhận các cập nhật mới nhất về tính năng và ưu đãi độc biệt
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-md mx-auto">
            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
              Nhập email của bạn
            </button>
            <button className="px-8 py-4 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition-all duration-300 whitespace-nowrap cursor-pointer">
              Tham Gia Ngay
            </button>
          </div>
          
          <p className="text-sm text-white/70 mb-12">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn
          </p>
        </div>
      </div>
    </section>
  );
}

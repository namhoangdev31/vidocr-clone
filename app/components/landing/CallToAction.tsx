
'use client';

export default function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="mb-8">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4 block">
            AI Là sức mạnh của bạn
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tận dụng sức mạnh của AI giúp nâng cao hiệu suất làm việc và đẩy mạnh lợi thế cạnh tranh của bạn!
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap">
            Sử Dụng Ngay
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors whitespace-nowrap">
            Hướng Dẫn
          </button>
        </div>
      </div>
    </section>
  );
}
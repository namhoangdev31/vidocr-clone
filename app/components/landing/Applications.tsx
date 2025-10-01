'use client';

export default function Applications() {
  const applications = [
    {
      title: 'Dịch phụ đề phim',
      image: 'https://dichtudong.com/image/3874137.png'
    },
    {
      title: 'Ghi chú và chú thích',
      image: 'https://dichtudong.com/image/10045767.png'
    },
    {
      title: 'Quảng cáo đa quốc gia',
      image: 'https://dichtudong.com/image/9518869.png'
    },
    {
      title: 'Dịch video Youtube, Tiktok',
      image: 'https://dichtudong.com/image/6745483.png'
    },
    {
      title: 'Học tập và đào tạo',
      image: 'https://dichtudong.com/image/4334816.png'
    },
    {
      title: 'Giải trí truyền thông',
      image: 'https://dichtudong.com/image/2991494.png'
    },
    {
      title: 'Nghiên cứu công nghệ mới',
      image: 'https://dichtudong.com/image/2765167.png'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-4 block">
            Ứng dụng nổi bật
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dịch thuật với phong cách
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Không cần dịch - Không cần timing - Không cần edit
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {applications.map((app, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <img 
                  src={app.image}
                  alt={app.title}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-center font-semibold text-gray-900 text-sm">
                {app.title}
              </h3>
              <div className="text-center mt-2">
                <span className="text-blue-600 text-xl">▶︎</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
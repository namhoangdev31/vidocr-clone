
'use client';

export default function Stats() {
  const stats = [
    {
      icon: 'ri-user-line',
      number: '11,327',
      suffix: '+',
      label: 'Người dùng đăng kí'
    },
    {
      icon: 'ri-file-text-line',
      number: '38,630',
      suffix: '+', 
      label: 'Video được dịch'
    },
    {
      icon: 'ri-download-cloud-line',
      number: '34,630',
      suffix: '+',
      label: 'Lần tải xuống'
    },
    {
      icon: 'ri-star-line',
      number: '850',
      suffix: '+',
      label: '4.9/5 Xếp hạng điểm số'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden" style={{backgroundImage: 'url(https://dichtudong.com/vi-vn/assets/img/section-map.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img 
                  src="https://dichtudong.com/assets/img/hero/count-down-main-thumbnail.png"
                  alt="Main preview"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
              <div className="space-y-6 mt-8">
                <img 
                  src="https://dichtudong.com/assets/img/hero/3d_smartphone_with_5_stars_rating_concept_in_minimal_cartoon_style.jpg"
                  alt="5 stars rating"
                  className="w-full rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <img 
                  src="https://dichtudong.com/assets/img/hero/cover-2.png"
                  alt="Cover image"
                  className="w-full rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{stat.number}</span>
                  <span className="text-2xl font-semibold">{stat.suffix}</span>
                </div>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

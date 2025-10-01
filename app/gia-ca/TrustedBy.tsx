
'use client';

export default function TrustedBy() {
  const stats = [
    {
      number: '50K+',
      label: 'Người dùng tin tưởng',
      icon: 'ri-user-line',
      color: 'blue'
    },
    {
      number: '2.5M+',
      label: 'Video đã được dịch',
      icon: 'ri-vidicon-line',
      color: 'green'
    },
    {
      number: '100+',
      label: 'Ngôn ngữ hỗ trợ',
      icon: 'ri-global-line',
      color: 'purple'
    },
    {
      number: '99.5%',
      label: 'Độ hài lòng khách hàng',
      icon: 'ri-heart-line',
      color: 'red'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Được tin tưởng bởi Creators Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hàng nghìn content creator, doanh nghiệp và tổ chức giáo dục trên toàn thế giới đã chọn chúng tôi
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-600' :
                stat.color === 'green' ? 'bg-green-600' :
                stat.color === 'purple' ? 'bg-purple-600' :
                'bg-red-600'
              }`}>
                <i className={`${stat.icon} text-2xl text-white`}></i>
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              
              <div className="text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Company Logos */}
        <div className="border-t border-gray-700 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Các thương hiệu hàng đầu đã tin tưởng
            </h3>
            <p className="text-gray-300">
              Từ startup đến enterprise, chúng tôi phục vụ mọi quy mô doanh nghiệp
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-white/60 font-bold text-sm">
                  BRAND {index}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

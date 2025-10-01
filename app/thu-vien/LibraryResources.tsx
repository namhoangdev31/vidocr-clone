
'use client';

const resources = [
  {
    id: 1,
    type: 'Hướng Dẫn',
    title: 'Video Tutorial: Từ A-Z Về Dịch Video AI',
    description: 'Series video hướng dẫn đầy đủ từ cơ bản đến nâng cao về cách sử dụng AI để dịch video chuyên nghiệp.',
    duration: '45 phút',
    level: 'Mọi cấp độ',
    downloads: '12,500',
    image: 'https://readdy.ai/api/search-image?query=Video%20tutorial%20interface%20showing%20step-by-step%20AI%20video%20translation%20process%2C%20educational%20content%20with%20clear%20instructions%20and%20professional%20presentation%20style&width=300&height=200&seq=resource-1&orientation=landscape',
    icon: 'ri-play-circle-line',
    color: 'blue'
  },
  {
    id: 2,
    type: 'Template',
    title: 'Bộ Template Script Dịch Video Chuẩn',
    description: 'Tải về bộ template script được thiết kế sẵn cho các loại video phổ biến như YouTube, marketing, giáo dục.',
    duration: 'Tải ngay',
    level: 'Tất cả',
    downloads: '8,200',
    image: 'https://readdy.ai/api/search-image?query=Professional%20video%20script%20templates%20laid%20out%20on%20desk%2C%20organized%20document%20files%20and%20folders%2C%20clean%20office%20workspace%20with%20template%20designs%20visible&width=300&height=200&seq=resource-2&orientation=landscape',
    icon: 'ri-file-text-line',
    color: 'green'
  },
  {
    id: 3,
    type: 'Checklist',
    title: 'Checklist Hoàn Thiện Video Dịch',
    description: 'Danh sách kiểm tra chi tiết 50 điểm để đảm bảo video dịch của bạn đạt chất lượng chuyên nghiệp.',
    duration: '10 phút',
    level: 'Trung cấp',
    downloads: '15,800',
    image: 'https://readdy.ai/api/search-image?query=Professional%20checklist%20document%20with%20video%20quality%20checkpoints%2C%20organized%20quality%20assurance%20process%2C%20clean%20document%20design%20with%20checkboxes%20and%20ratings&width=300&height=200&seq=resource-3&orientation=landscape',
    icon: 'ri-checkbox-line',
    color: 'purple'
  },
  {
    id: 4,
    type: 'Webinar',
    title: 'Webinar: Xu Hướng Dịch Video 2024',
    description: 'Tham gia webinar miễn phí để tìm hiểu về những xu hướng mới nhất trong lĩnh vực dịch video AI.',
    duration: '60 phút',
    level: 'Mọi cấp độ',
    downloads: '5,500',
    image: 'https://readdy.ai/api/search-image?query=Online%20webinar%20presentation%20about%20video%20translation%20trends%2C%20professional%20speaker%20presenting%20to%20virtual%20audience%2C%20modern%20conference%20room%20setup%20with%20screens&width=300&height=200&seq=resource-4&orientation=landscape',
    icon: 'ri-live-line',
    color: 'red'
  },
  {
    id: 5,
    type: 'E-book',
    title: 'E-book: Chiến Lược Content Đa Ngôn Ngữ',
    description: 'Sách điện tử 120 trang hướng dẫn xây dựng chiến lược content đa ngôn ngữ hiệu quả cho doanh nghiệp.',
    duration: '120 trang',
    level: 'Nâng cao',
    downloads: '6,700',
    image: 'https://readdy.ai/api/search-image?query=Professional%20e-book%20cover%20design%20about%20multilingual%20content%20strategy%2C%20business-focused%20layout%20with%20international%20elements%20and%20language%20symbols&width=300&height=200&seq=resource-5&orientation=landscape',
    icon: 'ri-book-open-line',
    color: 'orange'
  },
  {
    id: 6,
    type: 'Tool',
    title: 'Công Cụ Tính ROI Dịch Video',
    description: 'Calculator miễn phí giúp bạn tính toán lợi nhuận đầu tư khi sử dụng dịch vụ dịch video cho doanh nghiệp.',
    duration: 'Miễn phí',
    level: 'Cơ bản',
    downloads: '9,300',
    image: 'https://readdy.ai/api/search-image?query=ROI%20calculator%20tool%20interface%20showing%20video%20translation%20investment%20returns%2C%20professional%20business%20analytics%20dashboard%20with%20charts%20and%20financial%20metrics&width=300&height=200&seq=resource-6&orientation=landscape',
    icon: 'ri-calculator-line',
    color: 'teal'
  }
];

export default function LibraryResources() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tài Nguyên
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Miễn Phí</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tận dụng kho tàng tài nguyên miễn phí để nâng cao kỹ năng dịch video và phát triển chiến lược content đa ngôn ngữ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              <div className="relative overflow-hidden">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-4 left-4 bg-${resource.color}-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center`}>
                  <i className={`${resource.icon} w-4 h-4 flex items-center justify-center mr-2`}></i>
                  {resource.type}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-1"></i>
                    {resource.duration}
                  </div>
                  <div className="flex items-center">
                    <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-1"></i>
                    {resource.level}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-green-600 text-sm">
                    <i className="ri-download-line w-4 h-4 flex items-center justify-center mr-1"></i>
                    {resource.downloads} lượt tải
                  </div>
                  <div className="text-yellow-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill w-4 h-4 flex items-center justify-center"></i>
                    ))}
                  </div>
                </div>
                
                <button className={`w-full py-3 bg-gradient-to-r from-${resource.color}-600 to-${resource.color}-700 text-white font-semibold rounded-lg hover:from-${resource.color}-700 hover:to-${resource.color}-800 transition-all duration-300 whitespace-nowrap`}>
                  Tải Xuống Miễn Phí
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 whitespace-nowrap">
            Xem Thêm Tài Nguyên
          </button>
        </div>
      </div>
    </section>
  );
}

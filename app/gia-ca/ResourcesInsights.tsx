
'use client';

export default function ResourcesInsights() {
  const resources = [
    {
      type: 'Blog',
      title: 'Cách tối ưu hóa video cho thị trường quốc tế',
      description: 'Hướng dẫn chi tiết về việc tạo nội dung video thu hút khán giả toàn cầu',
      date: '15 Tháng 12, 2024',
      readTime: '5 phút đọc',
      image: 'https://readdy.ai/api/search-image?query=International%20video%20marketing%20strategy%2C%20global%20audience%20engagement%2C%20multicultural%20content%20creation%2C%20modern%20digital%20marketing%20workspace&width=400&height=250&seq=blog-1&orientation=landscape',
      tag: 'Marketing'
    },
    {
      type: 'Case Study',
      title: 'Startup tăng 400% doanh thu nhờ video đa ngôn ngữ',
      description: 'Câu chuyện thành công của một startup công nghệ mở rộng ra thị trường quốc tế',
      date: '12 Tháng 12, 2024',
      readTime: '8 phút đọc',
      image: 'https://readdy.ai/api/search-image?query=Successful%20startup%20growth%20story%2C%20business%20expansion%20charts%20and%20graphs%2C%20entrepreneurs%20celebrating%20achievement%2C%20modern%20office%20environment&width=400&height=250&seq=case-study-1&orientation=landscape',
      tag: 'Success Story'
    },
    {
      type: 'Guide',
      title: 'Top 10 ngôn ngữ cần thiết cho content creator',
      description: 'Danh sách các ngôn ngữ quan trọng nhất để mở rộng khán giả toàn cầu',
      date: '10 Tháng 12, 2024',
      readTime: '6 phút đọc',
      image: 'https://readdy.ai/api/search-image?query=World%20languages%20visualization%2C%20global%20communication%20concept%2C%20international%20flags%20and%20cultural%20diversity%2C%20educational%20infographic%20design&width=400&height=250&seq=guide-1&orientation=landscape',
      tag: 'Tutorial'
    }
  ];

  const stats = [
    { number: '500%', label: 'Tăng trưởng lượt xem trung bình' },
    { number: '85%', label: 'Khách hàng tiết kiệm chi phí' },
    { number: '12x', label: 'Tăng tốc độ sản xuất content' }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tài nguyên & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Học hỏi từ những chuyên gia hàng đầu và câu chuyện thành công thực tế
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Resources */}
        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <article key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {resource.tag}
                  </span>
                  <span className="text-sm text-gray-500">
                    {resource.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{resource.date}</span>
                  <span>{resource.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto whitespace-nowrap">
            Xem tất cả tài nguyên
            <i className="ri-arrow-right-line ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

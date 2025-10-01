
'use client';

const blogPosts = [
  {
    id: 1,
    title: '10 Bí Quyết Dịch Video Chuyên Nghiệp Với AI',
    excerpt: 'Khám phá những kỹ thuật tiên tiến giúp bạn tạo ra video dịch chất lượng cao, tự nhiên như người bản xứ nói.',
    author: 'Nguyễn Minh Hà',
    date: '15 Tháng 12, 2024',
    readTime: '8 phút đọc',
    category: 'Hướng Dẫn',
    image: 'https://readdy.ai/api/search-image?query=Professional%20video%20translation%20workspace%20with%20AI%20technology%2C%20multiple%20screens%20showing%20video%20editing%20interface%2C%20translator%20working%20with%20advanced%20AI%20tools%2C%20modern%20clean%20office%20environment&width=400&height=250&seq=blog-1&orientation=landscape',
    tags: ['AI', 'Dịch Video', 'Chuyên Nghiệp']
  },
  {
    id: 2,
    title: 'Case Study: Kênh YouTube Tăng 300% Subscriber Nhờ Dịch Đa Ngôn Ngữ',
    excerpt: 'Câu chuyện thành công của kênh du lịch Việt Nam khi mở rộng ra thị trường quốc tế thông qua dịch video AI.',
    author: 'Trần Văn Đức',
    date: '12 Tháng 12, 2024',
    readTime: '12 phút đọc',
    category: 'Case Study',
    image: 'https://readdy.ai/api/search-image?query=YouTube%20analytics%20dashboard%20showing%20significant%20growth%20in%20subscribers%20and%20views%2C%20international%20audience%20demographics%2C%20success%20metrics%20and%20charts%20with%20upward%20trends&width=400&height=250&seq=blog-2&orientation=landscape',
    tags: ['YouTube', 'Tăng Trưởng', 'Thành Công']
  },
  {
    id: 3,
    title: 'Tương Lai Của Dịch Video: AI vs Con Người',
    excerpt: 'Phân tích sâu về xu hướng công nghệ dịch video và vai trò của con người trong kỷ nguyên AI.',
    author: 'Lê Thị Mai',
    date: '10 Tháng 12, 2024',
    readTime: '15 phút đọc',
    category: 'Công Nghệ',
    image: 'https://readdy.ai/api/search-image?query=Futuristic%20AI%20vs%20human%20comparison%20in%20video%20translation%2C%20split%20screen%20showing%20AI%20robot%20and%20human%20translator%2C%20high-tech%20visualization%20with%20digital%20elements%20and%20neural%20networks&width=400&height=250&seq=blog-3&orientation=landscape',
    tags: ['AI', 'Tương Lai', 'Công Nghệ']
  },
  {
    id: 4,
    title: 'Làm Thế Nào Để Chọn Giọng Nói Phù Hợp Cho Video Dịch',
    excerpt: 'Hướng dẫn chi tiết cách lựa chọn giọng nói AI phù hợp với nội dung và đối tượng mục tiêu của bạn.',
    author: 'Phạm Quang Huy',
    date: '8 Tháng 12, 2024',
    readTime: '6 phút đọc',
    category: 'Hướng Dẫn',
    image: 'https://readdy.ai/api/search-image?query=Voice%20selection%20interface%20showing%20different%20AI%20voice%20options%2C%20audio%20waveforms%20and%20voice%20characteristics%2C%20professional%20audio%20recording%20studio%20setup%20with%20modern%20equipment&width=400&height=250&seq=blog-4&orientation=landscape',
    tags: ['Giọng Nói', 'AI Voice', 'Lựa Chọn']
  },
  {
    id: 5,
    title: 'Top 5 Lỗi Thường Gặp Khi Dịch Video Và Cách Khắc Phục',
    excerpt: 'Tổng hợp những sai lầm phổ biến trong quá trình dịch video và giải pháp khắc phục hiệu quả.',
    author: 'Vũ Thị Lan',
    date: '5 Tháng 12, 2024',
    readTime: '10 phút đọc',
    category: 'Tips & Tricks',
    image: 'https://readdy.ai/api/search-image?query=Video%20translation%20error%20analysis%20with%20before%20and%20after%20comparison%2C%20correction%20interface%20showing%20mistakes%20and%20solutions%2C%20professional%20editing%20environment%20with%20error%20highlighting&width=400&height=250&seq=blog-5&orientation=landscape',
    tags: ['Lỗi', 'Khắc Phục', 'Kinh Nghiệm']
  },
  {
    id: 6,
    title: 'ROI Của Dịch Video: Đầu Tư 1$ Để Nhận Về 10$',
    excerpt: 'Phân tích chi tiết lợi nhuận đầu tư khi sử dụng dịch vụ dịch video để mở rộng thị trường quốc tế.',
    author: 'Hoàng Minh Tuấn',
    date: '2 Tháng 12, 2024',
    readTime: '14 phút đọc',
    category: 'Kinh Doanh',
    image: 'https://readdy.ai/api/search-image?query=Business%20ROI%20analytics%20dashboard%20showing%20revenue%20growth%20from%20video%20translation%20investment%2C%20financial%20charts%20and%20profit%20metrics%2C%20professional%20business%20analysis%20presentation&width=400&height=250&seq=blog-6&orientation=landscape',
    tags: ['ROI', 'Đầu Tư', 'Lợi Nhuận']
  }
];

export default function LibraryBlog() {
  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Blog &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Kiến Thức</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật những xu hướng mới nhất, kinh nghiệm thực tế và hướng dẫn chi tiết về dịch video AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1">
                  Đọc Tiếp
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2"></i>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 whitespace-nowrap">
            Xem Tất Cả Bài Viết
          </button>
        </div>
      </div>
    </section>
  );
}

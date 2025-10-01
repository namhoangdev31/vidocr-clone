export default function ServiceResources() {
  const articles = [
    {
      title: 'Tương lai của AI trong dịch video: Điều gì chờ đợi năm 2024',
      description: 'Khám phá những tiến bộ mới nhất trong công nghệ dịch AI và cách chúng đang định hình lại bối cảnh sáng tạo nội dung.',
      author: 'Dr. Sarah Kim',
      date: '15 Tháng 12, 2023',
      readTime: '5 phút đọc',
      category: 'Công nghệ AI',
      image: 'https://readdy.ai/api/search-image?query=Futuristic%20AI%20technology%20interface%20with%20video%20translation%20elements%2C%20holographic%20displays%20showing%20multiple%20languages%2C%20modern%20tech%20background%2C%20neural%20network%20visualization&width=400&height=300&seq=blog-0&orientation=landscape'
    },
    {
      title: 'Cách các YouTuber sử dụng AI Translation để tiếp cận khán giả toàn cầu',
      description: 'Câu chuyện thành công thực từ các nhà sáng tạo đã nhân lên số lượng người đăng ký bằng cách dịch nội dung sang nhiều ngôn ngữ.',
      author: 'Marcus Chen',
      date: '12 Tháng 12, 2023',
      readTime: '7 phút đọc',
      category: 'Câu chuyện thành công',
      image: 'https://readdy.ai/api/search-image?query=YouTube%20creator%20studio%20workspace%20with%20multiple%20monitors%20showing%20analytics%20and%20translation%20interfaces%2C%20professional%20content%20creation%20setup%2C%20global%20reach%20visualization&width=400&height=300&seq=blog-1&orientation=landscape'
    },
    {
      title: '10 thực hành tốt nhất cho dịch video thực sự hiệu quả',
      description: 'Mẹo chuyên gia về thời gian, thích ứng văn hóa và lựa chọn giọng nói để làm cho video dịch của bạn cảm thấy chân thực và hấp dẫn.',
      author: 'Emma Rodriguez',
      date: '10 Tháng 12, 2023',
      readTime: '6 phút đọc',
      category: 'Thực hành tốt nhất',
      image: 'https://readdy.ai/api/search-image?query=Video%20editing%20workspace%20with%20subtitle%20tracks%20and%20translation%20tools%2C%20professional%20video%20production%20setup%2C%20multiple%20language%20options%20displayed%2C%20editing%20timeline&width=400&height=300&seq=blog-2&orientation=landscape'
    }
  ];

  const aiNews = [
    { title: 'OpenAI phát hành GPT-4 Turbo với khả năng dịch thuật nâng cao', source: 'TechCrunch', time: '2 giờ trước' },
    { title: 'Google Translate thêm tính năng dịch video thời gian thực', source: 'The Verge', time: '5 giờ trước' },
    { title: 'Microsoft Azure Cognitive Services cải thiện chất lượng tổng hợp giọng nói', source: 'Microsoft Blog', time: '1 ngày trước' },
    { title: 'Meta công bố Universal Speech Translator cho 100+ ngôn ngữ', source: 'Meta AI Blog', time: '2 ngày trước' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tài nguyên & Thông tin chi tiết</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những điều mới nhất về công nghệ dịch AI và thực hành tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Bài viết mới nhất</h3>
              <button className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer">
                Xem tất cả bài viết
              </button>
            </div>

            <div className="space-y-8">
              {articles.map((article, index) => (
                <article key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-48 md:h-full object-top group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">{article.readTime}</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line w-4 h-4 flex items-center justify-center text-purple-600"></i>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{article.author}</div>
                            <div className="text-gray-500 text-sm">{article.date}</div>
                          </div>
                        </div>
                        <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center text-purple-600 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tin tức AI</h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                <div className="space-y-6">
                  {aiNews.map((news, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm leading-relaxed hover:text-purple-600 transition-colors">
                        {news.title}
                      </h5>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                  Đăng ký cập nhật AI
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Luôn cập nhật</h4>
              <p className="text-gray-600 text-sm mb-4">
                Nhận thông tin chi tiết hàng tuần về xu hướng dịch AI và tính năng mới.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                />
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all text-sm whitespace-nowrap cursor-pointer">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

export default function Blog() {
  const posts = [
    {
      image: 'https://dichtudong.com/image/blog_1.jpg',
      tag: 'NEW',
      date: '28/2/2023',
      comments: '65',
      title: 'Trí tuệ nhân tạo nâng cao giá trị sản phẩm của bạn lên gấp nhiều lần.'
    },
    {
      image: 'https://dichtudong.com/image/blog_1.webp',
      tag: 'NEW', 
      date: '23/3/2023',
      comments: '128',
      title: 'Tận dụng AI để tạo ra nguồn thu nhập thụ động khổng lồ trong thời đại cách mạng số.'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="mb-8">
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-4 block">
                Bài Viết & Thông Báo
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Duy trì tất cả <span className="relative">cập nhật
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
                </span> & thông báo
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Cập nhật những kiến thức và công nghệ mới nhất trong cuộc cách mạng AI.
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
              Xem tất cả bài viết <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <article key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.tag}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <i className="ri-calendar-line"></i>
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-chat-3-line"></i>
                        Bình Luận ({post.comments})
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h3>
                    
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2">
                      Đọc tiếp <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
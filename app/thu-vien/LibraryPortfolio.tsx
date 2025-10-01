
'use client';

import { useState } from 'react';

const categories = [
  { id: 'all', name: 'Tất Cả', count: 124 },
  { id: 'youtube', name: 'YouTube', count: 45 },
  { id: 'business', name: 'Doanh Nghiệp', count: 32 },
  { id: 'education', name: 'Giáo Dục', count: 28 },
  { id: 'entertainment', name: 'giải Trí', count: 19 }
];

const portfolioItems = [
  {
    id: 1,
    category: 'youtube',
    title: 'Kênh Du Lịch Việt Nam',
    description: 'Dịch video du lịch từ Tiếng Việt sang 12 ngôn ngữ khác nhau',
    views: '2.5M',
    languages: 12,
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20Vietnam%20travel%20video%20thumbnail%20showing%20scenic%20landscapes%20and%20tourist%20destinations%20with%20professional%20video%20player%20interface%2C%20bright%20colors%20and%20Vietnamese%20cultural%20elements&width=400&height=250&seq=portfolio-1&orientation=landscape',
    tags: ['Du lịch', 'Việt Nam', 'Đa ngôn ngữ']
  },
  {
    id: 2,
    category: 'business',
    title: 'Presentation Công Ty Tech',
    description: 'Dịch video giới thiệu sản phẩm công nghệ cho thị trường quốc tế',
    views: '1.8M',
    languages: 8,
    image: 'https://readdy.ai/api/search-image?query=Corporate%20technology%20presentation%20video%20with%20modern%20office%20background%2C%20professional%20speaker%20presenting%20to%20international%20audience%2C%20clean%20business%20setting%20with%20screens%20and%20tech%20elements&width=400&height=250&seq=portfolio-2&orientation=landscape',
    tags: ['Công nghệ', 'Doanh nghiệp', 'Quốc tế']
  },
  {
    id: 3,
    category: 'education',
    title: 'Khóa Học Online Marketing',
    description: 'Series video giảng dạy marketing được dịch sang 15 ngôn ngữ',
    views: '3.2M',
    languages: 15,
    image: 'https://readdy.ai/api/search-image?query=Online%20marketing%20education%20video%20with%20instructor%20teaching%20digital%20marketing%20concepts%2C%20professional%20classroom%20setup%20with%20presentation%20slides%20and%20engaging%20learning%20environment&width=400&height=250&seq=portfolio-3&orientation=landscape',
    tags: ['Marketing', 'Giáo dục', 'Online']
  },
  {
    id: 4,
    category: 'entertainment',
    title: 'Show Giải Trí Việt',
    description: 'Chương trình giải trí được phát sóng trên nhiều nền tảng quốc tế',
    views: '4.1M',
    languages: 10,
    image: 'https://readdy.ai/api/search-image?query=Vietnamese%20entertainment%20show%20with%20colorful%20stage%20lights%20and%20performers%2C%20vibrant%20and%20fun%20atmosphere%20with%20international%20audience%20appeal%2C%20bright%20cheerful%20colors&width=400&height=250&seq=portfolio-4&orientation=landscape',
    tags: ['Show', 'Giải trí', 'Việt Nam']
  },
  {
    id: 5,
    category: 'youtube',
    title: 'Kênh Nấu Ăn Truyền Thống',
    description: 'Video nấu ăn món Việt Nam được chia sẻ toàn cầu',
    views: '5.5M',
    languages: 20,
    image: 'https://readdy.ai/api/search-image?query=Traditional%20Vietnamese%20cooking%20video%20with%20chef%20preparing%20authentic%20dishes%20in%20modern%20kitchen%2C%20colorful%20ingredients%20and%20traditional%20cooking%20methods%2C%20appetizing%20food%20presentation&width=400&height=250&seq=portfolio-5&orientation=landscape',
    tags: ['Nấu ăn', 'Truyền thống', 'YouTube']
  },
  {
    id: 6,
    category: 'business',
    title: 'Workshop Kỹ Năng Lãnh Đạo',
    description: 'Video đào tạo lãnh đạo cho các công ty đa quốc gia',
    views: '1.2M',
    languages: 6,
    image: 'https://readdy.ai/api/search-image?query=Professional%20leadership%20workshop%20with%20business%20executives%20in%20conference%20room%2C%20diverse%20international%20team%20learning%20leadership%20skills%2C%20modern%20corporate%20training%20environment&width=400&height=250&seq=portfolio-6&orientation=landscape',
    tags: ['Lãnh đạo', 'Đào tạo', 'Doanh nghiệp']
  }
];

export default function LibraryPortfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Portfolio
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Thành Công</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những dự án dịch video nổi bật đã giúp khách hàng mở rộng tầm ảnh hưởng ra toàn cầu
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  <i className="ri-play-fill w-4 h-4 flex items-center justify-center inline mr-1"></i>
                  {item.views} views
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-blue-600 text-sm">
                    <i className="ri-global-line w-4 h-4 flex items-center justify-center mr-1"></i>
                    {item.languages} ngôn ngữ
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 whitespace-nowrap">
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 whitespace-nowrap">
            Xem Thêm Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}
